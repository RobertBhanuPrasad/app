"use client";
import CopyIcon from "@public/assets/CopyIcon";
import { useList, useOne } from "@refinedev/core";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { formatDateTime } from "src/utility/DateFunctions";

export const SubHeading = ({ children }: any) => {
  return (
    <div className="text-[#999999] text-[14px] font-normal">{children}</div>
  );
};

export const ItemValue = ({ children }: any) => {
  return <div className="text-base font-semibold">{children}</div>;
};

function CourseDetailsTab() {
  const Id = 10;
  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,organization_id(id,name),program_fee_settings_id(program_fee_level_settings!inner(*,fee_level_id(value))),program_fee_level_settings(*,fee_level_id(value)),program_details_info(max_capacity,visibility_id(value)),program_organizers(user_id(contact_id(full_name))),program_translation_languages(language_id(id,language_name)),program_languages(language_id(id,language_name)),program_schedules(*),venue(*,center_id!inner(id ,name),city_id!inner(id ,name),state_id!inner(id ,name)),program_contact_details(*),program_accommodations!inner(*,accommodation_type_id(id,name)),program_type_id!inner(id,name),program_assistant_teachers!inner(*,user_id(contact_id(id,full_name))),program_teachers!inner(*,user_id(contact_id(id,full_name)))",
    },
  });

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });

  const programFees = courseData?.data?.program_fee_settings_id
    ? courseData?.data?.program_fee_settings_id?.program_fee_level_settings
    : courseData?.data?.program_fee_level_settings;

  const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false);
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false);

  const copyText = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCopyDetailsPageLink = () => {
    copyText(courseData?.data?.details_page_link);
    setCopiedDetailsPageLink(true);

    setTimeout(() => {
      setCopiedDetailsPageLink(false);
    }, 1000);
  };

  const handleCopyRegistrationLink = () => {
    copyText(courseData?.data?.registration_link);
    setCopiedRegistrationLink(true);

    setTimeout(() => {
      setCopiedRegistrationLink(false);
    }, 1000);
  };

  return (
    <div className="flex flex-row gap-[41px] mt-[30px]">
      {/**
       * Basic details card
       */}
      <div>
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] ">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Basic Details
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <SubHeading>Organization</SubHeading>
              <ItemValue>{courseData?.data?.organization_id?.name}</ItemValue>
            </div>
            <div>
              <SubHeading>Course ID</SubHeading>
              <ItemValue>{courseData?.data?.program_code}</ItemValue>
            </div>
            <div>
              <SubHeading>Course type</SubHeading>
              <ItemValue>{courseData?.data?.program_type_id?.name}</ItemValue>
            </div>
            <SubHeading>Course Accounting Status</SubHeading>
            <div>
              <SubHeading>Teachers</SubHeading>
              <ItemValue>
                {courseData?.data?.program_teachers?.map((item: any) => {
                  return item?.user_id?.contact_id?.full_name;
                })}
              </ItemValue>
            </div>
            <div>
              <SubHeading>Assistant Teachers</SubHeading>
              <ItemValue>
                {courseData?.data?.program_assistant_teachers?.map(
                  (item: any) => {
                    return item?.user_id?.contact_id?.full_name;
                  }
                )}
              </ItemValue>
            </div>
            <div>
              <SubHeading>Available language(s) for translation </SubHeading>
              <ItemValue>
                {courseData?.data?.program_translation_languages
                  .map((item: any) => item?.language_id?.language_name)
                  .join(", ")}
              </ItemValue>
            </div>
            <div>
              <SubHeading>Language(s) course is taught in </SubHeading>
              <ItemValue>
                {courseData?.data?.program_languages
                  .map((item: any) => item?.language_id?.language_name)
                  .join(", ")}
              </ItemValue>
            </div>
            <div>
              <SubHeading>Program Visibility</SubHeading>
              <ItemValue>
                {
                  courseData?.data?.program_details_info?.[0]?.visibility_id
                    ?.value
                }
              </ItemValue>
            </div>
            <div>
              <SubHeading>Max Capacity</SubHeading>
              <ItemValue>
                {courseData?.data?.program_details_info?.[0]?.max_capacity}
              </ItemValue>
            </div>
            <div>
              <SubHeading>Program organizer</SubHeading>
              <ItemValue>
                {courseData?.data?.program_organizers
                  .map((item: any) => item?.user_id?.contact_id?.full_name)
                  .join(", ")}
              </ItemValue>
            </div>
          </CardContent>
        </Card>
      </div>

      {/**
       * Fee and accommodation card
       */}
      <div>
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Fee and Accommodation
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            {programFees?.map((item: any) => {
              return (
                <div className="flex flex-col gap-1">
                  <SubHeading>{item?.fee_level_id?.value}</SubHeading>
                  <ItemValue>
                    {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                    {item?.total}
                  </ItemValue>
                </div>
              );
            })}
            {courseData?.data?.program_accommodations?.map((item: any) => {
              return (
                <div className="flex flex-col gap-1">
                  <SubHeading>{item?.accommodation_type_id?.name}</SubHeading>
                  <ItemValue>
                    {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                    {item?.fee_per_person}
                  </ItemValue>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-[30px]">
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Time and Venue
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <SubHeading>Venue Address</SubHeading>
              <ItemValue>
                {courseData?.data?.venue?.address},
                {courseData?.data?.venue?.center_id?.name},
                {courseData?.data?.venue?.city_id?.name},
                {courseData?.data?.venue?.state_id?.name}{" "}
                {courseData?.data?.venue?.postal_code}
              </ItemValue>
            </div>
            <SubHeading>
              Sessions
              <div className="text-[16px] font-semibold text-[#666666] gap-1">
                {courseData?.data?.program_schedules?.map(
                  (item: any, index: number) => (
                    <div key={index}>
                      <div className="flex flex-col">
                        <div>
                          {formatDateTime(item?.start_time, item?.end_time)}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </SubHeading>
          </CardContent>
        </Card>

        {/**
         * Registration Links card*/}

        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Registration Links
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div className="gap-[23px] flex flex-col">
              <div>
                <SubHeading>Course Details URL</SubHeading>
                <ItemValue>
                  <div className="flex flex-row gap-4">
                    <div className="w-[90%] break-words">
                      {courseData?.data?.details_page_link}
                    </div>
                    <div
                      onClick={() => {
                        handleCopyDetailsPageLink();
                      }}
                      className="relative mt-1"
                    >
                      <CopyIcon />
                      {copiedDetailsPageLink ? (
                        <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                          copied
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </ItemValue>
              </div>
              <div>
                <SubHeading>Registration URL</SubHeading>
                <div className="flex flex-row gap-4 ">
                  <div className="text-[16px] font-semibold w-[90%] break-words">
                    {courseData?.data?.registration_link}
                  </div>
                  <div
                    onClick={() => {
                      handleCopyRegistrationLink();
                    }}
                    className="relative mt-1"
                  >
                    <CopyIcon />
                    {copiedRegistrationLink ? (
                      <div className="absolute -left-8 bottom-12 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                        copied
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/**
         * Contact details card
         */}
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
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
                    <SubHeading>Contact Name</SubHeading>
                    <ItemValue>{item.contact_name}</ItemValue>
                  </div>
                  <div>
                    <SubHeading>Contact Email</SubHeading>
                    <ItemValue>{item.contact_email}</ItemValue>
                  </div>
                  <div>
                    <SubHeading>Contact Phone</SubHeading>
                    <ItemValue>{item.contact_number}</ItemValue>
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
