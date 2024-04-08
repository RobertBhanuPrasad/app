import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z, ZodSchema } from "zod";

interface FormProps {
  children: ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: Record<string, any>;
  schema?: ZodSchema<any, any, any>;
  mode?: "all" | "onBlur" | "onChange" | "onSubmit" | "onTouched" | undefined;
  useFormMethodsRef?: React.MutableRefObject<any>; 
}

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  schema = z.object({}),
  defaultValues,
  mode = "all",
  useFormMethodsRef,
  ...props
}) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: mode,
    defaultValues,
  });


  if (useFormMethodsRef) useFormMethodsRef.current = methods;

  const { handleSubmit, watch } = methods;

  useEffect(() => {
    watch();
  }, [watch]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit != undefined ? handleSubmit(onSubmit) : () => {}}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
