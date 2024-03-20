"use client";
import Delete from "@public/assets/Delete";
import EditIcon from "@public/assets/EditIcon";
import SearchIcon from "@public/assets/SearchIcon";
import {
  CrudFilter,
  useList,
  useSelect,
  CrudFilters,
  useGetIdentity,
} from "@refinedev/core";
import _ from "lodash";
import Add from "@public/assets/Add";
import Clock from "@public/assets/Clock";
import DropDown from "@public/assets/DropDown";
import { useEffect, useState } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { Badge } from "src/ui/badge";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import CustomSelect from "src/ui/custom-select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/ui/dialog";
import CalenderIcon from "@public/assets/CalenderIcon";
import { format, setDate } from "date-fns";
import { X } from "lucide-react";
import { Calendar } from "src/ui/calendar";
import { Input } from "src/ui/input";
import { supabaseClient } from "src/utility";
import { fetchLongitudeLatitudeData } from "src/utility/GetOptionValuesByOptionLabel";

import { RadioGroup, RadioGroupCircleItem } from "src/ui/radio-group";
import { Label } from "src/ui/label";
import useDebounce from "src/utility/useDebounceHook";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import { Popover, PopoverContent, PopoverTrigger } from "src/ui/popover";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import {
  CenterDropDown,
  CityDropDown,
  MapComponent,
  PostalCodeComponent,
  StateDropDown,
  StreetAddressComponent,
  VenueNameComponent,
} from "@components/CommonComponents/DropDowns";

function NewCourseStep3() {
  const { watch } = useFormContext();
  const formData = watch();
  return (
    <div className="flex flex-col gap-8">
      <div>
        {formData?.courseTypeSettings?.is_online_program ? (
          <OnlineProgram />
        ) : (
          <div className="mb-8">
            <Venue />
          </div>
        )}
      </div>
      <Schedules />
    </div>
  );
}

export default NewCourseStep3;

const OnlineProgram = () => {
  return (
    <div className="h-[218px] flex flex-col gap-8">
      <div>
        <div className="">Online zoom URL </div>
        <div className="w-80">
          <Input placeholder="URL" className="rounded-[12px]" />
          <div className="text-xs font-normal text-[#666666] italic w-[320px] overflow-hidden">
            <div>
              Note: Participants will join your online course through your
            </div>
            <div>virtual venue</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <div>
          Please associate your course with a specific location for reporting
          purposes
        </div>
        <div className="flex gap-7">
          <div className="w-80">
            <StateDropDown />
          </div>
          <div className="w-80">
            <CityDropDown />
          </div>
          <div className="w-80">
            <CenterDropDown />
          </div>
        </div>
      </div>
    </div>
  );
};

const Schedules = () => {
  return (
    <div className="flex flex-col gap-4 w-[1016px]">
      <SchedulesHeader />
      <Sessions />
    </div>
  );
};

const SchedulesHeader = () => {
  const {
    field: { value: hoursFormat, onChange: hoursFormatOnChange },
  } = useController({ name: "hoursFormat" });

  let timeFormatOptions =
    getOptionValuesByOptionLabel(TIME_FORMAT)?.[0]?.option_values;

  timeFormatOptions = timeFormatOptions?.map(
    (val: { id: any; value: string }) => {
      return {
        value: val?.id,
        label: val?.value,
      };
    }
  );
  return (
    <div className="h-9 flex justify-between">
      <div className="font-semibold text-[#333333] flex items-center">
        Event Date and Time
      </div>
      <div className="flex gap-4">
        <div className="w-[161px]">
          <CustomSelect
            value={hoursFormat}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              hoursFormatOnChange(val);
            }}
          />
        </div>
        <div className="w-[257px]">
          <CustomSelect
            value={""}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
