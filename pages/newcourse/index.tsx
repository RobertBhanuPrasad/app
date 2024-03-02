import {  useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { useEffect, useState } from "react";
import { cn } from "src/lib/utils";
import { Button } from "src/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "src/ui/card";
import { Input } from "src/ui/input";
import { Label } from "src/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";

import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "src/ui/calendar";
import { supabaseClient } from "src/utility/supabaseClient";
import { useRouter } from "next/navigation";

export default function Index() {
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
      }
    ],
  });

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

  const [startDate, setStartDate] = useState<any>();

  const [endDate, setEndDate] = useState<any>();

  const [userID, setUserID] = useState<any>();

  const getUser = async () => {
    const { data } = await supabaseClient.auth.getUser();
    setUserID(data?.user?.id);
    console.log(data?.user?.id, "user id");
  };




  useEffect(() => {
    getUser();
  }, []);

  const {
    refineCore: { onFinish , formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    refineCoreProps: {
      action: "create",
      resource: "course"  
    },
  });

  const onSubmit = async (data: any) => {
    register("created_by_user_id");
    setValue("created_by_user_id", userID);
    data.created_by_user_id = userID;
    register("course_start_date");
    setValue("course_start_date", startDate.toISOString());
    data.course_start_date = startDate.toISOString();
    register("course_end_date");
    setValue("course_end_date", endDate.toISOString());
    data.course_end_date = endDate.toISOString();

    console.log("Form values:", data);
    await onFinish(data);
  };

  return (
    <div className="text-3xl ml-20 mt-20">
      <Card className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="bg-red">
            <CardTitle>Create Course</CardTitle>
            <CardDescription>creating a new course</CardDescription>
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTypes?.map((option) => {
                      // const stringValue = String(option.value);
                      return (
                        <SelectItem
                          key={option.value}
                          value={JSON.stringify(option)}
                        >
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {/* <Label htmlFor="name">Organizer</Label>
                  <Select onValueChange={(e) => setValue(e)} value={value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select> */}
                <Label htmlFor="name">Visibility</Label>
                <Select
                  {...register("visibility_id")}
                  onValueChange={(e: any) => {
                    setValue("visibility_id", e);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
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
            <Button type="submit">Create</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

Index.noLayout = true;
