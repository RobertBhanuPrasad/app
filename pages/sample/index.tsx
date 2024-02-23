import { useSelect } from "@refinedev/core";
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

export default function courseCreate() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOptions, setSelectOptions] = useState<any>([]);

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

  useEffect(() => {
    if (options) {
      if (currentPage > 1) setSelectOptions([...selectOptions, ...options]);
      else setSelectOptions(options);
    }
  }, [options]);

  const handleOnBottomReached = () => {
    if (data && data?.total >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const handleOnSearch = (value: any) => {
    onSearch(value);
    setCurrentPage(1);
  };

  //Getting functions from the useForm
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

  const [selectedFramework, setSelectedFramework] = useState("");

  const handleChange = (framework: any) => {
    resetField("test");
    setValue("test", framework);
    setSelectedFramework(framework);
  };
  const checkdata: any = getValues();
  console.log("heyy values", checkdata, errors);

  // function to submit the form
  const onSubmit = async (data: any) => {
    console.log("heyy data", data);
    await onFinish(data);
  };

  return (
    <div className="text-3xl ml-20 mt-20">
      <Card className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Test</CardTitle>
            <CardDescription>creating a new course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <CustomSelect
                {...register("test")}
                placeholder={"Select course type"}
                options={selectOptions}
                onBottomReached={handleOnBottomReached}
                onSearch={handleOnSearch}
                selectedValue={selectedFramework}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Create</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

courseCreate.noLayout = true;

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
