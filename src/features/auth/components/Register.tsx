/**
 * Register Page
 *
 * Location: src/features/auth/pages/Register.tsx
 *
 * Multi-step registration page with email verification
 * Orchestrates all registration steps using local state
 */

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import AuthLayout from "../components/AuthLayout";
import EmailVerificationStep from "../components/EmailVerificationStep";
import AccountEssentialsStep from "../components/AccountEssentialsStep";
import PersonalInfoStep from "../components/PersonalInfoStep";
import AddressInfoStep from "../components/AddressInfoStep";
import ReviewStep from "../components/ReviewStep";
import accountService from "../services/account.service";
import {
  parseApiError,
  formatFieldErrorsMessage,
  type FieldValidationError,
} from "../../../shared/utils/errorHandler";
import type {
  EmailVerificationStepData,
  AccountEssentialsStepData,
  PersonalInfoStepData,
  AddressInfoStepData,
} from "../utils/register.validation";
import type { AccountCreate } from "../types/account.types";

// ========================================
// REGISTRATION FORM STATE INTERFACE
// ========================================

interface RegistrationFormState {
  emailVerification: EmailVerificationStepData;
  accountEssentials: AccountEssentialsStepData;
  personalInfo: PersonalInfoStepData;
  addressInfo: AddressInfoStepData;
  currentStep: number;
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function Register() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { t } = useTranslation(["auth", "common"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================
  // FORM STATE (using useState)
  // ========================================

  const [formState, setFormState] = useState<RegistrationFormState>({
    emailVerification: {
      email: "",
      verificationCode: "",
      emailVerified: false,
    },
    accountEssentials: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    personalInfo: {
      phone: "",
      dob: null as unknown as Date,
      gender: null,
      idType: null,
      idNumber: "",
    },
    addressInfo: {
      address: "",
      country: null,
      province: null,
      municipality: null,
    },
    currentStep: 0,
  });

  // ========================================
  // STEP ITEMS FOR PROGRESS INDICATOR
  // ========================================

  const stepItems = [
    { label: t("auth:register.steps.emailVerification") },
    { label: t("auth:register.steps.accountEssentials") },
    { label: t("auth:register.steps.personalInfo") },
    { label: t("auth:register.steps.addressInfo") },
    { label: t("auth:register.steps.review") },
  ];

  // ========================================
  // STEP HANDLERS
  // ========================================

  const handleEmailVerificationNext = (data: EmailVerificationStepData) => {
    setFormState((prev) => ({
      ...prev,
      emailVerification: data,
      accountEssentials: {
        ...prev.accountEssentials,
        username: data.email,
      },
      currentStep: 1,
    }));
  };

  const handleAccountEssentialsNext = (data: AccountEssentialsStepData) => {
    setFormState((prev) => ({
      ...prev,
      accountEssentials: data,
      currentStep: 2,
    }));
  };

  const handlePersonalInfoNext = (data: PersonalInfoStepData) => {
    setFormState((prev) => ({
      ...prev,
      personalInfo: data,
      currentStep: 3,
    }));
  };

  const handleAddressInfoNext = (data: AddressInfoStepData) => {
    setFormState((prev) => ({
      ...prev,
      addressInfo: data,
      currentStep: 4,
    }));
  };

  const handleBack = (step: number) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const handleEdit = (step: number) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  // ========================================
  // SUBMIT REGISTRATION
  // ========================================

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare account data matching C# AccountCreate model
      const accountData: AccountCreate = {
        firstName: formState.accountEssentials.firstName,
        lastName: formState.accountEssentials.lastName,
        phone: formState.personalInfo.phone,
        email: formState.emailVerification.email,
        address: formState.addressInfo.address,
        country: formState.addressInfo.country!,
        province: formState.addressInfo.province!,
        municipality: formState.addressInfo.municipality!,
        dob: formState.personalInfo.dob!.toISOString(),
        gender: formState.personalInfo.gender!,
        idNumber: formState.personalInfo.idNumber,
        idType: formState.personalInfo.idType!,
        username: formState.accountEssentials.username,
        password: formState.accountEssentials.password,
        emailVerified: formState.emailVerification.emailVerified,
      };

      // Submit account creation
      await accountService.createAccount(accountData);

      toast.current?.show({
        severity: "success",
        summary: t("auth:register.success"),
        detail: t("auth:register.success"),
        life: 3000,
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Account creation error:", error);

      // Parse the error using our utility
      const apiError = parseApiError(error);

      // If validation error, show field-specific errors
      if (apiError.isValidationError && apiError.fieldErrors.length > 0) {
        // Display all validation errors in toast
        toast.current?.show({
          severity: "error",
          summary: t("common:messages.validationError"),
          detail: formatFieldErrorsMessage(apiError.fieldErrors),
          life: 7000,
          sticky: false,
        });

        // Navigate to the appropriate step based on which fields have errors
        navigateToErrorStep(apiError.fieldErrors);
      } else {
        // Show generic error
        toast.current?.show({
          severity: "error",
          summary: t("common:messages.error"),
          detail: apiError.message,
          life: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to the step containing the first field with an error
  const navigateToErrorStep = (fieldErrors: FieldValidationError[]) => {
    if (fieldErrors.length === 0) return;

    // Map field names to their corresponding steps
    const fieldToStepMap: Record<string, number> = {
      // Step 1: Account Essentials
      username: 1,
      firstName: 1,
      lastName: 1,
      password: 1,
      // Step 2: Personal Info
      phone: 2,
      dob: 2,
      gender: 2,
      idType: 2,
      idNumber: 2,
      // Step 3: Address Info
      address: 3,
      country: 3,
      province: 3,
      municipality: 3,
    };

    // Find the first error field and navigate to its step
    for (const fieldError of fieldErrors) {
      const stepNumber = fieldToStepMap[fieldError.field];
      if (stepNumber !== undefined) {
        setFormState((prev) => ({
          ...prev,
          currentStep: stepNumber,
        }));
        break; // Navigate to first error step only
      }
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      <Toast ref={toast} />
      <AuthLayout
        title={t("auth:register.title")}
        subtitle={t("auth:register.subtitle")}
      >
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="bg-white w-full p-4 rounded-lg border border-gray-200">
            <Steps
              model={stepItems}
              activeIndex={formState.currentStep}
              readOnly
              className="custom-steps w-full"
              pt={{
                menuitem: { className: "lg:mx-4" },
              }}
            />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {formState.currentStep === 0 && (
              <EmailVerificationStep
                data={formState.emailVerification}
                onNext={handleEmailVerificationNext}
              />
            )}

            {formState.currentStep === 1 && (
              <AccountEssentialsStep
                data={formState.accountEssentials}
                onNext={handleAccountEssentialsNext}
                onBack={() => handleBack(0)}
              />
            )}

            {formState.currentStep === 2 && (
              <PersonalInfoStep
                data={formState.personalInfo}
                onNext={handlePersonalInfoNext}
                onBack={() => handleBack(1)}
              />
            )}

            {formState.currentStep === 3 && (
              <AddressInfoStep
                data={formState.addressInfo}
                onNext={handleAddressInfoNext}
                onBack={() => handleBack(2)}
              />
            )}

            {formState.currentStep === 4 && (
              <ReviewStep
                emailVerificationData={formState.emailVerification}
                accountEssentialsData={formState.accountEssentials}
                personalInfoData={formState.personalInfo}
                addressInfoData={formState.addressInfo}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
                onBack={() => handleBack(3)}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Login Link */}
          <div className="text-center p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {t("auth:register.hasAccount")}{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {t("auth:register.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
