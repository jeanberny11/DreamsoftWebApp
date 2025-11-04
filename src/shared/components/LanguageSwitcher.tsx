import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/types';

interface LanguageOption {
  label: string;
  value: Language;
  code: Language;
}

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languageOptions: LanguageOption[] = Object.entries(SUPPORTED_LANGUAGES).map(
    ([code, label]) => ({
      label,
      value: code as Language,
      code: code as Language,
    })
  );

  const handleLanguageChange = (e: { value: Language }) => {
    i18n.changeLanguage(e.value);
  };

  return (
    <Dropdown
      value={i18n.language as Language}
      options={languageOptions}
      onChange={handleLanguageChange}
      optionLabel="label"
      placeholder="Select Language"
      className="w-full md:w-14rem"
    />
  );
};

// Simple version using native select (if you prefer)
export const SimpleLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
};
