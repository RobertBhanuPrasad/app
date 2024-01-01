import { HttpError, useForm, useSelect } from "@refinedev/core";
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

interface ICategory {
  id: number;
  title: string;
}
interface IProduct {
  contact_name: string;
  contact_mobile: string;
  contact_email: string;
  // course_code: string;
  course_type_id: string;
  format_id: string;
  visibility_id: string;
  // status_id: string;
  course_start_date: any;
  course_end_date: any;
  // course_link: string;
  // course_landing_page_link: string;
  // course_registration_link: string;
  region_id: any;
  country_id: any;
  state_id: any;
  city_id: any;
  center_id: any;
}

interface FormValues {
  contact_name: string;
  contact_mobile: string;
  contact_email: string;
  // course_code: string;
  course_type_id: string;
  format_id: string;
  visibility_id: string;
  // status_id: string;
  course_start_date: any;
  course_end_date: any;
  // course_link: string;
  // course_landing_page_link: string;
  // course_registration_link: string;
  region_id: any;
  country_id: any;
  state_id: any;
  city_id: any;
  center_id: any;
  // organizer_user_id: any;
  created_by_user_id: any;
}
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
  console.log(visibility, "visibility");
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

  console.log(country, "country");

  const { options: state } = useSelect({
    resource: "state",
    optionLabel: "name",
    optionValue: "id",
  });
  console.log(state, "state");
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

  console.log(courseTypes, "courseTypes");
  const {
    onFinish,
    queryResult,
  } = useForm<IProduct, HttpError, FormValues>({
    resource: "course",
    action: "create",
    // redirect: "show", // redirect to show page after form submission, defaults to "list"
  });

  console.log("heyy result", queryResult);

  const [values, setValues] = useState<FormValues>({
    contact_name: "",
    contact_mobile: "",
    contact_email: "",
    // course_code: "",
    course_type_id: "",
    format_id: "",
    visibility_id: "",
    // status_id: "",
    course_start_date: "",
    course_end_date: "",
    // course_link: "",
    // course_landing_page_link: "",
    // course_registration_link: "",
    region_id: "",
    country_id: "",
    state_id: "",
    city_id: "",
    center_id: "",
    created_by_user_id: "",

    // organizer_user_id: "",
  });
  const [courseValue, setCourseValue] = useState<any>();

  const [visibilityValue, setVisibilityValue] = useState<any>();

  const [formatValue, setFormatValue] = useState<any>();

  const [startDate, setStartDate] = useState<any>();

  const [endDate, setEndDate] = useState<any>();

  const [userID, setUserID] = useState<any>();
  const onSubmit = (e: any) => {
    console.log(e, "on submit");
    console.log(values, "values");
    e.preventDefault();
    setValues({
      ...values,
      course_start_date: startDate.toISOString(),
      course_end_date: endDate.toISOString(),
      created_by_user_id: userID,
    });

    onFinish(values);
  };
  const getUser = async () => {
    const { data } = await supabaseClient.auth.getUser();
    setUserID(data?.user?.id);
    console.log(data?.user?.id, "data");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="text-3xl ml-20 mt-20">
      <Card className="w-[400px]">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Create Course</CardTitle>
            <CardDescription>creating a new course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-10">
              <div className="flex flex-col space-y-1.5 gap-4">
                <Label htmlFor="name">course name</Label>
                <Select
                  onValueChange={(e) => {
                    setCourseValue(e);
                    setValues({ ...values, course_type_id: e });
                  }}
                  value={courseValue}
                  defaultValue={values.course_type_id}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTypes?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
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
                  onValueChange={(e) => {
                    setVisibilityValue(e);
                    setValues({ ...values, visibility_id: e });
                  }}
                  value={visibilityValue}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {visibility?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Label htmlFor="name">format</Label>
                <Select
                  onValueChange={(e) => {
                    setFormatValue(e);
                    setValues({ ...values, format_id: e });
                  }}
                  value={formatValue}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatIds?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <label htmlFor="name">location</label>
                <Label htmlFor="name">Region</Label>
                <Select
                  onValueChange={(e) => {
                    setValues({ ...values, region_id: e });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {region?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Label htmlFor="name">Country</Label>
                <Select
                  onValueChange={(e) => {
                    console.log(e, "e");
                    setValues({ ...values, country_id: e });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {country?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Label htmlFor="name">State</Label>
                <Select
                  onValueChange={(e) => {
                    setValues({ ...values, state_id: e });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {state?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Label htmlFor="name">City</Label>
                <Select
                  onValueChange={(e) => {
                    setValues({ ...values, city_id: e });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {city?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Label htmlFor="name">Center</Label>
                <Select
                  onValueChange={(e) => {
                    setValues({ ...values, center_id: e });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {center?.map((option) => {
                      return (
                        <SelectItem key={option.value} value={option.value}>
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
                    onChange={(e) =>
                      setValues({ ...values, contact_name: e.target.value })
                    }
                    value={values.contact_name}
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setValues({ ...values, contact_email: e.target.value })
                    }
                    value={values.contact_email}
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="PhoneNumber">PhoneNumber</Label>
                  <Input
                    type="PhoneNumber"
                    id="PhoneNumber"
                    placeholder="PhoneNumber"
                    onChange={(e) =>
                      setValues({ ...values, contact_mobile: e.target.value })
                    }
                    value={values.contact_mobile}
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
      {/* <form onSubmit={onSubmit}>
              <label htmlFor="name">Name</label>
              <input
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
              <label htmlFor="material">Material</label>
              <input
                  name="material"
                  placeholder="Material"
                  value={values.material}
                  onChange={(e) => setValues({ ...values, material: e.target.value })}
              />
              <button type="submit">Submit</button>
          </form> */}
    </div>
  );
}

Index.noLayout = true;
