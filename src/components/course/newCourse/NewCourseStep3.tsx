"use client";
import ViewMap, { fetchLongitudeLatitudeData } from "@components/ViewMap";
import Delete from "@public/assets/Delete";
import EditIcon from "@public/assets/EditIcon";
import SearchIcon from "@public/assets/SearchIcon";
import { CrudFilter, useDelete, useList, useSelect } from "@refinedev/core";
import _, { truncate } from "lodash";
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
import { Input } from "src/ui/input";
import { supabaseClient } from "src/utility";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import dynamic from "next/dynamic";
import {
  RadioGroup,
  RadioGroupCircleItem,
  RadioGroupItem,
} from "src/ui/radio-group";
import { Label } from "src/ui/label";
import useDebounce from "src/utility/useDebounceHook";
import GetScrollTypesAlert from "@components/GetScrollAlert";
import { loginUserStore } from "src/zustandStore/LoginUserStore";

// export function MyAwesomeMap() {
//   const Component = dynamic(() => import("../../ViewMap/index"), {
//     ssr: false,
//   });
//   return <Component />;
// }
// const MyAwesomeMap = dynamic(() => import("../../ViewMap/index"), {
//   ssr: false,
// });

function NewCourseStep3() {
  const { watch } = useFormContext();
  const formData = watch();
  return (
    <div>
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
          <div className="">
            Note: Participants will join your online course through your virtual
            venue
          </div>
        </div>
      </div>
      <div>
        <div className="">
          Please associate your course with a specific location for reporting
          purposes
        </div>
        <div>Location drop downs</div>
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
  const [value, onChange] = useState<any>();

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
            value={value}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              onChange(val);
            }}
          />
        </div>
        <div className="w-[257px]">
          <CustomSelect
            value={value}
            placeholder="Select time format"
            data={timeFormatOptions}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={(val) => {
              onChange(val);
            }}
          />
        </div>
      </div>
    </div>
  );
};
const Sessions = () => {
  const {
    fields: schedules,
    append,
    remove,
  } = useFieldArray({
    name: "schedules",
  });

  useEffect(() => {
    if (schedules?.length == 0) {
      append({ value: "1" });
    }
  });

  const options: any[] = [];

  const [value, onChange] = useState<any>();

  const handleAddSession = (index: number) => {
    append({ value: index });
  };

  const handleRemoveSession = (index: number) => {
    remove(index);
  };
  return (
    <div>
      {schedules?.map((schedule: any, index: number) => {
        return (
          <div className="h-15 flex flex-col gap-1 justify-between">
            <div className="h-4 font-[#333333] font-normal flex text-xs">
              <div>Session {index + 1} </div>
              <div className="text-[#7677F4]">&nbsp;*</div>
            </div>
            <div className="h-10 flex items-center gap-6">
              <div className="w-[233px] ">Date</div>
              <div className="text-sm text-[#999999] font-normal">From</div>
              <div className="w-[233px]">From Time Selector</div>
              <div className="text-sm text-[#999999] font-normal">To</div>
              <div className="w-[233px]">To Time Selector</div>

              <div className="w-[127px] flex gap-4 ">
                {index == schedules?.length - 1 && (
                  <div
                    onClick={() => {
                      handleAddSession(index);
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer"
                  >
                    + Add
                  </div>
                )}
                {index != 0 && (
                  <div
                    onClick={() => {
                      handleRemoveSession(index);
                    }}
                    className="text-[#7677F4] font-normal cursor-pointer"
                  >
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
  const {
    field: { value: stateValue },
  } = useController({
    name: "state_id",
  });

  const {
    field: { value: venue },
  } = useController({
    name: "venue",
  });

  const {
    field: { value: streetAddress },
  } = useController({
    name: "streetAddress",
  });

  const {
    field: { value: postalCode },
  } = useController({
    name: "postalCode",
  });

  const {
    field: { value: center },
  } = useController({
    name: "center",
  });

  const {
    field: { value: cityValue },
  } = useController({
    name: "city_id",
  });

  const {
    field: { value: coordinates, onChange: setCoordinates },
  }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
    useController({
      name: "address_line_coordinates",
    });

  const { watch, setValue } = useFormContext();

  const removeVenue = () => {
    setValue("city_id", null);
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
    field: { value: VenueId, onChange: venueIdOnChange },
  } = useController({
    name: "venueId",
  });

  const {
    field: { onChange },
  } = useController({
    name: "isNewVenueSelected",
  });
  return (
    <div>
      <RadioGroup
        className="flex flex-row gap-7"
        value={VenueId ? "existing-venue" : "new-venue"}
      >
        <div className="rounded-[16px] w-[494px] h-[118px] border  border-[#D6D7D8] relative flex py-[24px] px-4 flex-col">
          <Label htmlFor="existing-venue">
            <div className="text-[#7677F4] text-[16px] font-semibold flex flex-row gap-[12px]">
              <RadioGroupCircleItem
                value={VenueId ? "existing-venue" : ""}
                id="existing-venue"
                className={` ${
                  VenueId
                    ? "!bg-[#7677F4]"
                    : "border !border-[#D6D7D8] border-[1.5px] "
                }`}
              />
              <div>Existing Venue</div>
            </div>
            {data ? (
              <div>
                {VenueId ? (
                  <div className="ml-7 text-wrap text-[16px] font-normal leading-6 text-[#666666]">
                    {formData?.streetAddress},{formData?.city_id?.label},
                    {formData?.postalCode}
                  </div>
                ) : (
                  <div className="pl-[30px] leading-6 font-normal">
                    Select a venue by clicking “View All” button
                  </div>
                )}
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
                    <DialogFooter>
                      <div className="w-full flex items-center justify-center -mt-10">
                        <DialogClose>
                          <Button type="submit">Submit</Button>
                        </DialogClose>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="px-[30px] leading-6 font-normal">
                No existing venue found
              </div>
            )}
          </Label>
        </div>
        {formData?.isNewVenueSelected ? (
          <Label htmlFor="new-venue">
            <div className="w-[494px] h-[118px] rounded-[16px] border border-[#7677F4] px-4 py-6">
              <div className=" flex flex-row justify-between">
                <div className="text-[16px] font-semibold text-[#7677F4] gap-3 flex flex-row">
                  <RadioGroupCircleItem
                    value="new-venue"
                    id="new-venue"
                    className="!bg-[#7677F4]"
                  />
                  <div>New Venue</div>
                </div>
                <div className="flex flex-row gap-3">
                  <Dialog>
                    <DialogTrigger>
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
                {formData?.streetAddress},{formData?.city_id?.label},
                {formData?.postalCode}
              </div>
            </div>
          </Label>
        ) : (
          <Dialog>
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
                  <Button
                    type="submit"
                    onClick={() => {
                      onChange(true);
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </RadioGroup>
    </div>
  );
};

const ExistingVenue = () => {
  const [searchValue, searchOnChange] = useState<string>("");

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [otherVenueSkip, setOtherVenueSkip] = useState<number>(0);

  const [venueData, setVenueData] = useState<any[]>([]);

  const { mutate } = useDelete();

  const deleteVenue = (id: any) => {
    mutate({
      resource: "venue",
      id: id,
    });
  };

  const {
    field: { value: stateValue },
  } = useController({
    name: "state_id",
  });

  const {
    field: { value: venue },
  } = useController({
    name: "venue",
  });

  const {
    field: { value: streetAddress },
  } = useController({
    name: "streetAddress",
  });

  const {
    field: { value: postalCode },
  } = useController({
    name: "postalCode",
  });

  const {
    field: { value: center },
  } = useController({
    name: "center",
  });

  const {
    field: { value: cityValue },
  } = useController({
    name: "city_id",
  });

  const {
    field: { value: coordinates, onChange: setCoordinates },
  }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
    useController({
      name: "address_line_coordinates",
    });

  const { setValue, watch } = useFormContext();

  const formData = watch();

  console.log(formData, "formData");

  const {
    field: { onChange },
  } = useController({
    name: "isNewVenue",
  });

  const fetchLoginUserVenue = async () => {
    const { data, error } = await supabaseClient
      .from("venue_view_with_names")
      .select("city_id!inner(id,name),state_id!inner(id,name),")
      .eq("created_by_user_id", "1")
      .or(
        `name.ilike."%${debouncedSearchValue}%",state_name.ilike.%${debouncedSearchValue}%,city_name.ilike."%${debouncedSearchValue}%",center_name.ilike."%${debouncedSearchValue}%"`
      );

    return data;
  };

  const fetchOtherVenues = async () => {
    const { data } = await supabaseClient
      .from("venue_view_with_names")
      .select("*,city_id!inner(id,name),state_id!inner(id,name)")
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

  //fetching other venue data after scrolling
  useEffect(() => {
    const fetchOtherVenueDataAfterScroll = async () => {
      const otherVenueData = ((await fetchOtherVenues()) as any[]) ?? [];
      setVenueData([...venueData, ...otherVenueData]);
    };
    fetchOtherVenueDataAfterScroll();
  }, [otherVenueSkip]);

  const onBottomReached = () => {
    if (venueData && venueData?.length >= 6)
      setOtherVenueSkip((previousLimit: number) => previousLimit + 6);
  };

  const handleCheckboxChange = (item: any) => {
    setValue("venueId", item.id);
    setValue("city_id", {
      value: item?.city_id,
      label: item?.city_name,
    });
    setValue("state_id", {
      value: item?.state_id,
      label: item?.state_name,
    });
    setValue("postalCode", item?.postal_code);
    setValue("venue", item?.name);
    setValue("streetAddress", item?.address);
  };

  const { loginUserData } = loginUserStore();

  const user_roles: any[] = loginUserData?.userData?.user_roles;

  const hasNationalAdminRole =
    user_roles &&
    user_roles.some((role) => role.role_id.value === "National Admin");

  const hasSuperAdminRole =
    user_roles &&
    user_roles.some((role) => role.role_id.value === "Super Admin");

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
            className="flex flex-row flex-wrap gap-6 h-[344px] mt-6  overflow-auto overscroll-none"
            id={"options"}
          >
            {venueData?.map((item: any) => {
              return (
                <div className="flex flex-row w-[390px] h-[102px] rounded-4 items-start space-x-3 space-y-0 rounded-md border p-4">
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
                        {(hasNationalAdminRole ||
                          hasSuperAdminRole ||
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
                              <DialogFooter>
                                <div className="w-full flex items-center justify-center">
                                  <Button type="submit">Submit</Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {hasNationalAdminRole && (
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
          </div>
        </GetScrollTypesAlert>
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
          <VenueComponent />
          <PostalCodeComponent />
          <CityComponent />
        </div>

        <div className="flex flex-col gap-5">
          <StreetAddressComponent />
          <StateComponent />
          <CenterComponent />
        </div>
      </div>
    </div>
  );
};

const MapComponent = () => {
  const {
    field: { value: stateValue },
  } = useController({
    name: "state_id",
  });

  const {
    field: { value: cityValue },
  } = useController({
    name: "city_id",
  });

  const {
    field: { value: coordinates, onChange: setCoordinates },
  }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
    useController({
      name: "address_line_coordinates",
    });

  useEffect(() => {
    loadInitialCoordinates();
  }, [stateValue, cityValue]);

  const { watch } = useFormContext();

  const formData = watch();

  const loadInitialCoordinates = async () => {
    let LocationData: any;
    if (formData?.city_id && formData?.state_id) {
      LocationData = await fetchLongitudeLatitudeData(
        `${formData?.city_id?.label},${formData?.state_id?.label}`
      );
    }

    if (LocationData?.length > 0) {
      setCoordinates({ lat: LocationData?.[0]?.y, lng: LocationData?.[0]?.x });
    }
  };

  return (
    <div className=" flex w-[586px] h-[160px] rounded-[16px] border border-[#999999] my-5 text-center items-center justify-center">
      <ViewMap
        value={coordinates}
        onChange={setCoordinates}
        draggable={true}
        //If coordinates are [0,0] then display whole map
        zoom={_.isEqual(coordinates, { lat: 0, lng: 0 }) ? 1 : 15}
      />
    </div>
  );
};
const VenueComponent = () => {
  const {
    field: { value: venueName, onChange: venueOnchange },
    fieldState: { error: venueError },
  } = useController({
    name: "venue",
  });
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Venue <div className="text-[#7677F4]"> *</div>
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={venueName}
          placeholder="Enter Venue Name"
          className="placeholder:text-[#999999]"
          onChange={venueOnchange}
        />
      </div>
    </div>
  );
};

const PostalCodeComponent = () => {
  const {
    field: { value: postalCodeValue, onChange: postalCodeOnchange },
  } = useController({
    name: "postalCode",
  });
  const { setValue } = useFormContext();

  const fetchCityStateData = async () => {
    if (postalCodeValue?.length > 4) {
      const { data: prefillData } = await supabaseClient
        .from("city")
        .select("*,state_id(id,name)")
        .eq("postal_code", postalCodeValue);

      const transformed = {
        label: prefillData?.[0]?.name,
        value: prefillData?.[0]?.id,
      };

      const transformedState = {
        label: prefillData?.[0]?.state_id?.name,
        value: prefillData?.[0]?.state_id?.id,
      };

      setValue("city_id", transformed);
      setValue("state_id", transformedState);
    }
  };
  useEffect(() => {
    fetchCityStateData();
  }, [postalCodeValue]);
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Postal Code</div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={postalCodeValue}
          placeholder="Enter Postal Code"
          className="placeholder:text-[#999999]"
          onChange={postalCodeOnchange}
          required
        />
      </div>
    </div>
  );
};

const StreetAddressComponent = () => {
  const {
    field: { value: streetAddressValue, onChange: streetAddressOnchange },
  } = useController({
    name: "streetAddress",
  });
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Street Address</div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={streetAddressValue}
          placeholder="Enter Street Address"
          className="placeholder:text-[#999999]"
          onChange={streetAddressOnchange}
        />
      </div>
    </div>
  );
};

const CityComponent = () => {
  const { watch } = useFormContext();

  const formData = watch();

  console.log(formData, "formData");

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const {
    field: { value: cityValue, onChange: cityValueOnchange },
    fieldState: { error: cityValueError },
  } = useController({
    name: "city_id",
  });

  let filter: Array<CrudFilter> = [];

  if (formData?.state_id?.value) {
    filter.push({
      field: "state_id",
      operator: "eq",
      value: formData?.state_id?.value,
    });
  }
  const { options, onSearch, queryResult } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    filters: filter,
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
  }, [options, currentPage]);

  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };
  return (
    <div className="flex gap-1 flex-col h-[60px] w-[278px]">
      <div className="text-xs font-normal text-[#333333]">City</div>

      <CustomSelect
        value={cityValue}
        placeholder="Select City"
        data={selectOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={cityValueOnchange}
        error={cityValueError}
      />
    </div>
  );
};

const StateComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const {
    options: stateOptions,
    onSearch: stateOnsearch,
    queryResult,
  } = useSelect({
    resource: "state",
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
  const {
    field: { value: stateValue, onChange: stateValueOnchange },
  } = useController({
    name: "state_id",
  });

  useEffect(() => {
    if (stateOptions) {
      if (currentPage > 1)
        setSelectOptions([...selectOptions, ...stateOptions]);
      else setSelectOptions(stateOptions);
    }
  }, [stateOptions, currentPage]);

  const handleOnBottomReached = () => {
    if (
      stateOptions &&
      (queryResult?.data?.total as number) >= currentPage * 10
    )
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  return (
    <div className="flex gap-1 flex-col h-[60px] w-[278px]">
      <div className="text-xs font-normal text-[#333333]">Province</div>

      <CustomSelect
        value={stateValue}
        placeholder="Select Province"
        data={selectOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          stateOnsearch(val);
        }}
        onChange={stateValueOnchange}
      />
    </div>
  );
};

const CenterComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const {
    field: { value: centerValue, onChange: centerValueOnchange },
  } = useController({
    name: "center",
  });
  const { watch } = useFormContext();

  const formData = watch();
  let filter: Array<CrudFilter> = [];
  if (formData?.state_id?.value && formData?.city_id?.value) {
    filter.push(
      {
        field: "state_id",
        operator: "eq",
        value: formData?.state_id?.value,
      },
      {
        field: "city_id",
        operator: "eq",
        value: formData?.city_id?.value,
      }
    );
  } else if (formData?.state_id?.value) {
    filter.push({
      field: "state_id",
      operator: "eq",
      value: formData?.state_id?.value,
    });
  }

  const {
    options: centerOptions,
    onSearch: centerOnsearch,
    queryResult,
  } = useSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
    filters: filter,
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
    if (centerOptions) {
      if (currentPage > 1)
        setSelectOptions([...selectOptions, ...centerOptions]);
      else setSelectOptions(centerOptions);
    }
  }, [centerOptions, currentPage]);

  const handleOnBottomReached = () => {
    if (
      centerOptions &&
      (queryResult?.data?.total as number) >= currentPage * 10
    )
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };
  return (
    <div className="flex gap-1 flex-col h-[60px] w-[278px]">
      <div className="text-xs font-normal text-[#333333]">Local Center</div>

      <CustomSelect
        value={centerValue}
        placeholder="Select Local center"
        data={selectOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          centerOnsearch(val);
        }}
        onChange={centerValueOnchange}
      />
    </div>
  );
};
