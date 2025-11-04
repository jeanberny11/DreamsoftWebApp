import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createPersonalInfoStepSchema,
  type PersonalInfoStepData,
} from "../utils/register.validation";
import accountService from "../services/account.service";
import type { Gender, IdType } from "../types/account.types";
import { PhoneInput } from "../../../shared/components/form/PhoneInput";

// ========================================
// COMPONENT PROPS
// ========================================

interface PersonalInfoStepProps {
  data: PersonalInfoStepData;
  onNext: (data: PersonalInfoStepData) => void;
  onBack: () => void;
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function PersonalInfoStep({
  data,
  onNext,
  onBack,
}: PersonalInfoStepProps) {
  const { t } = useTranslation(["auth", "common"]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [idTypes, setIdTypes] = useState<IdType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoStepData>({
    resolver: zodResolver(createPersonalInfoStepSchema(t)),
    defaultValues: {
      ...data,
      dob: data.dob || new Date(),
    },
  });

  // ========================================
  // LOAD DATA ON MOUNT
  // ========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // setLoadError("");

        const [gendersData, idTypesData] = await Promise.all([
          accountService.getGendersActive(),
          accountService.getIdTypesActive(),
        ]);

        setGenders(gendersData);
        setIdTypes(idTypesData);
      } catch (error: any) {
        setLoadError(t("auth:register.personalInfo.loadError"));
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ========================================
  // SUBMIT PERSONAL INFO STEP
  // ========================================

  const onSubmit = (formData: PersonalInfoStepData) => {
    console.log("Personal Info Step Data:", formData);
    onNext(formData);
  };

  // ========================================
  // DATE CONSTRAINTS
  // ========================================

  // Max date: 18 years ago from today
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  // Min date: 120 years ago from today
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
          <p className="text-gray-600">
            {t("auth:register.personalInfo.loading")}
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i className="pi pi-exclamation-circle text-3xl text-red-500 mb-3"></i>
        <p className="text-red-700 mb-4">{loadError}</p>
        <Button
          label={t("auth:register.personalInfo.retry")}
          icon="pi pi-refresh"
          onClick={() => window.location.reload()}
          className="p-button-sm"
        />
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("auth:register.personalInfo.title")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("auth:register.personalInfo.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number */}
          <div className="md:col-span-2">
            <PhoneInput
              name="phone"
              label={t("auth:register.personalInfo.phoneNumber")}
              control={control}
              error={errors.phone?.message}
              defaultCountry="do"
              placeholder={t("validation:errors.phone.placeholder")}
              required
            />
          </div>
          {/* Date of Birth */}
          <div className="md:col-span-2">
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth:register.personalInfo.dateOfBirth")} *
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Calendar
                  id="dob"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  dateFormat="mm/dd/yy"
                  placeholder={t("auth:register.personalInfo.dobPlaceholder")}
                  maxDate={maxDate}
                  minDate={minDate}
                  yearNavigator
                  yearRange={`${minDate.getFullYear()}:${maxDate.getFullYear()}`}
                  monthNavigator
                  showIcon
                  className={`w-full ${errors.dob ? "p-invalid" : ""}`}
                  inputClassName="w-full"
                />
              )}
            />
            {errors.dob && (
              <small className="text-red-500 block mt-1">
                {errors.dob.message}
              </small>
            )}
            <small className="text-gray-500 text-xs mt-1 block">
              {t("auth:register.personalInfo.dobHint")}
            </small>
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth:register.personalInfo.gender")} *
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="gender"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={genders}
                  optionLabel="name"
                  dataKey="genderId"
                  placeholder={t(
                    "auth:register.personalInfo.genderPlaceholder"
                  )}
                  className={`w-full ${errors.gender ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.gender && (
              <small className="text-red-500 block mt-1">
                {errors.gender.message}
              </small>
            )}
          </div>

          {/* ID Type */}
          <div>
            <label
              htmlFor="idType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth:register.personalInfo.idType")} *
            </label>
            <Controller
              name="idType"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="idType"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={idTypes}
                  optionLabel="name"
                  dataKey="idTypeId"
                  placeholder={t(
                    "auth:register.personalInfo.idTypePlaceholder"
                  )}
                  className={`w-full ${errors.idType ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.idType && (
              <small className="text-red-500 block mt-1">
                {errors.idType.message}
              </small>
            )}
          </div>

          {/* ID Number */}
          <div className="md:col-span-2">
            <label
              htmlFor="idNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth:register.personalInfo.idNumber")} *
            </label>
            <Controller
              name="idNumber"
              control={control}
              render={({ field }) => (
                <InputText
                  id="idNumber"
                  {...field}
                  placeholder={t(
                    "auth:register.personalInfo.idNumberPlaceholder"
                  )}
                  className={`w-full ${errors.idNumber ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.idNumber && (
              <small className="text-red-500 block mt-1">
                {errors.idNumber.message}
              </small>
            )}
            <small className="text-gray-500 text-xs mt-1 block">
              {t("auth:register.personalInfo.idNumberHint")}
            </small>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          label={t("common:actions.back")}
          icon="pi pi-arrow-left"
          onClick={onBack}
          className="p-button-outlined"
        />
        <Button
          type="submit"
          label={t("common:actions.next")}
          icon="pi pi-arrow-right"
          iconPos="right"
        />
      </div>
    </form>
  );
}
