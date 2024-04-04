import { useForm, useFormContext } from "react-hook-form";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { stepStore } from "src/zustandStore/StepStore";

export const useValidateCurrentStepFields = () => {
  const { trigger, watch } = useFormContext();
  const { currentStep, setCurrentStep } = stepStore();
  const { setViewPreviewPage, setNewCourseData, newCourseData } =
    newCourseStore();

  const ValidateCurrentStepFields = async (currentStepFormNames: any[]) => {
    const isAllFieldsValidatedPromise = currentStepFormNames?.reduce(
      async (valid, name) => {
        valid = await Promise.resolve(valid);
        const singleField = await trigger(name);
        return valid && singleField;
      },
      true
    );

    const isAllFieldsValidated = await Promise.resolve(
      isAllFieldsValidatedPromise
    );

    return isAllFieldsValidated;
  };

  const handleClickNext = async (currentStepFormNames: any[]) => {
    const isAllFieldsFilled = await ValidateCurrentStepFields(
      currentStepFormNames
    );
    if (isAllFieldsFilled) {
      setCurrentStep(currentStep + 1);
    }
    return isAllFieldsFilled;
  };

  const handleClickPrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleClickReviewDetailsButton = async (
    currentStepFormNames: any[]
  ) => {
    const formData = watch();

    const isAllFieldsFilled = await ValidateCurrentStepFields(
      currentStepFormNames
    );
    if (isAllFieldsFilled) {
      setViewPreviewPage(true);
      setNewCourseData(formData);
    }
  };

  return {
    handleClickNext,
    handleClickPrevious,
    handleClickReviewDetailsButton,
  };
};
