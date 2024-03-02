// This page is to demonstrate the select component how to use in form , will be removed afterwards
import { Authenticated, useGetIdentity, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "src/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "src/ui/card";
import { z } from "zod";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

import CustomSelect from "src/ui/custom-select";
import { authProvider } from "src/authProvider";

export default function CourseCreate() {
  // State for managing pagination and options for the select component
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOptions, setSelectOptions] = useState<any>([]);

  // Zod schema for form validation
  const schema = z.object({
    test: z
      .object({
        label: z.string().refine((value) => value.trim().length > 0, {
          message: "label required",
        }),
        value: z.number(),
      })
      .refine((obj) => obj.label.trim().length > 0, {
        message: "test required",
      }),
  });

  // Custom hook for handling the select component logic
  const {
    queryResult: { data },
    options,
    onSearch,
  } = useSelect({
    resource: "test",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      current: currentPage,
      mode: "server",
    },
  });

  // Effect to update select options when options change
  useEffect(() => {
    if (options) {
      if (currentPage > 1) setSelectOptions([...selectOptions, ...options]);
      else setSelectOptions(options);
    }
  }, [options, currentPage]);

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (data && data?.total >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  // Handler for search event
  const handleOnSearch = (value: any) => {
    onSearch(value);

    // For resetting the data to the first page which coming from the API
    setCurrentPage(1);
  };

  // Form hook to manage form state and validation
  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    getValues,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({
    refineCoreProps: {},
    resolver: zodResolver(schema),
  });
  const formValues = getValues();
  // Handler for handling changes in the custom select
  const handleChange = (framework: any) => {
    resetField("test");
    //setting the value to formdata
    setValue("test", framework);
  };

  // Submit handler for the form
  const onSubmit = async (formData: any) => {
    console.log("Form Data Submitted:", formData);
    await onFinish(formData);
  };

  const handleClear = async () => {
    resetField("test");
  };

  const { data: identity } = useGetIdentity<any>();

  console.log("user info", identity);

  return (
    <div className="text-3xl ml-20 mt-20">
      <Card className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Test</CardTitle>
            <CardDescription>Creating a new course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* CustomSelect component with necessary props */}
              <CustomSelect
                value={formValues?.test}
                {...register("test")}
                placeholder={"Select course type"}
                data={selectOptions}
                onBottomReached={handleOnBottomReached}
                onSearch={handleOnSearch}
                onChange={handleChange}
              />
            </div>
            <Button onClick={handleClear}>Clear</Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Create</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Setting a property to indicate that no layout is needed for this component
CourseCreate.noLayout = true;

// Server-side props function for handling translations
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
