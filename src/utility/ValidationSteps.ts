import { useFormContext } from "react-hook-form";
export const useValidateCurrentStepFields = () => {
    const { trigger } = useFormContext();
  
 /**
  * @description This function is used for the reference, to check all the fields of particular step is passed the validations or not
  * It is used in the handling of when the user click on the next button
  * @function ValidateCurrentStepFields
  * @param currentStepFormNames 
  * @returns boolean , this function returns weather all the fields of particular validation is passed or not 
  */  
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
