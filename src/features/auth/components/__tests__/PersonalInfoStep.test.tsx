import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonalInfoStep from "../PersonalInfoStep";
import accountService from "../../services/account.service";
import type { PersonalInfoStepData } from "../../utils/register.validation";

// ========================================
// MOCK ACCOUNT SERVICE
// ========================================

vi.mock("../../services/account.service");

// ========================================
// TEST SUITE
// ========================================

describe("PersonalInfoStep", () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();

  const mockGenders = [
    { genderId: 1, name: "Male" },
    { genderId: 2, name: "Female" },
    { genderId: 3, name: "Other" },
  ];

  const mockIdTypes = [
    { idTypeId: 1, name: "Passport" },
    { idTypeId: 2, name: "Driver's License" },
    { idTypeId: 3, name: "National ID" },
  ];

  const defaultData: PersonalInfoStepData = {
    phone: "",
    dob: new Date("2000-01-01"),
    gender: null,
    idType: null,
    idNumber: "",
  };

  // ========================================
  // SETUP
  // ========================================

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(accountService.getGendersActive).mockResolvedValue(mockGenders);
    vi.mocked(accountService.getIdTypesActive).mockResolvedValue(mockIdTypes);
  });

  // ========================================
  // COMPONENT RENDERING TESTS
  // ========================================

  describe("Component Rendering", () => {
    it("should show loading state initially", () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      expect(screen.getByText("Loading form data...")).toBeInTheDocument();
      expect(screen.getByText("Loading form data...").parentElement).toBeInTheDocument();
    });

    it("should render form after data loads successfully", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByText("Date of Birth *")).toBeInTheDocument();
      expect(screen.getByText("Gender *")).toBeInTheDocument();
      expect(screen.getByText("ID Type *")).toBeInTheDocument();
      expect(screen.getByLabelText(/ID Number/i)).toBeInTheDocument();
    });

    it("should show error state when API fails to load genders", async () => {
      vi.mocked(accountService.getGendersActive).mockRejectedValue(
        new Error("API Error")
      );

      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to load form data/i)
        ).toBeInTheDocument();
      });

      expect(screen.getByText("Try Again")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Try Again/i })
      ).toBeInTheDocument();
    });

    it("should show error state when API fails to load ID types", async () => {
      vi.mocked(accountService.getIdTypesActive).mockRejectedValue(
        new Error("Network Error")
      );

      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to load form data/i)
        ).toBeInTheDocument();
      });
    });

    it("should render all form sections with proper labels", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      // Check section description
      expect(
        screen.getByText(/Tell us about yourself/i)
      ).toBeInTheDocument();

      // Check all required field indicators (*)
      expect(screen.getByText("Phone Number *")).toBeInTheDocument();
      expect(screen.getByText("Date of Birth *")).toBeInTheDocument();
      expect(screen.getByText("Gender *")).toBeInTheDocument();
      expect(screen.getByText("ID Type *")).toBeInTheDocument();
      expect(screen.getByText("ID Number *")).toBeInTheDocument();
    });
  });

  // ========================================
  // FORM VALIDATION TESTS
  // ========================================

  describe("Form Validation", () => {
    it("should show validation errors when submitting empty form", async () => {
      const user = userEvent.setup();

      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Phone number is required/i)
        ).toBeInTheDocument();
      });

      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it("should validate phone number format - invalid format", async () => {
      const user = userEvent.setup();

      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      });

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, "invalid");

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid phone number/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate phone number format - valid international format", async () => {
      const user = userEvent.setup();
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);

      const validData: PersonalInfoStepData = {
        phone: "+1234567890",
        dob: validDate,
        gender: mockGenders[0],
        idType: mockIdTypes[0],
        idNumber: "ABC123456",
      };

      render(
        <PersonalInfoStep
          data={validData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    it("should reject age under 18 years", async () => {
      const user = userEvent.setup();
      const tooYoung = new Date();
      tooYoung.setFullYear(tooYoung.getFullYear() - 15); // 15 years old

      render(
        <PersonalInfoStep
          data={{ ...defaultData, dob: tooYoung }}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      await user.type(phoneInput, "+1234567890");

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/You must be at least 18 years old/i)
        ).toBeInTheDocument();
      });
    });

    it("should accept valid age between 18 and 120 years", async () => {
      const user = userEvent.setup();
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25); // 25 years old

      const validData: PersonalInfoStepData = {
        phone: "+1234567890",
        dob: validDate,
        gender: mockGenders[0],
        idType: mockIdTypes[0],
        idNumber: "ABC123456",
      };

      render(
        <PersonalInfoStep
          data={validData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    it("should validate gender is required", async () => {
      const user = userEvent.setup();
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);

      render(
        <PersonalInfoStep
          data={{
            phone: "+1234567890",
            dob: validDate,
            gender: null,
            idType: mockIdTypes[0],
            idNumber: "ABC123",
          }}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Please select your gender/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate ID type is required", async () => {
      const user = userEvent.setup();
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);

      render(
        <PersonalInfoStep
          data={{
            phone: "+1234567890",
            dob: validDate,
            gender: mockGenders[0],
            idType: null,
            idNumber: "ABC123",
          }}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Please select your ID type/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate ID number minimum length", async () => {
      const user = userEvent.setup();
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);

      render(
        <PersonalInfoStep
          data={{
            phone: "+1234567890",
            dob: validDate,
            gender: mockGenders[0],
            idType: mockIdTypes[0],
            idNumber: "AB", // Too short (less than 5 characters)
          }}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/ID number must be at least 5 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // FORM SUBMISSION TESTS
  // ========================================

  describe("Form Submission", () => {
    it("should submit valid form data and call onNext", async () => {
      const user = userEvent.setup();
      const validDate = new Date("1990-01-01");

      const validData: PersonalInfoStepData = {
        phone: "+1234567890",
        dob: validDate,
        gender: mockGenders[0],
        idType: mockIdTypes[0],
        idNumber: "ABC123456",
      };

      render(
        <PersonalInfoStep
          data={validData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Next/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledTimes(1);
      });

      expect(mockOnNext).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: validData.phone,
          idNumber: validData.idNumber,
        })
      );
    });

    it("should submit with all different ID types", async () => {
      const validDate = new Date("1990-01-01");

      for (const idType of mockIdTypes) {
        const user = userEvent.setup();
        vi.clearAllMocks();

        const validData: PersonalInfoStepData = {
          phone: "+1234567890",
          dob: validDate,
          gender: mockGenders[0],
          idType: idType,
          idNumber: "VALID12345",
        };

        const { unmount } = render(
          <PersonalInfoStep
            data={validData}
            onNext={mockOnNext}
            onBack={mockOnBack}
          />
        );

        await waitFor(() => {
          expect(screen.getByText("Personal Information")).toBeInTheDocument();
        });

        const submitButton = screen.getByRole("button", { name: /Next/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockOnNext).toHaveBeenCalled();
        });

        // Cleanup after each iteration
        unmount();
      }
    });
  });

  // ========================================
  // NAVIGATION TESTS
  // ========================================

  describe("Navigation", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", { name: /Back/i });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it("should have proper button icons and labels", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", { name: /Back/i });
      const nextButton = screen.getByRole("button", { name: /Next/i });

      expect(backButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  // ========================================
  // DEFAULT VALUES TESTS
  // ========================================

  describe("Default Values", () => {
    it("should populate form with provided data", async () => {
      const existingData: PersonalInfoStepData = {
        phone: "+1234567890",
        dob: new Date("1990-01-01"),
        gender: mockGenders[0],
        idType: mockIdTypes[0],
        idNumber: "ABC123456",
      };

      render(
        <PersonalInfoStep
          data={existingData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/Phone Number/i)).toHaveValue(
          existingData.phone
        );
      });

      expect(screen.getByLabelText(/ID Number/i)).toHaveValue(
        existingData.idNumber
      );
    });

    it("should handle empty string values correctly", async () => {
      const emptyData: PersonalInfoStepData = {
        phone: "",
        dob: new Date(),
        gender: null,
        idType: null,
        idNumber: "",
      };

      render(
        <PersonalInfoStep
          data={emptyData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/Phone Number/i)).toHaveValue("");
      expect(screen.getByLabelText(/ID Number/i)).toHaveValue("");
    });
  });

  // ========================================
  // DATA LOADING TESTS
  // ========================================

  describe("Data Loading", () => {
    it("should load genders and ID types on mount", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(accountService.getGendersActive).toHaveBeenCalledTimes(1);
        expect(accountService.getIdTypesActive).toHaveBeenCalledTimes(1);
      });
    });

    it("should load data in parallel", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      // Both services should be called
      await waitFor(() => {
        expect(accountService.getGendersActive).toHaveBeenCalled();
        expect(accountService.getIdTypesActive).toHaveBeenCalled();
      });

      // Verify form renders with the data
      await waitFor(() => {
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // HELPER TEXT TESTS
  // ========================================

  describe("Helper Text", () => {
    it("should display helper text for phone number", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Include country code \(e\.g\., \+1 for USA\)/i)
        ).toBeInTheDocument();
      });
    });

    it("should display helper text for date of birth", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/You must be at least 18 years old to register/i)
        ).toBeInTheDocument();
      });
    });

    it("should display helper text for ID number", async () => {
      render(
        <PersonalInfoStep
          data={defaultData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Enter the number from your selected ID type/i)
        ).toBeInTheDocument();
      });
    });
  });
});
