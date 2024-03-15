import { ViewMap, fetchLongitudeLatitudeData } from "@components/ViewMap";
import Delete from "@public/assets/Delete";
import EditIcon from "@public/assets/EditIcon";
import SearchIcon from "@public/assets/SearchIcon";
import {
  useDelete,
  useForm,
  useList,
  useOne,
  useSelect,
} from "@refinedev/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
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

function NewCourseStep3() {
  const { data, isError } = useList({
    resource: "venue",
  });

  console.log(isError, "isError");
  console.log(data, "data");

  const { mutate } = useDelete();

  const deleteVenue = (id: any) => {
    mutate({
      resource: "venue",
      id: id,
    });
  };

  return (
    <div className="flex flex-row gap-7">
      <div className="rounded-[16px] w-[494px] h-[118px] border  border-[#999999] relative">
        <Dialog>
          <DialogTrigger>
            <Badge
              variant="outline"
              className="absolute left-48 -bottom-3 bg-[white] w-[93px] h-[34px] items-center justify-center text-[#7677F4] border border-[#7677F4]"
            >
              View All
            </Badge>
          </DialogTrigger>
          <DialogContent className="w-[858px] h-[585px] rounded-[24px] !py-6 !pl-6 !pr-4">
            <div className="flex justify-center text-[24px] font-semibold">
              Existing Venues
            </div>
            <div className="relative w-[390px] h-[40px] flex justify-end items-center mx-auto">
              <Input
                placeholder="Search by Venue Name, City or state"
                className="border border-gray-400 rounded-lg pl-10"
              />
              <div className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground">
                <SearchIcon />
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-6 h-[354px]  overflow-auto overscroll-none">
              {data?.data?.map((item: any) => {
                return (
                  <div className="flex flex-row w-[390px] h-[102px] rounded-4 items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox id={item.name} value={item.name} />

                    <div className="space-y-1 leading-none">
                      <div className="flex justify-between">
                        <div className="font-semibold">{item.name}</div>
                        <div className="flex flex-row gap-3">
                          <Dialog>
                            <DialogTrigger>
                              <EditIcon />
                            </DialogTrigger>
                            <DialogContent className="!w-[636px] !h-[647px] pt-6 px-[25px] rounded-6">
                              <AddOrEditVenue isNewVenue={false} />
                              {/* <DialogFooter>
                                <div className="w-full flex items-center justify-center">
                                  <DialogClose>
                                    <Button type="submit">Submit</Button>
                                  </DialogClose>
                                </div>
                              </DialogFooter> */}
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
                                    onClick={() => deleteVenue(item.id)}
                                  >
                                    Yes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
            <DialogFooter>
              <div className="w-full flex items-center justify-center">
                <DialogClose>
                  <Button type="submit">Submit</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog>
        <DialogTrigger>
          <div className="w-[494px] h-[118px] rounded-[16px] border flex items-center justify-center text-[#7677F4]">
            + Add New Venue
          </div>
        </DialogTrigger>

        <DialogContent className="!w-[636px] !h-[647px] pt-6 px-[25px] rounded-6">
          <AddOrEditVenue isNewVenue={true} />
          <DialogFooter>
            <div className="w-full flex items-center justify-center">
              <DialogClose>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewCourseStep3;

interface AddOrEditVenueProps {
  isNewVenue: boolean;
}

export const AddOrEditVenue: React.FC<AddOrEditVenueProps> = ({
  isNewVenue,
}) => {
  const {
    field: { value: coordinates, onChange: setCoordinates },
  }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
    useController({
      name: "address_line_coordinates",
    });

  const {
    field: { value: venueName, onChange: venueOnchange },
  } = useController({
    name: "venue",
  });

  const {
    field: { value: postalCodeValue, onChange: postalCodeOnchange },
  } = useController({
    name: "postalCode",
  });

  const {
    field: { value: cityValue, onChange: cityValueOnchange },
  } = useController({
    name: "city_id",
  });

  const {
    field: { value: stateValue, onChange: stateValueOnchange },
  } = useController({
    name: "state_id",
  });

  const {
    field: { value: centerValue, onChange: centerValueOnchange },
  } = useController({
    name: "center",
  });

  const {
    field: { value: streetAddressValue, onChange: streetAddressOnchange },
  } = useController({
    name: "streetAddress",
  });

  const { options: stateOptions, onSearch: stateOnsearch } = useSelect({
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
  });

  const { options: centerOptions, onSearch: centerOnsearch } = useSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  const { watch, setValue } = useFormContext();

  const formData = watch();

  console.log(formData, "formData");

  useEffect(() => {
    loadInitialCoordinates();
  }, [stateValue, cityValue]);

  const loadInitialCoordinates = async () => {
    let LocationData = await fetchLongitudeLatitudeData(
      formData?.state?.label ? formData?.state?.label : "westbengal,kolkata"
    );

    console.log(LocationData, "LocationData");

    if (LocationData?.length > 0) {
      setCoordinates({ lat: LocationData?.[0]?.y, lng: LocationData?.[0]?.x });
    }
  };

  const { data: prefillData } = useList({
    resource: "city",
    meta: {
      select: "*,state_id!inner(id,name)",
    },
    filters: [
      {
        field: "postal_code",
        operator: "eq",
        value: postalCodeValue,
      },
    ],
  });

  console.log(prefillData, "prefillData");

  const transformed = {
    label: prefillData?.data[0]?.name,
    value: prefillData?.data[0]?.id,
  };
  const transformedState = {
    label: prefillData?.data[0]?.state_id?.name,
    value: prefillData?.data[0]?.state_id?.id,
  };
  const { options, onSearch } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  console.log(transformed, "transformed");

  useEffect(() => {
    setValue("city_id", transformed);
    setValue("state_id", transformedState);
  }, [prefillData]);

  return (
    <div>
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
        <div className=" flex w-[586px] h-[160px] rounded-[16px] border border-[#999999] my-5 text-center items-center justify-center">
          <ViewMap
            value={coordinates}
            onChange={setCoordinates}
            draggable={true}
            //If coordinates are [0,0] then display whole map
            zoom={_.isEqual(coordinates, { lat: 0, lng: 0 }) ? 1 : 15}
          />
        </div>
        <div className="flex flex-row gap-[30px]">
          <div className="flex flex-col gap-5">
            <div className="flex gap-1 flex-col">
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
            <div className="flex gap-1 flex-col ">
              <div className="text-xs font-normal text-[#333333]">
                Postal Code
              </div>
              <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
                <Input
                  value={postalCodeValue}
                  placeholder="Enter Postal Code"
                  className="placeholder:text-[#999999]"
                  onChange={postalCodeOnchange}
                />
              </div>
            </div>
            <div className="flex gap-1 flex-col  w-[278px]">
              <div className="text-xs font-normal text-[#333333]">City</div>

              <CustomSelect
                value={cityValue}
                placeholder="Select City"
                data={options}
                onBottomReached={() => {}}
                onSearch={(val: string) => {
                  onSearch(val);
                }}
                onChange={cityValueOnchange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-1 flex-col ">
              <div className="text-xs font-normal text-[#333333]">
                Street Address
              </div>
              <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
                <Input
                  value={streetAddressValue}
                  placeholder="Enter Street Address"
                  className="placeholder:text-[#999999]"
                  onChange={streetAddressOnchange}
                />
              </div>
            </div>
            <div className="flex gap-1 flex-col w-[278px]">
              <div className="text-xs font-normal text-[#333333]">Province</div>

              <CustomSelect
                value={stateValue}
                placeholder="Select Province"
                data={stateOptions}
                onBottomReached={() => {}}
                onSearch={(val: string) => {
                  stateOnsearch(val);
                }}
                onChange={stateValueOnchange}
              />
            </div>
            <div className="flex gap-1 flex-col w-[278px]">
              <div className="text-xs font-normal text-[#333333]">
                Local Center
              </div>

              <CustomSelect
                value={centerValue}
                placeholder="Select Local center"
                data={centerOptions}
                onBottomReached={() => {}}
                onSearch={(val: string) => {
                  centerOnsearch(val);
                }}
                onChange={centerValueOnchange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
