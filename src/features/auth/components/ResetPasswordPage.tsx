import React, { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from './AuthLayout';
import { createResetPasswordSchema, type ResetPasswordFormData } from '../utils/validation.schemas';
import { authService } from '../services/auth.service';

// ========================================
// PASSWORD STRENGTH HELPER
// ========================================

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (!password) return { score: 0, label: '', color: '' };

  // Length
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Complexity
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  // Determine label and color
  if (score < 40) return { score, label: 'Weak', color: 'danger' };
  if (score < 60) return { score, label: 'Fair', color: 'warning' };
  if (score < 80) return { score, label: 'Good', color: 'info' };
  return { score: 100, label: 'Strong', color: 'success' };
};

// ========================================
// RESET PASSWORD PAGE COMPONENT
// ========================================

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  const { t } = useTranslation(['auth', 'common', 'validation']);

  // Get token from URL - support both /reset-password/:token and ?token=xxx
  const { token: paramToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');
  const token = paramToken || queryToken;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch password for strength indicator
  const newPassword = watch('newPassword');
  const passwordStrength = calculatePasswordStrength(newPassword || '');

  // ========================================
  // CHECK TOKEN ON MOUNT
  // ========================================
  useEffect(() => {
    if (!token) {
      setIsInvalidToken(true);
      toastRef.current?.show({
        severity: 'error',
        summary: t('auth:resetPassword.invalidToken'),
        detail: t('auth:resetPassword.invalidTokenDetail'),
        life: 5000,
      });
    }
  }, [token, t]);

  // ========================================
  // FORM SUBMIT HANDLER
  // ========================================
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toastRef.current?.show({
        severity: 'error',
        summary: t('auth:resetPassword.error'),
        detail: t('auth:resetPassword.invalidTokenDetail'),
        life: 5000,
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsInvalidToken(false);

      // Call auth service with token from URL
      const response = await authService.resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response.success) {
        setIsSuccess(true);

        // Show success toast
        toastRef.current?.show({
          severity: 'success',
          summary: t('auth:resetPassword.success'),
          detail: t('auth:resetPassword.successDetail'),
          life: 5000,
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Handle unsuccessful response
        toastRef.current?.show({
          severity: 'error',
          summary: t('auth:resetPassword.error'),
          detail: response.message || t('common:messages.error'),
          life: 5000,
        });
      }
    } catch (error: any) {
      // Check if token is invalid/expired
      if (error.message?.toLowerCase().includes('invalid') ||
          error.message?.toLowerCase().includes('expired')) {
        setIsInvalidToken(true);

        toastRef.current?.show({
          severity: 'error',
          summary: t('auth:resetPassword.invalidToken'),
          detail: t('auth:resetPassword.invalidTokenDetail'),
          life: 6000,
        });
      } else {
        // Generic error
        toastRef.current?.show({
          severity: 'error',
          summary: t('auth:resetPassword.error'),
          detail: error.message || t('common:messages.error'),
          life: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <AuthLayout
      title={t('auth:resetPassword.title')}
      subtitle={t('auth:resetPassword.subtitle')}
    >
      <Toast ref={toastRef} />

      {/* Success Message */}
      {isSuccess && (
        <Message
          severity="success"
          text={t('auth:resetPassword.successDetail')}
          className="mb-4 w-full"
        />
      )}

      {/* Invalid Token Warning */}
      {isInvalidToken && (
        <Message
          severity="error"
          text={t('auth:resetPassword.invalidTokenDetail')}
          className="mb-4 w-full"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ========================================
            NEW PASSWORD FIELD
            ======================================== */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('auth:resetPassword.newPassword')}
          </label>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Password
                id="newPassword"
                {...field}
                placeholder={t('auth:resetPassword.newPasswordPlaceholder')}
                toggleMask
                feedback={false}
                className={`w-full ${errors.newPassword ? 'p-invalid' : ''}`}
                inputClassName="w-full"
                disabled={isLoading || isInvalidToken}
              />
            )}
          />
          {errors.newPassword && (
            <small className="text-red-500 block mt-1">
              {errors.newPassword.message}
            </small>
          )}

          {/* Password Strength Indicator */}
          {newPassword && passwordStrength.label && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <small className="text-gray-600">
                  {t('auth:resetPassword.passwordStrength')}:
                </small>
                <small className={`font-medium text-${passwordStrength.color}`}>
                  {passwordStrength.label}
                </small>
              </div>
              <ProgressBar
                value={passwordStrength.score}
                showValue={false}
                className="h-2"
                color={
                  passwordStrength.color === 'danger'
                    ? '#ef4444'
                    : passwordStrength.color === 'warning'
                    ? '#f59e0b'
                    : passwordStrength.color === 'info'
                    ? '#3b82f6'
                    : '#10b981'
                }
              />
              <small className="text-gray-500 text-xs mt-1 block">
                {t('auth:resetPassword.passwordHint')}
              </small>
            </div>
          )}
        </div>

        {/* ========================================
            CONFIRM PASSWORD FIELD
            ======================================== */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('auth:resetPassword.confirmPassword')}
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Password
                id="confirmPassword"
                {...field}
                placeholder={t('auth:resetPassword.confirmPasswordPlaceholder')}
                toggleMask
                feedback={false}
                className={`w-full ${errors.confirmPassword ? 'p-invalid' : ''}`}
                inputClassName="w-full"
                disabled={isLoading || isInvalidToken}
              />
            )}
          />
          {errors.confirmPassword && (
            <small className="text-red-500 block mt-1">
              {errors.confirmPassword.message}
            </small>
          )}
        </div>

        {/* ========================================
            SUBMIT BUTTON
            ======================================== */}
        <Button
          type="submit"
          label={isLoading ? t('auth:resetPassword.submitting') : t('auth:resetPassword.submit')}
          icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
          className="w-full"
          disabled={isLoading || isInvalidToken || isSuccess}
        />

        {/* ========================================
            BACK TO LOGIN LINK
            ======================================== */}
        <div className="text-center">
          <Button
            type="button"
            label={t('auth:forgotPassword.backToLogin')}
            icon="pi pi-arrow-left"
            className="p-button-text p-button-sm"
            onClick={() => navigate('/login')}
          />
        </div>
      </form>
    </AuthLayout>
  );
};
