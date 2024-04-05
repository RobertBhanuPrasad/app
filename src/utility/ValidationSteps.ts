import { useFormContext } from "react-hook-form";
export const useValidateCurrentStepFields = () => {
    const { trigger } = useFormContext();
  
   
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

  return {
    ValidateCurrentStepFields
  };
};
