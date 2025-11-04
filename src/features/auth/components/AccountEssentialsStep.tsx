import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createAccountEssentialsStepSchema,
  type AccountEssentialsStepData,
  getPasswordStrength,
} from "../utils/register.validation";

// ========================================
// COMPONENT PROPS
// ========================================

interface AccountEssentialsStepProps {
  data: AccountEssentialsStepData;
  onNext: (data: AccountEssentialsStepData) => void;
  onBack: () => void;
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function AccountEssentialsStep({
  data,
  onNext,
  onBack,
}: AccountEssentialsStepProps) {
  const { t } = useTranslation(['auth', 'common']);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AccountEssentialsStepData>({
    resolver: zodResolver(createAccountEssentialsStepSchema(t)),
    defaultValues: data,
  });

  const password = watch("password");

  // Update password strength indicator
  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password, t));
    } else {
      setPasswordStrength({ score: 0, label: "", color: "" });
    }
  }, [password, t]);

  // ========================================
  // SUBMIT ACCOUNT ESSENTIALS STEP
  // ========================================

  const onSubmit = (formData: AccountEssentialsStepData) => {
    onNext(formData);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Account Essentials Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('auth:register.accountEssentials.username')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('auth:register.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.accountEssentials.firstName')} *
            </label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <InputText
                  id="firstName"
                  {...field}
                  placeholder="John"
                  className={`w-full ${errors.firstName ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.firstName && (
              <small className="text-red-500 block mt-1">
                {errors.firstName.message}
              </small>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.accountEssentials.lastName')} *
            </label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <InputText
                  id="lastName"
                  {...field}
                  placeholder="Doe"
                  className={`w-full ${errors.lastName ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.lastName && (
              <small className="text-red-500 block mt-1">
                {errors.lastName.message}
              </small>
            )}
          </div>

          {/* Username */}
          <div className="md:col-span-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.accountEssentials.username')} *
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <InputText
                  id="username"
                  {...field}
                  placeholder={t('auth:register.accountEssentials.username')}
                  className={`w-full ${errors.username ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.username && (
              <small className="text-red-500 block mt-1">
                {errors.username.message}
              </small>
            )}
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.accountEssentials.password')} *
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password
                  id="password"
                  {...field}
                  placeholder={t('auth:register.accountEssentials.password')}
                  toggleMask
                  feedback={false}
                  className={`w-full ${errors.password ? "p-invalid" : ""}`}
                  inputClassName="w-full"
                />
              )}
            />
            {errors.password && (
              <small className="text-red-500 block mt-1">
                {errors.password.message}
              </small>
            )}
            {password && passwordStrength.label && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <small className="text-gray-600">{t('auth:register.accountEssentials.passwordStrength')}:</small>
                  <small
                    className={`font-medium text-${passwordStrength.color}`}
                  >
                    {passwordStrength.label}
                  </small>
                </div>
                <ProgressBar
                  value={passwordStrength.score}
                  showValue={false}
                  className="h-2"
                  color={
                    passwordStrength.color === "danger"
                      ? "#ef4444"
                      : passwordStrength.color === "warning"
                      ? "#f59e0b"
                      : passwordStrength.color === "info"
                      ? "#3b82f6"
                      : "#10b981"
                  }
                />
                <small className="text-gray-500 text-xs mt-1 block">
                  {t('auth:register.accountEssentials.passwordHint')}
                </small>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="md:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.accountEssentials.confirmPassword')} *
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Password
                  id="confirmPassword"
                  {...field}
                  placeholder={t('auth:register.accountEssentials.confirmPassword')}
                  toggleMask
                  feedback={false}
                  className={`w-full ${
                    errors.confirmPassword ? "p-invalid" : ""
                  }`}
                  inputClassName="w-full"
                />
              )}
            />
            {errors.confirmPassword && (
              <small className="text-red-500 block mt-1">
                {errors.confirmPassword.message}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          label={t('common:actions.back')}
          icon="pi pi-arrow-left"
          onClick={onBack}
          className="p-button-outlined"
        />
        <Button
          type="submit"
          label={t('common:actions.next')}
          icon="pi pi-arrow-right"
          iconPos="right"
        />
      </div>
    </form>
  );
}
