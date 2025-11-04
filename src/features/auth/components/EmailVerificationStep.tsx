/**
 * Email Verification Step Component
 *
 * Location: src/features/auth/components/EmailVerificationStep.tsx
 *
 * Handles ONLY email verification - user must verify before proceeding
 */
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createEmailVerificationStepSchema,
  type EmailVerificationStepData,
} from "../utils/register.validation";
import accountService from "../services/account.service";

// ========================================
// COMPONENT PROPS
// ========================================

interface EmailVerificationStepProps {
  data: EmailVerificationStepData;
  onNext: (data: EmailVerificationStepData) => void;
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function EmailVerificationStep({
  data,
  onNext,
}: EmailVerificationStepProps) {
  const { t } = useTranslation(['auth', 'common']);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState<string>("");
  const [codeSuccess, setCodeSuccess] = useState<string>("");
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<EmailVerificationStepData>({
    resolver: zodResolver(createEmailVerificationStepSchema(t)),
    defaultValues: data,
  });

  const email = watch("email");
  const emailVerified = watch("emailVerified");

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ========================================
  // SEND VERIFICATION CODE
  // ========================================

  const handleSendCode = async () => {
    const isValid = await trigger("email");
    if (!isValid) return;

    setSendingCode(true);
    setCodeError("");
    setCodeSuccess("");

    try {
      const response = await accountService.sendVerificationCode(email);

      if (response.success) {
        setCodeSent(true);
        setCodeSuccess(t('auth:register.emailVerification.codeSent'));
        setCountdown(300); // 5 minutes countdown
      } else {
        setCodeError(response.message || t('auth:register.emailVerification.sendError'));
      }
    } catch (error: any) {
      setCodeError(
        error.response?.data?.ErrorMessage ||
          error.response?.data?.message ||
          t('auth:register.emailVerification.sendError')
      );
    } finally {
      setSendingCode(false);
    }
  };

  // ========================================
  // VERIFY CODE
  // ========================================

  const handleVerifyCode = async () => {
    const isValid = await trigger("verificationCode");
    if (!isValid) return;

    setVerifyingCode(true);
    setCodeError("");
    setCodeSuccess("");

    try {
      const code = watch("verificationCode");
      const response = await accountService.verifyEmailCode(email, code);

      if (response.success && response.verified) {
        setValue("emailVerified", true);
        setCodeSuccess(t('auth:register.emailVerification.codeVerified'));
        await trigger("emailVerified");
      } else {
        setCodeError(response.message || t('auth:register.emailVerification.codeInvalid'));
        setValue("emailVerified", false);
      }
    } catch (error: any) {
      setCodeError(
        error.response?.data?.ErrorMessage ||
          error.response?.data?.message ||
          t('auth:register.emailVerification.verifyError')
      );
      setValue("emailVerified", false);
    } finally {
      setVerifyingCode(false);
    }
  };

  // ========================================
  // SUBMIT EMAIL VERIFICATION STEP
  // ========================================

  const onSubmit = (formData: EmailVerificationStepData) => {
    onNext(formData);
  };

  // ========================================
  // HELPER: FORMAT TIME
  // ========================================

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Email Verification Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('auth:register.emailVerification.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('auth:register.emailVerification.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.emailVerification.email')} *
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="email"
                      {...field}
                      type="email"
                      placeholder={t('auth:register.emailVerification.emailPlaceholder')}
                      className={`w-full ${errors.email ? "p-invalid" : ""}`}
                      disabled={emailVerified}
                    />
                  )}
                />
              </div>
              <Button
                type="button"
                label={
                  sendingCode
                    ? t('auth:register.emailVerification.sending')
                    : codeSent
                    ? t('auth:register.emailVerification.resend')
                    : t('auth:register.emailVerification.sendCode')
                }
                icon={sendingCode ? "pi pi-spin pi-spinner" : "pi pi-send"}
                onClick={handleSendCode}
                disabled={
                  sendingCode || emailVerified || (codeSent && countdown > 0)
                }
                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              />
            </div>
            {errors.email && (
              <small className="text-red-500 block mt-1">
                {errors.email.message}
              </small>
            )}
            {countdown > 0 && !emailVerified && (
              <small className="text-gray-600 block mt-1">
                {t('auth:register.emailVerification.resendAvailable')} {formatTime(countdown)}
              </small>
            )}
          </div>

          {/* Verification Code Input */}
          {codeSent && !emailVerified && (
            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth:register.emailVerification.code')} *
              </label>
              <div className="flex gap-2">
                <Controller
                  name="verificationCode"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="verificationCode"
                      {...field}
                      placeholder={t('auth:register.emailVerification.codePlaceholder')}
                      maxLength={6}
                      className={`flex-1 ${
                        errors.verificationCode ? "p-invalid" : ""
                      }`}
                    />
                  )}
                />
                <Button
                  type="button"
                  label={
                    verifyingCode
                      ? t('auth:register.emailVerification.verifying')
                      : t('auth:register.emailVerification.verify')
                  }
                  icon={verifyingCode ? "pi pi-spin pi-spinner" : "pi pi-check"}
                  onClick={handleVerifyCode}
                  disabled={verifyingCode}
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                />
              </div>
              {errors.verificationCode && (
                <small className="text-red-500 block mt-1">
                  {errors.verificationCode.message}
                </small>
              )}
              <small className="text-gray-500 text-xs mt-1 block">
                {t('auth:register.emailVerification.checkInbox')}
              </small>
            </div>
          )}

          {/* Success/Error Messages */}
          {codeSuccess && (
            <Message severity="success" text={codeSuccess} className="w-full" />
          )}
          {codeError && (
            <Message severity="error" text={codeError} className="w-full" />
          )}
          {errors.emailVerified && !emailVerified && (
            <Message
              severity="warn"
              text={errors.emailVerified.message}
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Info Box - Only show after verification */}
      {emailVerified && (
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
          <div className="flex items-start gap-3">
            <i className="pi pi-check-circle text-primary-600 text-xl mt-0.5"></i>
            <div className="text-sm text-primary-900">
              <p className="font-medium mb-1">{t('auth:register.emailVerification.verifiedTitle')}</p>
              <p className="text-primary-800">
                {t('auth:register.emailVerification.verifiedDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          label={t('common:actions.next')}
          icon="pi pi-arrow-right"
          iconPos="right"
          disabled={!emailVerified}
        />
      </div>
    </form>
  );
}
