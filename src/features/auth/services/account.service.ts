/**
 * Account Service
 *
 * Location: src/features/auth/services/account.service.ts
 *
 * Handles all account-related API calls (registration, email verification, location data)
 * Uses the centralized apiClient for consistent request handling
 */

import apiClient from "../../../data/remote/api/client";
import type {
  Gender,
  IdType,
  Country,
  Province,
  Municipality,
  AccountCreate,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
} from "../types/account.types";

// ========================================
// API ENDPOINTS
// ========================================

const ENDPOINTS = {
  // Email Verification
  SEND_VERIFICATION_CODE: "/dreamsoftapi/Account/SendVerificationCode",
  VERIFY_EMAIL_CODE: "/dreamsoftapi/Account/VerifyEmailCode",

  // Account Creation
  CREATE_ACCOUNT: "/dreamsoftapi/Account/CreateAccount",

  // Location & Personal Data
  GET_GENDERS_ACTIVE: "/dreamsoftapi/Gender/GetAllActive",
  GET_ID_TYPES_ACTIVE: "/dreamsoftapi/IdType/GetAllActive",
  GET_COUNTRIES_ACTIVE: "/dreamsoftapi/Country/GetAllActive",
  GET_PROVINCES_COUNTRY: "/dreamsoftapi/Province/GetProvincesByCountryId",
  GET_MUNICIPALITIES_PROVINCE: "/dreamsoftapi/Municipality/GetMunicipalitiesByProvinceId",
};

// ========================================
// EMAIL VERIFICATION SERVICES
// ========================================

/**
 * Send verification code to email
 *
 * @param email - User's email address
 * @returns Promise with success status and message
 */
export const sendVerificationCode = async (
  email: string
): Promise<SendVerificationCodeResponse> => {
  const request: SendVerificationCodeRequest = { email };
  const response = await apiClient.post<SendVerificationCodeResponse>(
    ENDPOINTS.SEND_VERIFICATION_CODE,
    request
  );
  return response.data;
};

/**
 * Verify email code
 *
 * @param email - User's email address
 * @param code - 6-digit verification code
 * @returns Promise with verification status
 */
export const verifyEmailCode = async (
  email: string,
  code: string
): Promise<VerifyEmailCodeResponse> => {
  const request: VerifyEmailCodeRequest = { email, code };
  const response = await apiClient.post<VerifyEmailCodeResponse>(
    ENDPOINTS.VERIFY_EMAIL_CODE,
    request
  );
  return response.data;
};

// ========================================
// PERSONAL DATA SERVICES
// ========================================

/**
 * Get all active genders
 *
 * @returns Promise with array of genders
 */
export const getGendersActive = async (): Promise<Gender[]> => {
  const response = await apiClient.get<Gender[]>(ENDPOINTS.GET_GENDERS_ACTIVE);
  return response.data;
};

/**
 * Get all ID types
 *
 * @returns Promise with array of ID types
 */
export const getIdTypesActive = async (): Promise<IdType[]> => {
  const response = await apiClient.get<IdType[]>(ENDPOINTS.GET_ID_TYPES_ACTIVE);
  return response.data;
};

// ========================================
// LOCATION SERVICES
// ========================================

/**
 * Get all active countries
 *
 * @returns Promise with array of countries
 */
export const getCountriesActive = async (): Promise<Country[]> => {
  const response = await apiClient.get<Country[]>(
    ENDPOINTS.GET_COUNTRIES_ACTIVE
  );
  return response.data;
};

/**
 * Get provinces by country code (direct API call)
 *
 * @param countryId - Country ID to get provinces for
 * @returns Promise with array of provinces for the specified country
 */
export const getProvincesByCountryId = async (
  countryId: number
): Promise<Province[]> => {
  const response = await apiClient.get<Province[]>(
    ENDPOINTS.GET_PROVINCES_COUNTRY,
    {
      params: { countryId },
    }
  );
  return response.data;
};

/**
 * Get municipalities by province ID (direct API call)
 *
 * @param provinceId - Province ID to get municipalities for
 * @returns Promise with array of municipalities for the specified province
 */
export const getMunicipalitiesByProvinceId = async (
  provinceId: number
): Promise<Municipality[]> => {
  const response = await apiClient.get<Municipality[]>(
    ENDPOINTS.GET_MUNICIPALITIES_PROVINCE,
    {
      params: { provinceId },
    }
  );
  return response.data;
};

// ========================================
// ACCOUNT CREATION SERVICE
// ========================================

/**
 * Create new account
 *
 * @param accountData - Complete account information
 * @returns Promise with created account data
 */
export const createAccount = async (
  accountData: AccountCreate
): Promise<any> => {
  console.log("Creating account with data:", accountData);
  const response = await apiClient.post(ENDPOINTS.CREATE_ACCOUNT, accountData);
  return response.data;
};

// ========================================
// EXPORTED SERVICE OBJECT
// ========================================

const accountService = {
  sendVerificationCode,
  verifyEmailCode,
  getGendersActive,
  getIdTypesActive,
  getCountriesActive,
  getProvincesByCountryId,
  getMunicipalitiesByProvinceId,
  createAccount,
};

export default accountService;
