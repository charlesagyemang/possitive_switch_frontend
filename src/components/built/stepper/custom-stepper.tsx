import { LucideIcon } from "lucide-react";
import React, { useState, ComponentType } from "react";

export interface StepHeader {
  label: string;
  icon: LucideIcon; // Pass Lucide React icon here, e.g. <CheckCircle size={20} />
}

export interface Step {
  component: ComponentType<any>;
  props?: Record<string, any>;
}

export interface CustomStepperProps {
  steps: Step[];
  headers: StepHeader[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
  navigation?: boolean;
}

const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  headers,
  initialStep = 0,
  onStepChange,
  className = "",
  navigation = true,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goToStep = (idx: number) => {
    setCurrentStep(idx);
    onStepChange?.(idx);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const StepComponent = steps[currentStep]?.component;
  const stepProps = steps[currentStep]?.props || {};

  return (
    <div className={`w-full p-8  ${className}`}>
      {/* Step Headers */}
      <div className="relative flex items-center justify-between mb-12">
        {headers.map((header, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`flex flex-col items-center z-10 cursor-pointer group transition-colors duration-300 ${
                idx === currentStep
                  ? "text-primary/70 font-bold"
                  : idx < currentStep
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
              onClick={() => goToStep(idx)}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4  transition-all duration-300 ${
                  idx === currentStep
                    ? "border-primary/70 bg-primary/10 scale-110"
                    : idx < currentStep
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white"
                } group-hover:scale-105`}
              >
                <header.icon size={24} />
              </div>
              <span className="mt-3 text-xs tracking-wide uppercase">
                {header.label}
              </span>
            </div>
            {idx < headers.length - 1 && (
              <div className="flex-1 h-1 mx-2 w-full bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200 rounded-full" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-10">
        <div className="p-6 rounded-xl  animate-fade-in">
          <StepComponent {...stepProps} />
        </div>
      </div>

      {/* Navigation Buttons */}
      {navigation && (
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium shadow transition-all duration-200 ${
              currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={`px-6 py-2 rounded-lg font-medium shadow transition-all duration-200 ${
              currentStep === steps.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomStepper;