const Sessions = () => {
  const { append, remove } = useFieldArray({
    name: "schedules",
  });

  const { watch } = useFormContext();

  const [open, setOpen] = useState(false);

  const formData = watch();

  const schedules = formData?.schedules;

  const handleAddSession = () => {
    append({
      startHour: "00",
      startMinute: "00",
      endHour: "00",
      endMinute: "00",
      startTimeFormat: "AM",
      endTimeFormat: "AM",
      date: new Date(),
    });
  };

  useEffect(() => {
    if (schedules?.length <= 0 || !schedules) {
      handleAddSession();
    }
  }, []);

  const handleRemoveSession = (index: number) => {
    remove(index);
  };

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id;

  return (
    <div className="flex flex-col gap-4">
      {schedules?.map((schedule: any, index: number) => {
        return (
          <div
            className="h-15 flex flex-col gap-1 justify-between"
            key={schedule?.id}
          >
            <div className="h-4 font-[#333333] font-normal flex text-xs">
              <div>Session {index + 1} </div>
              <div className="text-[#7677F4]">&nbsp;*</div>
            </div>
            <div className="h-10 flex items-center gap-6">
              <Dialog open={open}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpen(true)}
                    className="w-[233px] h-[40px] flex flex-row items-center justify-start gap-2"
                    variant="outline"
                  >
                    <div>
                      <CalenderIcon />
                    </div>
                    <div>
                      {format(new Date(schedule?.date), "dd MMM, yyyy")}
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="!w-[810px] !h-[511px] bg-[#FFFFFF]">
                  <CalenderComponent index={index} setOpen={setOpen} />
                </DialogContent>
              </Dialog>
              <TimePicker
                index={index}
                is12HourFormat={
                  formData?.hoursFormat?.value == timeFormat12HoursId
                    ? true
                    : false
                }
              />
              <div className="w-[127px] flex gap-4 ">
                {index == formData?.schedules?.length - 1 && (
                  <div
                    onClick={() => {
                      handleAddSession();
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer flex items-center gap-[6px]"
                  >
                    <Add /> Add
                  </div>
                )}
                {index != 0 && (
                  <div
                    onClick={() => {
                      handleRemoveSession(index);
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer flex items-center gap-[6px]"
                  >
                    <Delete />
                    Delete
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Venue = () => {
  const { watch, setValue, resetField } = useFormContext();

  const removeVenue = () => {
    setValue("newVenue", null);
  };

  const formData = watch();

  const {
    field: { onChange: isNewVenueOnchange },
  } = useController({
    name: "isNewVenue",
  });

  const { data } = useList({
    resource: "venue",
  });

  const {
    field: { value: existingVenue },
  } = useController({
    name: "existingVenue",
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "isNewVenueSelected",
  });

  const {
    field: { onChange: newVenueOnchange },
  } = useController({
    name: "newVenue",
  });

  return (
    <div>
      <RadioGroup
        className="flex flex-row gap-7"
        onValueChange={onChange}
        value={value}
      >
        <div
          className={`rounded-[16px] w-[494px] h-[118px]  relative flex py-[24px] px-4 flex-col ${
            value === "existing-venue"
              ? "border border-[#7677F4]"
              : "border border-[#D6D7D8]"
          }`}
        >
          <Label htmlFor="existing-venue">
            <div className="text-[#7677F4] text-[16px] font-semibold flex flex-row gap-[12px]">
              <RadioGroupCircleItem
                value="existing-venue"
                id="existing-venue"
                className={` ${
                  value == "existing-venue"
                    ? "!bg-[#7677F4] "
                    : "border !border-[#D6D7D8] border-[1.5px] "
                }`}
              />
              <div>Existing Venue</div>
            </div>
            {data ? (
              <div>
                {existingVenue ? (
                  <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666]">
                    {formData?.existingVenue[0]?.address},
                    {formData?.existingVenue[0]?.postal_code}
                  </div>
                ) : (
                  <div className="pl-[30px] leading-6 font-normal">
                    Select a venue by clicking “View All” button
                  </div>
                )}
                {!(value === "new-venue") && (
                  <Dialog>
                    <DialogTrigger>
                      <Badge
                        variant="outline"
                        className="absolute left-48 -bottom-3 bg-[white] w-[93px] h-[34px] items-center justify-center text-[#7677F4] border border-[#7677F4]"
                      >
                        View All
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="w-[858px] h-[585px] rounded-[24px] ">
                      <ExistingVenue />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              <div className="px-[30px] leading-6 font-normal">
                No existing venue found
              </div>
            )}
          </Label>
        </div>
        {formData?.newVenue ? (
          <Label htmlFor="new-venue">
            <div
              className={`w-[494px] h-[118px] rounded-[16px] border border-[#7677F4] px-4 py-6 ${
                value === "new-venue"
                  ? "border border-[#7677F4]"
                  : "border border-[#D6D7D8]"
              }`}
            >
              <div className=" flex flex-row justify-between">
                <div className="text-[16px] font-semibold text-[#7677F4] gap-3 flex flex-row">
                  <RadioGroupCircleItem
                    value="new-venue"
                    id="new-venue"
                    className={` ${
                      value == "new-venue"
                        ? "!bg-[#7677F4] "
                        : "border !border-[#D6D7D8] border-[1.5px] "
                    }`}
                  />
                  <div>New Venue</div>
                </div>
                <div className="flex flex-row gap-3">
                  <Dialog
                    onOpenChange={() => {
                      setValue("newVenue.city", {
                        value: formData?.newVenue?.city?.value,
                        label: formData?.newVenue?.city?.label,
                      });
                      setValue("newVenue.state", {
                        value: formData?.newVenue?.state?.value,
                        label: formData?.newVenue?.state?.value,
                      });
                      setValue(
                        "newVenue.postalCode",
                        formData?.newVenue?.postalCode
                      );
                      setValue(
                        "newVenue.streetAddress",
                        formData?.newVenue?.streetAddress
                      );
                      setValue("newVenue.venue", formData?.newVenue?.venue);
                      setValue("newVenue.center", formData?.newVenue?.center);
                    }}
                  >
                    <DialogTrigger
                      onClick={() => {
                        isNewVenueOnchange(false);
                      }}
                    >
                      <EditIcon />
                    </DialogTrigger>
                    <DialogContent className="!w-[636px] !h-[647px] pt-6 px-[25px] rounded-6">
                      <AddOrEditVenue />
                      <DialogFooter>
                        <div className="w-full flex items-center justify-center">
                          <DialogClose>
                            <Button type="submit">Submit</Button>
                          </DialogClose>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger>
                      <Delete />
                    </DialogTrigger>
                    <DialogContent className="w-[414px] h-[189px] !py-6 !px-6 !rounded-[24px]">
                      <DialogHeader>
                        <DialogTitle className="flex justify-center">
                          Delete
                        </DialogTitle>
                        <DialogDescription className="flex justify-center !pt-[14px] text-[16px] text-[#333333]">
                          Are you sure you want to delete the address
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="w-full flex !justify-center gap-6">
                        <DialogClose>
                          <Button className="border border-[#7677F4] bg-[white] w-[71px] h-[46px] text-[#7677F4] font-semibold">
                            No
                          </Button>
                        </DialogClose>
                        <DialogClose>
                          <Button
                            className="bg-[#7677F4] w-[71px] h-[46px] rounded-[12px] font-semibold"
                            onClick={() => removeVenue()}
                          >
                            Yes
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666]">
                {formData?.newVenue?.streetAddress},
                {formData?.newVenue?.city_id?.label},
                {formData?.newVenue?.postalCode}
              </div>
            </div>
          </Label>
        ) : (
          <Dialog
            onOpenChange={() => {
              resetField("center");
              resetField("state_id");
              resetField("streetAddress");
              resetField("postalCode");
              resetField("city_id");
              resetField("venueName");
            }}
          >
            <DialogTrigger
              onClick={() => {
                isNewVenueOnchange(true);
              }}
            >
              <div className="w-[494px] h-[118px] rounded-[16px] border flex items-center justify-center text-[#7677F4]">
                + Add New Venue
              </div>
            </DialogTrigger>
            <DialogContent className="!w-[636px] !h-[647px] pt-6 px-[25px] rounded-6">
              <AddOrEditVenue />
              <DialogFooter>
                <div className="w-full flex items-center justify-center">
                  <DialogClose>
                    <Button
                      type="submit"
                      onClick={() => {
                        onChange("new-venue");
                        newVenueOnchange({
                          venue: formData?.venue,
                          state: formData?.state_id,
                          city: formData?.city_id,
                          streetAddress: formData?.streetAddress,
                          postalCode: formData?.postalCode,
                          center: formData?.center,
                        });
                      }}
                    >
                      Submit
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </RadioGroup>
    </div>
  );
};

const TimePicker = ({
  index,
  is12HourFormat,
}: {
  index: number;
  is12HourFormat: Boolean;
}) => {
  return (
    <div className="flex items-center gap-6">
      <div className="text-sm text-[#999999] font-normal">From</div>
      <div className="w-[233px]">
        <TimeSelector
          name={`schedules[${index}].start`}
          is12HourFormat={is12HourFormat}
        />
      </div>
      <div className="text-sm text-[#999999] font-normal">To</div>
      <div className="w-[233px]">
        <TimeSelector
          name={`schedules[${index}].end`}
          is12HourFormat={is12HourFormat}
        />
      </div>
    </div>
  );
};
const CalenderComponent = ({ index, setOpen }: any) => {
  // Get the date value and onChange function from the controller
  const {
    field: { value: dateValue, onChange },
  } = useController({
    name: `schedules[${index}].date`,
  });

  // Initialize state for the selected date, defaulting to the provided dateValue or today's date
  const [date, setDate] = useState<any>(dateValue ? dateValue : new Date());

  // Fetch organization calendar settings
  const { data: settingsData } = useList<any>({
    resource: "organization_calender_settings",
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: 1,
      },
    ],
  });

  // Define filters based on the selected date
  const dateFilters: CrudFilters = [
    {
      field: "start_time",
      operator: "gte",
      value: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
    },
    {
      field: "end_time",
      operator: "lt",
      value: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Add additional filters based on organization calendar settings
  const filter = [...dateFilters];
  if (settingsData) {
    if (settingsData?.data[0]?.is_city_enabled) {
      filter.push({
        field: "program_id.city_id.id",
        operator: "eq",
        value: 1,
      });
    }
    if (settingsData?.data[0]?.is_state_enabled) {
      filter.push({
        field: "program_id.state_id.id",
        operator: "eq",
        value: 1,
      });
    }
    if (settingsData?.data[0]?.is_venue_enabled) {
      filter.push({
        field: "program_id.venue_id",
        operator: "eq",
        value: 1,
      });
    }
  }

  // Fetch program schedules based on the filters
  const { data } = useList<any>({
    resource: "program_schedules",
    meta: {
      select:
        "*,program_id!inner(program_type_id!inner(name),city_id!inner(id ,name),state_id!inner(id ,name),venue_id))",
    },
    filters: filter,
  });

  // Handle date selection in the calendar
  const handleOnSelect = (selected: Date | undefined) => {
    setDate(selected);
  };

  // Format time string
  const formatTime = (timeString: string) => {
    const dateObj = new Date(timeString);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[401px] flex flex-row gap-4">
        {/* Calendar component */}
        <div className="flex-[1]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleOnSelect}
            className="rounded-md"
            count={data?.total || 0}
          />
        </div>
        {/* Course details */}
        <div className="border-l border-gray-300 h-full"></div>
        <div className="flex flex-col gap-4 flex-[1] p-2 h-[401px]">
          <div className="flex flex-row justify-between text-[20px] font-semibold">
            Course
            {/* Close button */}
            <div
              onClick={() => {
                setOpen(false);
              }}
            >
              <X className="h-6 w-6" />
            </div>
          </div>
          <div className="flex flex-col gap-4 max-h-[352px] scrollbar overflow-y-auto">
            {/* Display course details */}
            {data?.data?.map((course: any) => (
              <div key={course.id}>
                <div className="text-[12px] text-[#999999] tracking-wider font-semibold">
                  {formatTime(course.start_time)} -{" "}
                  {formatTime(course?.end_time)} .{" "}
                  {course?.program_id?.city_id?.name},{" "}
                  {course?.program_id?.state_id?.name}
                </div>
                <div className="font-semibold text-[16px]">
                  {course.program_id?.program_type_id?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Submit button */}
      <div className="flex self-center">
        <Button
          onClick={() => {
            onChange(date);
            setOpen(false);
          }}
          className="w-24 rounded-[12px]"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

const ExistingVenue = () => {
  const { setValue, watch } = useFormContext();

  const formData = watch();

  const [searchValue, searchOnChange] = useState<string>("");

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [otherVenueSkip, setOtherVenueSkip] = useState<number>(0);

  const [venueData, setVenueData] = useState<any[]>([]);

  const {
    field: { value: deletedVenueIds = [], onChange: deleteVenueIdOnChange },
  } = useController({
    name: "deletedVenueID",
  });

  const {
    field: { onChange },
  } = useController({
    name: "isNewVenue",
  });

  const {
    field: { onChange: isNewVenueSelectedOnchange },
  } = useController({
    name: "isNewVenueSelected",
  });

  const fetchLoginUserVenue = async () => {
    const { data } = await supabaseClient
      .from("venue_view_with_names")
      .select("*")
      .eq("created_by_user_id", "1")
      .or(
        `name.ilike."%${debouncedSearchValue}%",state_name.ilike.%${debouncedSearchValue}%,city_name.ilike."%${debouncedSearchValue}%",center_name.ilike."%${debouncedSearchValue}%"`
      );

    return data;
  };

  const fetchOtherVenues = async () => {
    const { data } = await supabaseClient
      .from("venue_view_with_names")
      .select("*")
      // .neq("created_by_user_id", "1")
      .or(
        `name.ilike."%${debouncedSearchValue}%",state_name.ilike.%${debouncedSearchValue}%,city_name.ilike."%${debouncedSearchValue}%",center_name.ilike."%${debouncedSearchValue}%"`
      )
      .range(otherVenueSkip, otherVenueSkip + 5);

    return data;
  };

  const fetchVenueData = async () => {
    const loginUserVenues = ((await fetchLoginUserVenue()) as any[]) ?? [];
    const otherVenueData = ((await fetchOtherVenues()) as any[]) ?? [];
    setVenueData([...loginUserVenues, ...otherVenueData]);
  };

  //Fetching initial Data of venues
  useEffect(() => {
    fetchVenueData();
  }, []);

  //Fetching venue data after search
  useEffect(() => {
    setVenueData([]);
    setOtherVenueSkip(0);

    fetchVenueData();
  }, [debouncedSearchValue]);

  const filteredVenueData = venueData.filter(
    (obj) => !deletedVenueIds.includes(obj.id)
  );

  const deleteVenue = (id: any) => {
    deleteVenueIdOnChange([...deletedVenueIds, id]);
  };

  //fetching other venue data after scrolling
  useEffect(() => {
    const fetchOtherVenueDataAfterScroll = async () => {
      const otherVenueData = ((await fetchOtherVenues()) as any[]) ?? [];
      setVenueData([...filteredVenueData, ...otherVenueData]);
    };
    fetchOtherVenueDataAfterScroll();
  }, [otherVenueSkip]);

  const onBottomReached = () => {
    if (filteredVenueData && filteredVenueData?.length >= 6)
      setOtherVenueSkip((previousLimit: number) => previousLimit + 6);
  };

  const handleCheckboxChange = (item: any) => {
    setValue("venueId", item.id);
  };
  const {
    field: { onChange: existingVenueOnChange },
  } = useController({
    name: "existingVenue",
  });

  const getExistingVenueDetails = () => {
    const existingVenueObject = venueData.filter(
      (venue) => venue.id == formData?.venueId
    );
    existingVenueOnChange(existingVenueObject);
  };

  const { data: loginUserData }: any = useGetIdentity();

  const user_roles: any[] = loginUserData?.userData?.user_roles;

  const isUserNationAdminOrSuperAdmin =
    user_roles[0]?.role_id?.value == "National Admin" ||
    user_roles[0]?.role_id?.value == "Super Admin";

  return (
    <div>
      <div className="w-[858px]  rounded-[24px]  pt-6 !pl-4 !pr-4 ">
        <div className="flex justify-center text-[24px] font-semibold">
          Existing Venues
        </div>
        <div className="relative w-[390px] h-[40px] flex justify-end items-center mx-auto mt-4">
          <Input
            placeholder="Search by Venue Name, City or state"
            className="border border-gray-400 rounded-lg pl-10"
            value={searchValue}
            onChange={(val) => {
              searchOnChange(val.target.value);
            }}
          />
          <div className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground">
            <SearchIcon />
          </div>
        </div>
        <GetScrollTypesAlert
          id={"options"}
          onBottom={() => {
            onBottomReached();
          }}
        >
          <div
            className=" h-[344px] mt-6 overflow-auto overscroll-none flex flex-row flex-wrap gap-6 "
            id={"options"}
          >
            {/* <div className="flex flex-row flex-wrap gap-6 "> */}
            {filteredVenueData?.map((item: any) => {
              return (
                <div className="flex  flex-row !w-[390px] h-[102px] rounded-4 items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id={item.id}
                    value={item.id}
                    onCheckedChange={() => handleCheckboxChange(item)}
                    checked={formData?.venueId == item.id ? true : false}
                  />
                  <div className="space-y-1 leading-none">
                    <div className="flex justify-between">
                      <div className="font-semibold">{item.name}</div>
                      <div className="flex flex-row gap-3">
                        {(isUserNationAdminOrSuperAdmin ||
                          item?.created_by_user_id ==
                            loginUserData?.userData?.id) && (
                          <Dialog
                            onOpenChange={() => {
                              setValue("city_id", {
                                value: item?.city_id,
                                label: item?.city_name,
                              });
                              setValue("state_id", {
                                value: item?.state_id,
                                label: item?.state_name,
                              });
                            }}
                          >
                            <DialogTrigger
                              onClick={() => {
                                onChange(false);
                              }}
                            >
                              <EditIcon />
                            </DialogTrigger>
                            <DialogContent className="!w-[636px] !h-[647px] pt-6 px-[25px] rounded-6">
                              <AddOrEditVenue />
                            </DialogContent>
                          </Dialog>
                        )}
                        {isUserNationAdminOrSuperAdmin && (
                          <Dialog>
                            <DialogTrigger>
                              <Delete />
                            </DialogTrigger>
                            <DialogContent className="w-[414px] h-[189px] !py-6 !px-6 !rounded-[24px]">
                              <DialogHeader>
                                <DialogTitle className="flex justify-center">
                                  Delete
                                </DialogTitle>
                                <DialogDescription className="flex justify-center !pt-[14px] text-[16px] text-[#333333]">
                                  Are you sure you want to delete the address
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="w-full flex !justify-center gap-6">
                                <DialogClose>
                                  <Button className="border border-[#7677F4] bg-[white] w-[71px] h-[46px] text-[#7677F4] font-semibold">
                                    No
                                  </Button>
                                </DialogClose>
                                <DialogClose>
                                  <Button
                                    className="bg-[#7677F4] w-[71px] h-[46px] rounded-[12px] font-semibold"
                                    onClick={() => deleteVenue(item.id)}
                                  >
                                    Yes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>

                    <div className="leading-tight">
                      {item.address} {item.postal_code}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* </div> */}
          </div>
        </GetScrollTypesAlert>
      </div>
      <div className="w-full flex items-center justify-center mt-8">
        <DialogClose>
          <Button
            type="submit"
            onClick={() => {
              isNewVenueSelectedOnchange("existing-venue");
              getExistingVenueDetails();
            }}
          >
            Submit
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export const AddOrEditVenue = ({}) => {
  const { watch } = useFormContext();

  const formData = watch();

  const isNewVenue = formData?.isNewVenue;

  return (
    <div>
      {isNewVenue ? (
        <div className="flex justify-center text-[24px] font-semibold">
          New Venue
        </div>
      ) : (
        <div className="flex justify-center text-[24px] font-semibold">
          Edit Venue
        </div>
      )}

      <MapComponent />
      <div className="flex flex-row gap-[30px]">
        <div className="flex flex-col gap-5">
          <VenueNameComponent />
          <PostalCodeComponent />
          <CityDropDown />
        </div>

        <div className="flex flex-col gap-5">
          <StreetAddressComponent />
          <StateDropDown />
          <CenterDropDown />
        </div>
      </div>
    </div>
  );
};

// Component for selecting time with hour and minute inputs
const TimeSelector = ({
  name, // Name of the time selector
  is12HourFormat, // Boolean indicating whether to display time in 12-hour format
}: {
  name: string;
  is12HourFormat: Boolean;
}) => {
  // Maximum hours depending on the time format
  const maximumHours = is12HourFormat ? 12 : 23;

  // Extracting hour value and onChange function using useController hook
  const {
    field: { value: hourValue = "00", onChange: hourOnChange },
  } = useController({ name: `${name}Hour` });

  // Extracting minute value and onChange function using useController hook
  const {
    field: { value: minuteValue = "00", onChange: minuteOnChange },
  } = useController({ name: `${name}Minute` });

  // Extracting time format value and onChange function using useController hook
  const {
    field: { value: timeFormat = "AM", onChange: timeFormatOnChange },
  } = useController({ name: `${name}TimeFormat` });

  // Function to preprocess input value (add leading zeros and remove non-numeric characters)
  const preProcessInputValue = (value: string): string => {
    while (value.length < 2) {
      value = "0" + value;
    }
    // Remove any non-numeric characters from the input
    const numericValue = value.replace(/[^0-9]/g, "");

    // Truncate to 2 characters
    const truncatedValue = numericValue.slice(-2);

    return truncatedValue;
  };

  // Event handler for hour input change
  const handleHour = (event: { target: { value: any } }) => {
    let inputValue = event.target.value;

    const hour = preProcessInputValue(inputValue);

    hourOnChange(hour);
  };

  // Event handler for incrementing hour
  const handleHourUpArrow = () => {
    if (hourValue == "00") {
      hourOnChange(maximumHours);
      return;
    }

    let hour = (parseInt(hourValue) - 1).toString();
    hour = preProcessInputValue(hour);
    hourOnChange(hour);
  };

  // Event handler for decrementing hour
  const handleHourDownArrow = () => {
    if (hourValue >= maximumHours) {
      hourOnChange("00");
      return;
    }

    let hour = (parseInt(hourValue) + 1).toString();
    hour = preProcessInputValue(hour);
    hourOnChange(hour);
  };

  // Event handler for minute input change
  const handleMinute = (event: { target: { value: any } }) => {
    let inputValue = event.target.value;
    const minute = preProcessInputValue(inputValue);
    minuteOnChange(minute);
  };

  // Event handler for incrementing minutes
  const handleMinutesUpArrow = () => {
    if (minuteValue == "00") {
      minuteOnChange("59");
      return;
    }

    let minute = (parseInt(minuteValue) - 1).toString();
    minute = preProcessInputValue(minute);
    minuteOnChange(minute);
  };

  // Event handler for decrementing minutes
  const handleMinutesDownArrow = () => {
    if (minuteValue == "59") {
      minuteOnChange("00");
      return;
    }

    let minute = (parseInt(minuteValue) + 1).toString();
    minute = preProcessInputValue(minute);
    minuteOnChange(minute);
  };

  // Effect to handle hour format change
  useEffect(() => {
    if (is12HourFormat == true) {
      if (hourValue > 12) {
        const hours = parseInt(hourValue) - 12;
        const newHourValue = preProcessInputValue(hours.toString());
        hourOnChange(newHourValue);
        timeFormatOnChange("PM");
      }
    } else {
      if (timeFormat == "PM" && hourValue != 12) {
        const hours = parseInt(hourValue) + 12;
        const newHourValue = preProcessInputValue(hours.toString());
        hourOnChange(newHourValue);
      }
    }
  }, [is12HourFormat]);

  return (
    <Popover>
      <PopoverTrigger name={`TimeSelector ${name}`}>
        <div className="border border-1 py-[10px] px-[14px] flex justify-between items-center rounded-xl cursor-pointer w-[233px]">
          <div className="flex gap-2 items-center">
            <Clock />
            <div>
              {hourValue} : {minuteValue} {is12HourFormat && timeFormat}
            </div>
          </div>
          <div className="px-1 py-[7px]">
            <DropDown />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="!w-[233px] h-[154px] flex items-center justify-center">
        <div className="flex w-[200px] items-center justify-center">
          <div className="flex basis-4/5 items-center justify-center gap-3">
            <div className="flex items-center justify-center flex-col gap-4">
              <div
                className="rotate-180 cursor-pointer"
                onClick={handleHourUpArrow}
              >
                <DropDown fill="#7677F4" />
              </div>
              <div>
                <Input
                  className="w-12"
                  name={`${name}-hours`}
                  value={hourValue}
                  onChange={handleHour}
                  onBlur={() => {
                    if (hourValue > maximumHours) {
                      hourOnChange(maximumHours);
                    }
                  }}
                />
              </div>
              <div className="cursor-pointer" onClick={handleHourDownArrow}>
                <DropDown fill="#7677F4" />
              </div>
            </div>
            :
            <div>
              <div className="flex items-center justify-center flex-col gap-4">
                <div
                  className="rotate-180 cursor-pointer"
                  onClick={handleMinutesUpArrow}
                >
                  <DropDown fill="#7677F4" />
                </div>
                <div>
                  <Input
                    className="w-12"
                    name={`${name}-minutes`}
                    value={minuteValue}
                    onChange={handleMinute}
                    onBlur={() => {
                      if (minuteValue > 59) {
                        minuteOnChange(59);
                      }
                    }}
                  />
                </div>
                <div
                  className="cursor-pointer"
                  onClick={handleMinutesDownArrow}
                >
                  <DropDown fill="#7677F4" />
                </div>
              </div>
            </div>
          </div>
          {is12HourFormat && (
            <div className="flex basis-1/5 flex-col items-center justify-center gap-2">
              <div
                className="w-12 h-10 border border-2 border-[blue] flex items-center justify-center bg-blue-600 text-white font-medium rounded-md cursor-pointer"
                onClick={() => {
                  timeFormatOnChange("AM");
                }}
              >
                AM
              </div>
              <div
                className="w-12 h-10 border border-2 border-[blue] flex items-center justify-center bg-blue-600 text-white font-medium rounded-md cursor-pointer"
                onClick={() => {
                  timeFormatOnChange("PM");
                }}
              >
                PM
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
