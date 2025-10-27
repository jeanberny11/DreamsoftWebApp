# Backend Implementation Guide: Secure Token Authentication

This guide explains the backend changes required to support the new secure token authentication system with memory-only access tokens and HttpOnly refresh tokens.

## Overview

**Frontend Changes (Already Implemented):**
- ✅ Access tokens stored in memory only (cleared on page refresh)
- ✅ Automatic token refresh with queued requests
- ✅ No sensitive tokens in localStorage

**Backend Requirements:**
- Implement HttpOnly cookie-based refresh tokens
- Update login endpoint to set refresh token cookie
- Update logout endpoint to clear refresh token cookie
- Ensure refresh token endpoint reads from HttpOnly cookie

---

## 1. Login Endpoint Changes

### Current Endpoint: `/dreamsoftapi/Login/Login`

**Required Changes:**

```csharp
[HttpPost("Login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // Your existing authentication logic...
    var user = await AuthenticateUser(request.Email, request.Password);

    if (user == null)
    {
        return Unauthorized(new { message = "Invalid credentials" });
    }

    // Generate access token (short-lived, e.g., 15 minutes)
    var accessToken = GenerateAccessToken(user);

    // Generate refresh token (long-lived, e.g., 7 days)
    var refreshToken = GenerateRefreshToken(user);

    // Store refresh token in database (for validation later)
    await SaveRefreshTokenToDatabase(user.UserId, refreshToken);

    // Set refresh token as HttpOnly cookie
    Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
    {
        HttpOnly = true,          // Cannot be accessed by JavaScript
        Secure = true,            // Only sent over HTTPS (disable for local dev)
        SameSite = SameSiteMode.Strict,  // CSRF protection
        Expires = DateTimeOffset.UtcNow.AddDays(7),
        Path = "/"
    });

    // Return access token in response body (will be stored in memory by frontend)
    return Ok(new LoginResponse
    {
        AccessToken = accessToken,  // Changed from "token" to "accessToken"
        User = user
    });
}
```

**Key Points:**
- Access token is SHORT-lived (15 minutes recommended)
- Refresh token is LONG-lived (7 days recommended)
- Refresh token sent as HttpOnly cookie (not in response body)
- Response field changed from `token` to `accessToken`

---

## 2. Refresh Token Endpoint Changes

### Current Endpoint: `/dreamsoftapi/Login/RefreshToken`

**Required Changes:**

```csharp
[HttpPost("RefreshToken")]
public async Task<IActionResult> RefreshToken()
{
    // Read refresh token from HttpOnly cookie (NOT from request body)
    if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
    {
        return Unauthorized(new { message = "No refresh token found" });
    }

    // Validate refresh token
    var userId = ValidateRefreshToken(refreshToken);
    if (userId == null)
    {
        // Invalid or expired refresh token
        Response.Cookies.Delete("refreshToken"); // Clear invalid cookie
        return Unauthorized(new { message = "Invalid refresh token" });
    }

    // Check if refresh token exists in database and is not revoked
    var isValid = await IsRefreshTokenValid(userId.Value, refreshToken);
    if (!isValid)
    {
        Response.Cookies.Delete("refreshToken");
        return Unauthorized(new { message = "Refresh token revoked" });
    }

    // Get user data
    var user = await GetUserById(userId.Value);

    // Generate new access token
    var newAccessToken = GenerateAccessToken(user);

    // Optional: Rotate refresh token (generate new one)
    var newRefreshToken = GenerateRefreshToken(user);
    await UpdateRefreshTokenInDatabase(userId.Value, newRefreshToken);

    Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(7),
        Path = "/"
    });

    // Return only new access token
    return Ok(new RefreshTokenResponse
    {
        AccessToken = newAccessToken
    });
}
```

**Key Points:**
- Refresh token read from HttpOnly cookie (automatic by browser)
- Validate refresh token against database (check if revoked)
- Generate new access token
- Optional: Rotate refresh token for better security
- Return only access token in response

---

## 3. Logout Endpoint Changes

### Current Endpoint: `/dreamsoftapi/Login/Logout`

**Required Changes:**

```csharp
[HttpPost("Logout")]
public async Task<IActionResult> Logout()
{
    // Get refresh token from cookie
    if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
    {
        // Revoke refresh token in database
        await RevokeRefreshToken(refreshToken);
    }

    // Clear the refresh token cookie
    Response.Cookies.Delete("refreshToken", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = "/"
    });

    return Ok(new { message = "Logged out successfully" });
}
```

**Key Points:**
- Revoke refresh token in database
- Clear HttpOnly cookie
- Frontend will clear access token from memory

---

## 4. CORS Configuration

**CRITICAL:** Your CORS policy must allow credentials for HttpOnly cookies to work.

```csharp
// In Program.cs or Startup.cs
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173", "http://localhost:3000") // Your frontend URLs
            .AllowCredentials()  // REQUIRED for cookies
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");
```

**Key Points:**
- Use `.AllowCredentials()` to allow cookies
- Specify exact origins (cannot use wildcard with credentials)
- Frontend already has `withCredentials: true` in axios config

---

## 5. Database Schema for Refresh Tokens

**Recommended table structure:**

```sql
CREATE TABLE RefreshTokens (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT NOT NULL,
    Token NVARCHAR(500) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RevokedAt DATETIME2 NULL,
    IsRevoked BIT NOT NULL DEFAULT 0,

    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Index for fast lookups
CREATE INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
```

