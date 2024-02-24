import Car from "@public/assets/Car";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";

function index() {
  const [selectedValue, setSelectedValue] = useState();

  const triggerColor =
    "!h-12 items-center !shadow-none gap-2 data-[state=active]:bg-gradient-to-r from-[#7677F41A] to-transparent ";

  const contentStylings =
    "inline-flex !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background  data-[state=active]:shadow-sm";
  return (
    <div className="mt-4">
      <div>
        <Tabs
          defaultValue="account"
          onValueChange={(value: any) => {
            console.log(value, "value");
            setSelectedValue(value);
          }}
        >
          <div className="flex flex-row">
            <TabsList className="h-[513px] bg-[#7677F41A]  mb-10 pt-10">
              <div className="flex flex-col mr-6 h-full gap-6">
                <TabsTrigger value="basic-details" className={triggerColor}>
                  {selectedValue === "basic-details" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Profile
                    color={` ${
                      selectedValue === "basic-details" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Basic Details
                </TabsTrigger>
                <TabsTrigger value="course-details" className={triggerColor}>
                  {selectedValue === "course-details" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Group
                    color={` ${
                      selectedValue === "course-details" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Course Details
                </TabsTrigger>
                <TabsTrigger value="time-venue" className={triggerColor}>
                  {selectedValue === "time-venue" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Venue
                    color={` ${
                      selectedValue === "time-venue" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Time and Venue
                </TabsTrigger>
                <TabsTrigger
                  value="accommodation-fees"
                  className={triggerColor}
                >
                  {selectedValue === "accommodation-fees" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Car
                    color={` ${
                      selectedValue === "accommodation-fees"
                        ? "#7677F4"
                        : "#999999"
                    }`}
                  />
                  Accommodation
                </TabsTrigger>
                <TabsTrigger value="contact-info" className={triggerColor}>
                  {selectedValue === "contact-info" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Info
                    color={` ${
                      selectedValue === "contact-info" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Contact Info
                </TabsTrigger>
              </div>
            </TabsList>
            <div className="bg-[white] w-full rounded-[24px] -ml-2 -mt-1 p-4 shadow-md h-[517px]">
              <TabsContent
                value="basic-details"
                className={contentStylings}
              ></TabsContent>
              <TabsContent
                value="course-details"
                className={contentStylings}
              ></TabsContent>
              <TabsContent value="time-venue" className={contentStylings}>
                Change your password here.
              </TabsContent>
              <TabsContent
                value="accommodation-fees"
                className={contentStylings}
              >
                Change your accommodation details
              </TabsContent>
              <TabsContent value="contact-info" className={contentStylings}>
                Change your contact info
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default index;
