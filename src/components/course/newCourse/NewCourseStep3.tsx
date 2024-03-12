import { ViewMap } from "@components/ViewMap";
import Delete from "@public/assets/Delete";
import EditIcon from "@public/assets/EditIcon";
import SearchIcon from "@public/assets/SearchIcon";
import _ from "lodash";
import React from "react";
import { useController } from "react-hook-form";
import { Badge } from "src/ui/badge";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import CustomSelect from "src/ui/custom-select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/ui/dialog";
import { Input } from "src/ui/input";

function NewCourseStep3() {
  const VenueNames = [
    "Iceland",
    "Greece",
    "Serbia",
    "Israel",
    "Sao Tome and Principe",
    "Israel",
    "Saudi Arabia",
    "Israel",
    "Sao Tome and Principe",
    "Israel",
    "Saudi Arabia",
  ];
  const {
    field: { value: coordinates, onChange: setCoordinates },
  }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
    useController({
      name: "address_line_coordinates",
    });
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
              {VenueNames.map((item: any) => {
                return (
                  <div className="flex flex-row w-[390px] h-[102px] rounded-4 items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox />

                    <div className="space-y-1 leading-none">
                      <div className="flex justify-between">
                        <div>{item}</div>
                        <div className="flex flex-row gap-3">
                          <EditIcon />
                          <Delete />
                        </div>
                      </div>

                      <div>
                        You can manage your mobile notifications in the page.
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <div className="w-full flex items-center justify-center">
                <Button type="submit">Submit</Button>
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
          <div>
            <div className="flex justify-center text-[24px] font-semibold">
              New Venue
            </div>
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
                      placeholder="Enter URL"
                      className="placeholder:text-[#999999]"
                    />
                  </div>
                </div>
                <div className="flex gap-1 flex-col ">
                  <div className="text-xs font-normal text-[#333333]">
                    Postal Code
                  </div>
                  <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
                    <Input
                      placeholder="Enter URL"
                      className="placeholder:text-[#999999]"
                    />
                  </div>
                </div>
                <div className="flex gap-1 flex-col  w-[278px]">
                  <div className="text-xs font-normal text-[#333333]">
                    Organization *
                  </div>

                  <CustomSelect
                    value="bhb"
                    placeholder="Select Organization"
                    data={[]}
                    onBottomReached={() => {}}
                    onSearch={() => {}}
                    onChange={() => {}}
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
                      placeholder="Enter URL"
                      className="placeholder:text-[#999999]"
                    />
                  </div>
                </div>
                <div className="flex gap-1 flex-col w-[278px]">
                  <div className="text-xs font-normal text-[#333333]">
                    Organization *
                  </div>

                  <CustomSelect
                    value="hj"
                    placeholder="Select Organization"
                    data={[]}
                    onBottomReached={() => {}}
                    onSearch={() => {}}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex gap-1 flex-col w-[278px]">
                  <div className="text-xs font-normal text-[#333333]">
                    Organization *
                  </div>

                  <CustomSelect
                    value="gh"
                    placeholder="Select Organization"
                    data={[]}
                    onBottomReached={() => {}}
                    onSearch={() => {}}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-center">
              <Button type="submit">Submit</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* </div> */}
    </div>
  );
}

export default NewCourseStep3;