**Helper Methods:**

```csharp
// Save refresh token
private async Task SaveRefreshTokenToDatabase(int userId, string token)
{
    var refreshToken = new RefreshToken
    {
        UserId = userId,
        Token = token,
        ExpiresAt = DateTime.UtcNow.AddDays(7),
        CreatedAt = DateTime.UtcNow
    };

    await _context.RefreshTokens.AddAsync(refreshToken);
    await _context.SaveChangesAsync();
}

// Validate refresh token
private async Task<bool> IsRefreshTokenValid(int userId, string token)
{
    var refreshToken = await _context.RefreshTokens
        .FirstOrDefaultAsync(rt =>
            rt.UserId == userId &&
            rt.Token == token &&
            !rt.IsRevoked &&
            rt.ExpiresAt > DateTime.UtcNow);

    return refreshToken != null;
}

// Revoke refresh token
private async Task RevokeRefreshToken(string token)
{
    var refreshToken = await _context.RefreshTokens
        .FirstOrDefaultAsync(rt => rt.Token == token);

    if (refreshToken != null)
    {
        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
}

// Update refresh token (rotation)
private async Task UpdateRefreshTokenInDatabase(int userId, string newToken)
{
    // Revoke old tokens
    var oldTokens = await _context.RefreshTokens
        .Where(rt => rt.UserId == userId && !rt.IsRevoked)
        .ToListAsync();

    foreach (var oldToken in oldTokens)
    {
        oldToken.IsRevoked = true;
        oldToken.RevokedAt = DateTime.UtcNow;
    }

    // Save new token
    await SaveRefreshTokenToDatabase(userId, newToken);
}
```

---

## 6. Token Generation Examples

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

// Generate Access Token (JWT)
private string GenerateAccessToken(User user)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]); // Your secret key

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Account.Email),
            new Claim(ClaimTypes.Role, user.Role.Name)
        }),
        Expires = DateTime.UtcNow.AddMinutes(15), // Short-lived
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}

// Generate Refresh Token (Random string)
private string GenerateRefreshToken()
{
    var randomNumber = new byte[64];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomNumber);
    return Convert.ToBase64String(randomNumber);
}

// Validate Refresh Token
private int? ValidateRefreshToken(string token)
{
    // In this implementation, we just check the database
    // The token itself is a random string, not a JWT
    // Validation happens in IsRefreshTokenValid method
    return null; // Placeholder - actual validation in IsRefreshTokenValid
}
```

---

## 7. Response DTOs

```csharp
public class LoginResponse
{
    public string AccessToken { get; set; }  // Changed from "Token"
    public User User { get; set; }
}

public class RefreshTokenResponse
{
    public string AccessToken { get; set; }
}
```

---

## 8. Testing Guide

### Test Login:
```bash
curl -X POST http://localhost:5279/dreamsoftapi/Login/Login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Should set refreshToken cookie and return accessToken in body
```

### Test Refresh:
```bash
curl -X POST http://localhost:5279/dreamsoftapi/Login/RefreshToken \
  -b cookies.txt \
  -c cookies.txt

# Should read refreshToken cookie and return new accessToken
```

### Test Logout:
```bash
curl -X POST http://localhost:5279/dreamsoftapi/Login/Logout \
  -b cookies.txt

# Should clear refreshToken cookie
```

---

## 9. Security Best Practices

1. **Token Expiry Times:**
   - Access Token: 15 minutes (short-lived)
   - Refresh Token: 7 days (long-lived, but revocable)

2. **HTTPS Only:**
   - Set `Secure = true` in production
   - Use `Secure = false` only for local development

3. **Refresh Token Rotation:**
   - Generate new refresh token on each refresh
   - Revoke old refresh tokens
   - Detect token reuse (potential attack)

4. **Token Revocation:**
   - Store refresh tokens in database
   - Implement revocation on logout
   - Allow users to revoke all sessions

5. **CORS:**
   - Specify exact origins (no wildcards)
   - Enable credentials support
   - Validate origin on server

---

## 10. Migration Checklist

- [ ] Update Login endpoint to return `accessToken` instead of `token`
- [ ] Set refresh token as HttpOnly cookie in Login endpoint
- [ ] Update RefreshToken endpoint to read from cookie
- [ ] Update Logout endpoint to clear cookie
- [ ] Create RefreshTokens database table
- [ ] Implement token storage/validation methods
- [ ] Configure CORS with `.AllowCredentials()`
- [ ] Test login flow
- [ ] Test refresh flow
- [ ] Test logout flow
- [ ] Test token expiration
- [ ] Enable `Secure = true` in production

---

## Summary

**What Changed:**
- Access tokens now sent in response body (stored in memory by frontend)
- Refresh tokens now sent as HttpOnly cookies (automatic by browser)
- Better security: tokens not accessible by JavaScript
- Automatic refresh: frontend handles expired access tokens

**Frontend (Already Done):**
- ✅ Stores access tokens in memory
- ✅ Automatically refreshes on 401 errors
- ✅ Queues requests during refresh
- ✅ Sends cookies with `withCredentials: true`

**Backend (Your Tasks):**
- Update response field from `token` to `accessToken`
- Set refresh token as HttpOnly cookie
- Read refresh token from cookie (not request body)
- Store/validate refresh tokens in database
- Enable CORS with credentials
