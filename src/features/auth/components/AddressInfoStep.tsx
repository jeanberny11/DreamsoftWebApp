/**
 * Address Info Step Component
 *
 * Location: src/features/auth/components/AddressInfoStep.tsx
 *
 * Collects address with smart cascading dropdowns: Country → Province → Municipality
 */

import { useState, useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createAddressInfoStepSchema,
  type AddressInfoStepData,
} from "../utils/register.validation";
import accountService from "../services/account.service";
import type { Country, Province, Municipality } from "../types/account.types";

// ========================================
// COMPONENT PROPS
// ========================================

interface AddressInfoStepProps {
  data: AddressInfoStepData;
  onNext: (data: AddressInfoStepData) => void;
  onBack: () => void;
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function AddressInfoStep({
  data,
  onNext,
  onBack,
}: AddressInfoStepProps) {
  const { t } = useTranslation(['auth', 'common']);
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadError, setLoadError] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddressInfoStepData>({
    resolver: zodResolver(createAddressInfoStepSchema(t)),
    defaultValues: data,
  });

  const selectedCountry = watch("country");
  const selectedProvince = watch("province");

  // ========================================
  // LOAD COUNTRIES ON MOUNT
  // ========================================

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        setLoadError("");
        const countriesData = await accountService.getCountriesActive();
        setCountries(countriesData);
      } catch (error: any) {
        setLoadError(t('auth:register.addressInfo.loadError'));
        console.error("Error loading countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // ========================================
  // LOAD PROVINCES WHEN COUNTRY CHANGES
  // ========================================

  useEffect(() => {
    if (selectedCountry) {
      const loadProvinces = async () => {
        try {
          setLoadingProvinces(true);
          const provincesData = await accountService.getProvincesByCountryId(
            selectedCountry.countryId
          );
          setProvinces(provincesData);
          // Reset province and municipality if country changes
          if (data.country?.countryId !== selectedCountry.countryId) {
            setValue("province", null);
            setValue("municipality", null);
            setMunicipalities([]);
          }
        } catch (error: any) {
          console.error("Error loading provinces:", error);
          setProvinces([]);
        } finally {
          setLoadingProvinces(false);
        }
      };

      loadProvinces();
    } else {
      setProvinces([]);
      setMunicipalities([]);
      setValue("province", null);
      setValue("municipality", null);
    }
  }, [selectedCountry]);

  // ========================================
  // LOAD MUNICIPALITIES WHEN PROVINCE CHANGES
  // ========================================

  useEffect(() => {
    if (selectedProvince) {
      const loadMunicipalities = async () => {
        try {
          setLoadingMunicipalities(true);
          const municipalitiesData =
            await accountService.getMunicipalitiesByProvinceId(
              selectedProvince.provinceId
            );
          setMunicipalities(municipalitiesData);

          // Reset municipality if province changes
          if (data.province?.provinceId !== selectedProvince.provinceId) {
            setValue("municipality", null);
          }
        } catch (error: any) {
          console.error("Error loading municipalities:", error);
          setMunicipalities([]);
        } finally {
          setLoadingMunicipalities(false);
        }
      };

      loadMunicipalities();
    } else {
      setMunicipalities([]);
      setValue("municipality", null);
    }
  }, [selectedProvince]);

  // ========================================
  // SUBMIT ADDRESS INFO STEP
  // ========================================

  const onSubmit = (formData: AddressInfoStepData) => {
    console.log("Address Info Step Data:", formData);
    onNext(formData);
  };

  // ========================================
  // LOADING STATE
  // ========================================

  if (loadingCountries) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
          <p className="text-gray-600">{t('auth:register.addressInfo.loading')}</p>
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
          label={t('auth:register.addressInfo.retry')}
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
      {/* Address Information Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('auth:register.addressInfo.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('auth:register.addressInfo.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Street Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.addressInfo.address')} *
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id="address"
                  {...field}
                  rows={3}
                  placeholder={t('auth:register.addressInfo.addressPlaceholder')}
                  className={`w-full ${errors.address ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.address && (
              <small className="text-red-500 block mt-1">
                {errors.address.message}
              </small>
            )}
            <small className="text-gray-500 text-xs mt-1 block">
              {t('auth:register.addressInfo.addressHint')}
            </small>
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.addressInfo.country')} *
            </label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="country"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={countries}
                  optionLabel="name"
                  placeholder={t('auth:register.addressInfo.countryPlaceholder')}
                  filter
                  filterBy="name"
                  className={`w-full ${errors.country ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.country && (
              <small className="text-red-500 block mt-1">
                {errors.country.message}
              </small>
            )}
          </div>

          {/* Province/State */}
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.addressInfo.province')} *
            </label>
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="province"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={provinces}
                  optionLabel="name"
                  dataKey="provinceId"
                  placeholder={
                    loadingProvinces
                      ? t('auth:register.addressInfo.provinceLoading')
                      : !selectedCountry
                      ? t('auth:register.addressInfo.provinceDisabledPlaceholder')
                      : t('auth:register.addressInfo.provincePlaceholder')
                  }
                  filter
                  filterBy="name"
                  disabled={!selectedCountry || loadingProvinces}
                  className={`w-full ${errors.province ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.province && (
              <small className="text-red-500 block mt-1">
                {errors.province.message}
              </small>
            )}
            {loadingProvinces && (
              <small className="text-gray-500 text-xs mt-1 block items-center gap-2">
                <i className="pi pi-spin pi-spinner text-xs"></i>
                {t('auth:register.addressInfo.provinceLoading')}
              </small>
            )}
          </div>

          {/* Municipality/City */}
          <div>
            <label
              htmlFor="municipality"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth:register.addressInfo.municipality')} *
            </label>
            <Controller
              name="municipality"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="municipality"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={municipalities}
                  optionLabel="name"
                  dataKey="municipalityId"
                  placeholder={
                    loadingMunicipalities
                      ? t('auth:register.addressInfo.municipalityLoading')
                      : !selectedProvince
                      ? t('auth:register.addressInfo.municipalityDisabledPlaceholder')
                      : t('auth:register.addressInfo.municipalityPlaceholder')
                  }
                  filter
                  filterBy="name"
                  disabled={!selectedProvince || loadingMunicipalities}
                  className={`w-full ${errors.municipality ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.municipality && (
              <small className="text-red-500 block mt-1">
                {errors.municipality.message}
              </small>
            )}
            {loadingMunicipalities && (
              <small className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                <i className="pi pi-spin pi-spinner text-xs"></i>
                {t('auth:register.addressInfo.municipalityLoading')}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <i className="pi pi-info-circle text-blue-600 text-xl mt-0.5"></i>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">{t('auth:register.addressInfo.almostDone')}</p>
            <p className="text-blue-800">
              {t('auth:register.addressInfo.almostDoneDescription')}
            </p>
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
          label={t('common:actions.review')}
          icon="pi pi-arrow-right"
          iconPos="right"
        />
      </div>
    </form>
  );
}
