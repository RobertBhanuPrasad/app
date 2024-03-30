"use client";
import CopyIcon from "@public/assets/copyIcon";
import { useOne } from "@refinedev/core";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";

function CourseDetailsTab() {
  const Id = 10;
  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,venue(*,center_id!inner(id ,name),city_id!inner(id ,name),state_id!inner(id ,name)),program_contact_details(*)      ",
    },
  });

  const handleCopyText = () => {
    const copyLinkElement = document.getElementById("textToCopy");
    if (copyLinkElement) {
      const copyLink = copyLinkElement.innerText;
      navigator.clipboard.writeText(copyLink);
    }
  };

  console.log(courseData, "data");
  console.log(courseData?.data?.program_contact_details, "data");

  return (
    <div className="flex flex-row gap-[41px] mt-[30px]">
      <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-md">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold">
            Basic Details
          </CardTitle>
          <hr></hr>
        </CardHeader>
        <CardContent className="gap-[23px] flex flex-col">
          <div className="text-[#999999] text-[14px] font-normal">
            Organization
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Course ID
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Course type
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Course Accounting Status{" "}
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Teachers{" "}
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Assistant Teachers
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Available language(s) for translation{" "}
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Language(s) course is taught in{" "}
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Program Visibility{" "}
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Max Capacity{" "}
          </div>
          <div className="text-[#999999] text-[14px] font-normal">
            Program organizer{" "}
          </div>
        </CardContent>
      </Card>
      <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-md">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold">
            Fee and Accommodation
          </CardTitle>
          <hr></hr>
        </CardHeader>
        <CardContent className="gap-[23px] flex flex-col"></CardContent>
      </Card>
      <div className="flex flex-col gap-[30px]">
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-md">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Time and Venue
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <div className="text-[#999999] text-[14px] font-normal">
                Venue Address
              </div>
              <div>
                {courseData?.data?.venue?.address},
                {courseData?.data?.venue?.center_id?.name},
                {courseData?.data?.venue?.city_id?.name},
                {courseData?.data?.venue?.state_id?.name}
                {courseData?.data?.venue?.postal_code}
              </div>
            </div>
            <div className="text-[#999999] text-[14px] font-normal">
              Sessions
            </div>
          </CardContent>
        </Card>

        {/**
         * Registration Links card*/}

        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-md">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Registration Links
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <div className="text-[#999999] text-[14px] font-normal">
                Course Details URL
              </div>
              <div className="flex flex-row">
                <div id="textToCopy">{courseData?.data?.details_page_link}</div>
                <div
                  onClick={handleCopyText}
                  className="mt-[6px] cursor-pointer"
                >
                  <CopyIcon />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[#999999] text-[14px] font-normal">
                Registration URL
              </div>
              <div className="flex flex-row">
                <div className="">{courseData?.data?.registration_link}</div>
                <div
                  onClick={handleCopyText}
                  className="mt-[6px] cursor-pointer flex flex-[1]"
                >
                  <CopyIcon />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/**
         * Contact details card
         */}
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-md">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Contact Details
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            {courseData?.data?.program_contact_details?.map((item: any) => {
              return (
                <div className="gap-[23px] flex flex-col">
                  <div>
                    <div className="text-[#999999] text-[14px] font-normal">
                      Contact Name
                    </div>
                    <div className="text-[16px] font-semibold ">
                      {item.contact_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#999999] text-[14px] font-normal">
                      Contact Email
                    </div>
                    <div className="text-[16px] font-semibold ">
                      {item.contact_email}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#999999] text-[14px] font-normal">
                      Contact Phone
                    </div>
                    <div className="text-[16px] font-semibold ">
                      {item.contact_number}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseDetailsTab;
