/**
 * Review Step Component
 * 
 * Location: src/features/auth/components/ReviewStep.tsx
 * 
 * Displays all collected information for review before submission
 */

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useTranslation } from 'react-i18next';
import type {
  EmailVerificationStepData,
  AccountEssentialsStepData,
  PersonalInfoStepData,
  AddressInfoStepData
} from '../utils/register.validation';

// ========================================
// COMPONENT PROPS
// ========================================

interface ReviewStepProps {
  emailVerificationData: EmailVerificationStepData;
  accountEssentialsData: AccountEssentialsStepData;
  personalInfoData: PersonalInfoStepData;
  addressInfoData: AddressInfoStepData;
  onSubmit: () => void;
  onEdit: (step: number) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

// ========================================
// INFO ROW COMPONENT
// ========================================

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

// ========================================
// MAIN COMPONENT
// ========================================

export default function ReviewStep({
  emailVerificationData,
  accountEssentialsData,
  personalInfoData,
  addressInfoData,
  onSubmit,
  onEdit,
  onBack,
  isSubmitting,
}: ReviewStepProps) {
  const { t, i18n } = useTranslation(['auth', 'common']);

  // ========================================
  // HELPER: FORMAT DATE
  // ========================================

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('auth:register.review.title')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('auth:register.review.description')}
        </p>
      </div>

      {/* Email Verification Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('auth:register.review.emailVerification')}
          </h3>
          <Button
            label={t('auth:register.review.edit')}
            icon="pi pi-pencil"
            onClick={() => onEdit(0)}
            className="p-button-text p-button-sm"
            disabled={isSubmitting}
          />
        </div>
        <div className="divide-y divide-gray-100">
          <InfoRow label={t('auth:register.review.email')} value={emailVerificationData.email} />
          <div className="flex justify-between py-2">
            <span className="text-gray-600 font-medium">{t('auth:register.review.status')}:</span>
            {emailVerificationData.emailVerified ? (
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <i className="pi pi-check-circle"></i>
                {t('auth:register.review.verified')}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-600 font-medium">
                <i className="pi pi-times-circle"></i>
                {t('auth:register.review.notVerified')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Account Essentials Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('auth:register.review.accountInformation')}
          </h3>
          <Button
            label={t('auth:register.review.edit')}
            icon="pi pi-pencil"
            onClick={() => onEdit(1)}
            className="p-button-text p-button-sm"
            disabled={isSubmitting}
          />
        </div>
        <div className="divide-y divide-gray-100">
          <InfoRow label={t('auth:register.review.firstName')} value={accountEssentialsData.firstName} />
          <InfoRow label={t('auth:register.review.lastName')} value={accountEssentialsData.lastName} />
          <InfoRow label={t('auth:register.review.username')} value={accountEssentialsData.username} />
          <InfoRow label={t('auth:register.review.password')} value="••••••••" />
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('auth:register.review.personalInformation')}
          </h3>
          <Button
            label={t('auth:register.review.edit')}
            icon="pi pi-pencil"
            onClick={() => onEdit(2)}
            className="p-button-text p-button-sm"
            disabled={isSubmitting}
          />
        </div>
        <div className="divide-y divide-gray-100">
          <InfoRow label={t('auth:register.review.phone')} value={personalInfoData.phone} />
          <InfoRow label={t('auth:register.review.dateOfBirth')} value={formatDate(personalInfoData.dob)} />
          <InfoRow label={t('auth:register.review.gender')} value={personalInfoData.gender?.name || 'N/A'} />
          <InfoRow label={t('auth:register.review.idType')} value={personalInfoData.idType?.name || 'N/A'} />
          <InfoRow label={t('auth:register.review.idNumber')} value={personalInfoData.idNumber} />
        </div>
      </div>

      {/* Address Information Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('auth:register.review.addressInformation')}
          </h3>
          <Button
            label={t('auth:register.review.edit')}
            icon="pi pi-pencil"
            onClick={() => onEdit(3)}
            className="p-button-text p-button-sm"
            disabled={isSubmitting}
          />
        </div>
        <div className="divide-y divide-gray-100">
          <InfoRow label={t('auth:register.review.streetAddress')} value={addressInfoData.address} />
          <InfoRow label={t('auth:register.review.country')} value={addressInfoData.country?.name || 'N/A'} />
          <InfoRow label={t('auth:register.review.province')} value={addressInfoData.province?.name || 'N/A'} />
          <InfoRow label={t('auth:register.review.municipality')} value={addressInfoData.municipality?.name || 'N/A'} />
        </div>
      </div>

      <Divider />

      {/* Terms and Conditions */}
      <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
        <div className="flex items-start gap-3">
          <i className="pi pi-info-circle text-primary-600 mt-0.5"></i>
          <div className="text-sm text-primary-900">
            <p className="font-medium mb-1">{t('auth:register.review.beforeContinue')}</p>
            <ul className="list-disc list-inside space-y-1 text-primary-800">
              <li>{t('auth:register.review.reviewCarefully')}</li>
              <li>{t('auth:register.review.ensureAccurate')}</li>
              <li>{t('auth:register.review.canEdit')}</li>
              <li>{t('auth:register.review.agreeToTerms')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          label={t('common:actions.back')}
          icon="pi pi-arrow-left"
          onClick={onBack}
          className="p-button-outlined"
          disabled={isSubmitting}
        />
        <Button
          type="button"
          label={
            isSubmitting
              ? t('auth:register.review.creatingAccount')
              : t('auth:register.review.createAccount')
          }
          icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
          iconPos="right"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8"
        />
      </div>

      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <i className="pi pi-spin pi-spinner text-5xl text-primary-500 mb-4"></i>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {t('auth:register.review.creatingAccountTitle')}
            </h4>
            <p className="text-gray-600">{t('auth:register.review.creatingAccountDescription')}</p>
          </div>
        </div>
      )}
    </div>
  );
}