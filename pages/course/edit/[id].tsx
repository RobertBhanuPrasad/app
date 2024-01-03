"useClient";
import React, { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { supabaseClient } from "src/utility/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/ui/card";
import { Label } from "src/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Input } from "src/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { Button } from "src/ui/button";
import { cn } from "src/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "src/ui/calendar";
import { format } from "date-fns";

export default function Index() {
  const {
    refineCore: { onFinish, queryResult: productQueryResult, formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm<IProduct>({
    refineCoreProps: {
      resource: "course",
    },
  });
  const courseData = productQueryResult?.data?.data;

  console.log(courseData, "product");
  console.log(formLoading, "formLoading");

  const { options: visibility } = useSelect({
    resource: "category_master",
    optionLabel: "category_value",
    optionValue: "id",
    filters: [
      {
        field: "category_name",
        operator: "eq",
        value: "visibility",
      },
    ],
  });
  const { options: formatIds } = useSelect({
    resource: "category_master",
    optionLabel: "category_value",
    optionValue: "id",
    filters: [
      {
        field: "category_name",
        operator: "eq",
        value: "format",
      },
    ],
  });

  console.log(courseData?.region_id, "region id");
  const { options: region } = useSelect({
    resource: "region",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: country } = useSelect({
    resource: "country",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: state } = useSelect({
    resource: "state",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: 1,
  });

  const { options: city } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: center } = useSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: courseTypes } = useSelect({
    resource: "category_master",
    optionLabel: "category_value",
    optionValue: "id",
    filters: [
      {
        field: "category_name",
        operator: "eq",
        value: "course_types",
      },
    ],
  });

  const [userID, setUserID] = useState<any>();

  const [startDate, setStartDate] = useState<any>();

  const [endDate, setEndDate] = useState<any>();

  const getUser = async () => {
    const { data } = await supabaseClient.auth.getUser();
    setUserID(data?.user?.id);
    console.log(data?.user?.id, "user id");
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log(courseData?.course_type_id, "courseData?.course_type_id");
  const ct = String(courseData?.course_type_id);
  console.log(ct, "course type");
  return (
    <div>
      <div>
        {/* <h2>{`Edit "${product?.name}" Product`}</h2>
                <h2>{`Category: ${categoryOfProduct?.title}`}</h2> */}
      </div>

      <div className="text-3xl ml-20 mt-20">
        <Card className="w-[400px]">
          <form onSubmit={handleSubmit(onFinish)}>
            <CardHeader>
              <CardTitle>Edit Course</CardTitle>
              <CardDescription>edit a course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-10">
                <div className="flex flex-col space-y-1.5 gap-4">
                  <Label htmlFor="name">course name</Label>

                  <Select
                    {...register("course_type_id")}
                    onValueChange={(e: any) => {
                      setValue("course_type_id", e);
                    }}
                    defaultValue={ct}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes?.map((option) => {
                        const stringValue = String(option.value);
                        console.log(stringValue, "stringValue");
                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">Visibility</Label>
                  <Select
                    {...register("visibility_id")}
                    onValueChange={(e: any) => {
                      setValue("visibility_id", e);
                    }}
                    // value={String(courseData?.visibility_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      {visibility?.map((option) => {
                        const stringValue = String(option.value);
                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">format</Label>
                  <Select
                    {...register("format_id")}
                    onValueChange={(e: any) => {
                      setValue("format_id", e);
                    }}
                    // value={String(courseData?.format_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatIds?.map((option) => {
                        const stringValue = String(option.value);

                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <label htmlFor="name">location</label>
                  <Label htmlFor="name">Region</Label>
                  <Select
                    {...register("region_id")}
                    onValueChange={(e: any) => {
                      setValue("region_id", e);
                    }}
                    // value={String(courseData?.region_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {region?.map((option) => {
                        const stringValue = String(option.value);

                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">Country</Label>
                  <Select
                    {...register("country_id")}
                    onValueChange={(e: any) => {
                      setValue("country_id", e);
                    }}
                    // value={String(courseData?.country_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {country?.map((option) => {
                        const stringValue = String(option.value);

                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">State</Label>
                  <Select
                    {...register("state_id")}
                    onValueChange={(e: any) => {
                      setValue("state_id", e);
                    }}
                    // value={String(courseData?.state_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {state?.map((option) => {
                        const stringValue = String(option.value);
                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">City</Label>
                  <Select
                    {...register("city_id")}
                    onValueChange={(e: any) => {
                      setValue("city_id", e);
                    }}
                    // value={String(courseData?.city_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      {city?.map((option) => {
                        const stringValue = String(option.value);

                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">Center</Label>
                  <Select
                    {...register("center_id")}
                    onValueChange={(e: any) => {
                      setValue("center_id", e);
                    }}
                    // value={String(courseData?.center_id)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Center" />
                    </SelectTrigger>
                    <SelectContent>
                      {center?.map((option) => {
                        const stringValue = String(option.value);

                        return (
                          <SelectItem key={option.value} value={stringValue}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <label htmlFor="name">Organizer</label>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="Name">Name</Label>
                    <Input
                      type="Name"
                      id="Name"
                      placeholder="Name"
                      {...register("contact_name")}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      {...register("contact_email")}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="PhoneNumber">PhoneNumber</Label>
                    <Input
                      type="PhoneNumber"
                      id="PhoneNumber"
                      placeholder="PhoneNumber"
                      {...register("contact_mobile")}
                    />
                  </div>

                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            format(startDate, "PPP")
                          ) : (
                            <span>Select Start Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? (
                            format(endDate, "PPP")
                          ) : (
                            <span>Select end Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

interface ICategory {
  id: number;
  title: string;
}

interface IProduct {
  id: number;
  name: string;
  category: { id: number };
  course_type_id: number;
  center_id: number;
  city_id: number;
  state_id: number;
  country_id: number;
  region_id: number;
  format_id: number;
  visibility_id: number;
  defaultValues: any;
}


// const EditCourse=()=>{
  
//   return(

//   )
// }