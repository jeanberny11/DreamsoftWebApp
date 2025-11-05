import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from './AuthLayout';
import { createForgotPasswordSchema, type ForgotPasswordFormData } from '../utils/validation.schemas';
import { authService } from '../services/auth.service';
import { ROUTES } from '../../../app/router/routes.constants';

// ========================================
// FORGOT PASSWORD PAGE COMPONENT
// ========================================

export const ForgotPasswordPage: React.FC = () => {
  const toastRef = useRef<Toast>(null);
  const { t } = useTranslation(['auth', 'common', 'validation']);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: {
      email: '',
      userName: '',
    },
  });

  // ========================================
  // FORM SUBMIT HANDLER
  // ========================================
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setIsRateLimited(false);

      // Call auth service
      const response = await authService.forgotPassword(data);

      if (response.success) {
        setIsSuccess(true);

        // Show success toast
        toastRef.current?.show({
          severity: 'success',
          summary: t('auth:forgotPassword.success'),
          detail: t('auth:forgotPassword.successDetail'),
          life: 6000,
        });

        // Reset form
        reset();
      }else{
        // Handle unsuccessful response
        toastRef.current?.show({
          severity: 'error',
          summary: t('auth:forgotPassword.error'),
          detail: response.message || t('common:messages.error'),
          life: 5000,
        });
      }
    } catch (error: any) {
      // Check if rate limited
      if (error.message?.toLowerCase().includes('too many') ||
          error.message?.toLowerCase().includes('rate limit')) {
        setIsRateLimited(true);

        toastRef.current?.show({
          severity: 'warn',
          summary: t('auth:forgotPassword.rateLimitError'),
          detail: t('auth:forgotPassword.rateLimitDetail'),
          life: 6000,
        });
      } else {
        // Generic error
        toastRef.current?.show({
          severity: 'error',
          summary: t('auth:forgotPassword.error'),
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
      title={t('auth:forgotPassword.title')}
      subtitle={t('auth:forgotPassword.subtitle')}
    >
      <Toast ref={toastRef} />

      {/* Success Message */}
      {isSuccess && (
        <Message
          severity="success"
          text={t('auth:forgotPassword.successDetail')}
          className="mb-4 w-full"
        />
      )}

      {/* Rate Limit Warning */}
      {isRateLimited && (
        <Message
          severity="warn"
          text={t('auth:forgotPassword.rateLimitDetail')}
          className="mb-4 w-full"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ========================================
            EMAIL FIELD
            ======================================== */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('auth:forgotPassword.email')}
          </label>
          <InputText
            id="email"
            type="email"
            placeholder={t('auth:forgotPassword.emailPlaceholder')}
            className={`w-full ${errors.email ? 'p-invalid' : ''}`}
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <small className="text-red-500 mt-1 block">
              {errors.email.message}
            </small>
          )}
        </div>

        {/* ========================================
            USERNAME FIELD
            ======================================== */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('auth:forgotPassword.username')}
          </label>
          <InputText
            id="userName"
            type="text"
            placeholder={t('auth:forgotPassword.usernamePlaceholder')}
            className={`w-full ${errors.userName ? 'p-invalid' : ''}`}
            {...register('userName')}
            disabled={isLoading}
          />
          {errors.userName && (
            <small className="text-red-500 mt-1 block">
              {errors.userName.message}
            </small>
          )}
        </div>

        {/* ========================================
            SUBMIT BUTTON
            ======================================== */}
        <Button
          type="submit"
          label={isLoading ? t('auth:forgotPassword.submitting') : t('auth:forgotPassword.submit')}
          icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-send'}
          className="w-full"
          disabled={isLoading}
        />

        {/* ========================================
            BACK TO LOGIN LINK
            ======================================== */}
        <div className="text-center">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
          >
            <i className="pi pi-arrow-left" />
            {t('auth:forgotPassword.backToLogin')}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
