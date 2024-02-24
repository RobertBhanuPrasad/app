// This page is to demonstrate the multiselect component how to use in form , will be removed afterwards

import { Button } from "src/ui/button";
import { Card, CardContent, CardFooter } from "src/ui/card";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

import { MultiSelect } from "src/ui/multi-select";
import { useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";

export default function courseCreate() {
  // State for tracking current page in server-side paginated data
  const [currentPage, setCurrentPage] = useState(1);
  // State to hold options for the MultiSelect component
  const [selectOptions, setSelectOptions] = useState<any>([]);

  // Custom hook for handling the selection of options and fetching data
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

  // Function to handle reaching the bottom of the paginated data
  const handleOnBottomReached = () => {
    if (data && data?.total >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  // useEffect to update selectOptions when new options are fetched
  useEffect(() => {
    if (options) {
      if (currentPage > 1) setSelectOptions([...selectOptions, ...options]);
      else setSelectOptions(options);
    }
  }, [options]);

  // Function to handle search events
  const handleOnSearch = (value: any) => {
    onSearch(value);
    setCurrentPage(1);
  };

  // Form handling using react-hook-form
  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    getValues,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({});

  const values = getValues();

  // Function to submit the form
  const onSubmit = async (data: any) => {
    console.log("heyy data", data);
    await onFinish(data);
  };

  // Function to handle changes in MultiSelect component
  const handleChange = (options: any) => {
    resetField("multi");
    setValue("multi", options);
  };

  return (
    <div className="text-3xl ml-20 mt-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-[400px]">
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* MultiSelect component */}
              <MultiSelect
                {...register("multi")}
                placeholder="Select more"
                data={selectOptions}
                onBottomReached={handleOnBottomReached}
                onSearch={handleOnSearch}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          {/* Card footer with Create button */}
          <CardFooter className="flex justify-between">
            <Button type="submit">Create</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

// Setting a property on the component to indicate no layout is needed
courseCreate.noLayout = true;

// Server-side props for translation
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  return {
    props: {
      ...translateProps,
    },
  };
};
