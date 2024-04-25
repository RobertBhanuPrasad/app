"use client";
import CopyIcon from "@public/assets/CopyIcon";
import { useList, useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Header2, ItemValue } from "src/commonComponents";
import { VISIBILITY } from "src/constants/OptionLabels";
import { PUBLIC } from "src/constants/OptionValueOrder";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { formatDateTime } from "src/utility/DateFunctions";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { useTranslation } from 'next-i18next';
interface fullNameObject {
  user_id?: {
    contact_id?: {
      full_name?: string;
    };
  };
}

interface LanguageItem {
  language_id?: {
    language_name?: string;
  };
}

interface ProgramFeeItem {
  fee_level_id?: {
    value?: string;
  };
  total?: number;
}

interface AccommodationItem {
  accommodation_type_id?: {
    name?: string;
  };
  fee_per_person?: number;
}

interface ContactDetailsItem {
  contact_name?: string;
  contact_email?: string;
  contact_number?: string;
}

interface ProgramScheduleItem {
  start_time: string;
  end_time: string;
}

function CourseDetailsTab() {
  const router = useRouter();

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,program_accommodations(*,accommodation_type_id(id,name)),program_schedules(*),venue_id(*,center_id(id ,name),city_id(id ,name),state_id(id ,name)),program_contact_details(*),program_organizers(user_id(contact_id(full_name))),program_translation_languages(language_id(id,language_name)),program_languages(language_id(id,language_name)),program_assistant_teachers(*,user_id(contact_id(id,full_name))),program_teachers(*,user_id(contact_id(id,full_name))),program_accounting_status_id(id,value),program_type_id(id,name),organization_id(id,name),program_fee_settings_id(program_fee_level_settings(*,fee_level_id(value))),program_fee_level_settings(*,fee_level_id(value)),max_capacity,visibility_id(id,value)",
    },
  });

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });

  // If the course fee is editable then we can use custom fees otherwise we can use default fees
  const programFees = courseData?.data?.program_fee_settings_id
    ? courseData?.data?.program_fee_settings_id?.program_fee_level_settings
    : courseData?.data?.program_fee_level_settings;

  const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false);
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false);

  const copyText = async (text: string) => {
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


 // getting public visibility id to check whether the particular course is public or private.
  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;

 // getting public visibility id to check whether the particular course is public or private.
  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;

  return (
    <div className="flex flex-row gap-[41px] mt-[30px]">
      {/**
       * Basic details card
       */}
      <div>
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] ">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
            {t('basic_details')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <Header2>{t('organization')}</Header2>
              <ItemValue>{courseData?.data?.organization_id?.name}</ItemValue>
            </div>
            <div>
              <Header2>Course ID</Header2>
              <ItemValue>{courseData?.data?.program_code ? courseData?.data?.program_code : '-'}</ItemValue>
            </div>
            <div>
              <Header2>Course type</Header2>
              <ItemValue>{courseData?.data?.program_type_id?.name ? courseData?.data?.program_type_id?.name : '-'}</ItemValue>
            </div>
            <div>
              <Header2>{t('course_accounting_status')}</Header2>
              <ItemValue>
                {courseData?.data?.program_accounting_status_id?.value ? courseData?.data?.program_accounting_status_id?.value : '-'}
              </ItemValue>
            </div>
            <div>
              <Header2> {t('teacher')}</Header2>
              <ItemValue>
              {courseData?.data?.program_teachers?.length > 0
              ? courseData?.data?.program_teachers.map((item: fullNameObject) => {
               return item?.user_id?.contact_id?.full_name;
              }).join(", ")
              : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>Assistant Teachers</Header2>
              <ItemValue>
                {courseData?.data?.program_assistant_teachers?.length > 0
                ? courseData?.data?.program_assistant_teachers?.map((item: fullNameObject) => {
                  return item?.user_id?.contact_id?.full_name;
                  }).join(',')
               : '-' }
              </ItemValue>
            </div>
            <div>
              <Header2> {t('available_languages_for_translation')} </Header2>
              <ItemValue>
                {courseData?.data?.program_translation_languages?.length > 0
                 ? courseData?.data?.program_translation_languages?.map((item: LanguageItem) => {
                  return item?.language_id?.language_name
                 }).join(", ") 
                 : '-'}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('language_course_is_taught_in')}</Header2>
              <ItemValue>
                {courseData?.data?.program_languages?.length > 0
                ? courseData?.data?.program_languages?.map(
                    (item: LanguageItem) => {
                      return item?.language_id?.language_name
                    }).join(", ")
                 : '-'}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('program_visibility')}</Header2>
              <ItemValue>{courseData?.data?.visibility_id?.value}</ItemValue>
            </div>
            <div>
              <Header2>{t('max_capacity')}</Header2>
              <ItemValue>{courseData?.data?.max_capacity}</ItemValue>
            </div>
            <div>
              <Header2>Program organizer</Header2>
              <ItemValue>
                {courseData?.data?.program_organizers?.length > 0
                 ? courseData?.data?.program_organizers?.map((item: fullNameObject) => {
                     return  item?.user_id?.contact_id?.full_name
                    }).join(", ") 
                 : '-'}
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
            {programFees?.length > 0 
            ? programFees?.map((item: ProgramFeeItem) => {
              return (
                <div className="flex flex-col gap-1">
                  <Header2>{item?.fee_level_id?.value}</Header2>
                  <ItemValue>
                    {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                    {item?.total}
                  </ItemValue>
                </div>
              );
            }) 
            : '-'}
            {courseData?.data?.program_accommodations?.length > 0 
            ? courseData?.data?.program_accommodations?.map(
              (item: AccommodationItem) => {
                return (
                  <div className="flex flex-col gap-1">
                    <Header2>{item?.accommodation_type_id?.name}</Header2>
                    <ItemValue>
                      {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                      {item?.fee_per_person}
                    </ItemValue>
                  </div>
                );
              }) 
              : '-'}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-[30px]">
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              {t('time_and_venue')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <Header2>{t('venue_address')}</Header2>
              <ItemValue>
                {courseData?.data?.venue_id?.address},
                {courseData?.data?.venue_id?.center_id?.name},
                {courseData?.data?.venue_id?.city_id?.name},
                {courseData?.data?.venue_id?.state_id?.name}{" "}
                {courseData?.data?.venue_id?.postal_code}
              </ItemValue>
              : '-'}
            </div>
            <Header2>
            {t('sessions')}
              <div className="text-[16px] font-semibold text-[#666666] gap-1">
                {courseData?.data?.program_schedules?.length > 0 ? courseData?.data?.program_schedules?.map(
                  (item: ProgramScheduleItem, index: number) => (
                    <div key={index}>
                      <div className="flex flex-col">
                        <div>
                          {formatDateTime(item?.start_time, item?.end_time)}
                        </div>
                      </div>
                    </div>
                  )
                ) : '-'}
              </div>
            </Header2>
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
              {courseData?.data?.visibility_id?.id == publicVisibilityId && 
              <div>
                <Header2>Course Details URL</Header2>
                <ItemValue>
                  <div className="flex flex-row gap-4">
                    <div className="w-[90%] break-words">
                      {courseData?.data?.details_page_link ? courseData?.data?.details_page_link : '-'}
                    </div>
                    {courseData?.data?.details_page_link && (
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
                    )}
                  </div>
                </ItemValue>
              </div>
              }  
              <div>
                <Header2>Registration URL</Header2>
                <div className="flex flex-row gap-4 ">
                  <div className="text-[16px] font-semibold w-[90%] break-words">
                    {courseData?.data?.registration_link ? courseData?.data?.registration_link : '-'}
                  </div>
                  {courseData?.data?.registration_link && (
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
                  )}
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
            {courseData?.data?.program_contact_details?.length > 0 ? courseData?.data?.program_contact_details?.map(
              (item: ContactDetailsItem) => {
                return (
                  <div className="gap-[23px] flex flex-col">
                    <div>
                      <Header2>Contact Name</Header2>
                      <ItemValue>{item.contact_name}</ItemValue>
                    </div>
                    <div>
                      <Header2>Contact Email</Header2>
                      <ItemValue>{item.contact_email}</ItemValue>
                    </div>
                    <div>
                      <Header2>Contact Phone</Header2>
                      <ItemValue>{item.contact_number}</ItemValue>
                    </div>
                  </div>
                );
              }
            ) : '-'}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseDetailsTab;
