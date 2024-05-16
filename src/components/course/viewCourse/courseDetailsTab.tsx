"use client";
import CopyIcon from "@public/assets/CopyIcon";
import { useList, useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { translatedText } from "src/common/translations";
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
  early_bird_total: object;
  custom_fee_label: object;
  is_custom_fee: boolean;
  fee_level_id?: {
    name?: object;
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
        "*,online_url,program_accommodations(*,accommodation_type_id(id,name)),program_schedules(*),venue_id(*,center_id(id ,name),city_id(id ,name),state_id(id ,name)),program_contact_details(*),program_organizers(user_id(contact_id(full_name))),program_translation_languages(language_id(id,language_name)),program_languages(language_id(id,language_name)),program_assistant_teachers(*,user_id(contact_id(id,full_name))),program_teachers(*,user_id(contact_id(id,full_name))),program_accounting_status_id(id,name),program_type_id(*),organization_id(id,name),program_fee_settings_id(is_early_bird_fee_enabled,program_fee_level_settings(*,fee_level_id(name))),program_fee_level_settings(*,fee_level_id(name)),max_capacity,visibility_id(id,name)",
    },
  });

  
  let venue=""

  if(courseData?.data?.venue_id?.name){
    venue=courseData?.data?.venue_id?.name+", "
  }

  if(courseData?.data?.venue_id?.address){
    venue=venue+courseData?.data?.venue_id?.address+", "

  }
  if(courseData?.data?.venue_id?.city_id?.name){
    venue=venue+courseData?.data?.venue_id?.city_id?.name+", "

  }
  if(courseData?.data?.venue_id?.state_id.name){
    venue=venue+courseData?.data?.venue_id?.state_id.name

  }
  if(courseData?.data?.venue_id?.postal_code){
    venue=venue+", "+courseData?.data?.venue_id?.postal_code

  }
  const { data: countryConfigData } = useList({
    resource: "country_config",
  });

  // If the course fee is editable then we can use custom fees otherwise we can use default fees
  const programFeeLevels = courseData?.data?.program_fee_settings_id
    ? courseData?.data?.program_fee_settings_id?.program_fee_level_settings
    : courseData?.data?.program_fee_level_settings;

  //Need to show only the fee level enabled by the user at the time of course creation.
  const programFees=programFeeLevels?.filter((feeLevel: { is_enable: boolean; })=>feeLevel.is_enable)
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
const IsEarlyBirdFeeEnable =courseData?.data?.program_fee_settings_id==null? courseData?.data?.is_early_bird_enabled : courseData?.data?.program_fee_settings_id?.is_early_bird_fee_enabled
  // getting public visibility id to check whether the particular course is public or private.
  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;
  const {t} = useTranslation(["common", "course.view_course", "new_strings"])
  return (
    <div className="flex flex-row gap-[41px] mt-[30px]">
      {/**
       * Basic details card
       */}
      <div>
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-[0px_4px_23.7px_rgba(139,139,139,0.25)] ">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
            {t('basic_details')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <Header2>{t('new_strings:organisation')}</Header2>
              <ItemValue>
                {courseData?.data?.organization_id?.name
                  ? courseData?.data?.organization_id?.name
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('course_id')}</Header2>
              <ItemValue>
                {courseData?.data?.program_code
                  ? courseData?.data?.program_code
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('new_strings:course_type')}</Header2>
              <ItemValue>
                {courseData?.data?.program_type_id?.name
                  ? translatedText(courseData?.data?.program_type_id?.name)
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('course_accounting_status')}</Header2>
              <ItemValue>
                {courseData?.data?.program_accounting_status_id?.name
                  ? translatedText(
                      courseData?.data?.program_accounting_status_id?.name
                    )
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('teachers')}</Header2>
              <ItemValue>
                {courseData?.data?.program_teachers?.length > 0
                  ? courseData?.data?.program_teachers
                      .map((item: fullNameObject) => {
                        return item?.user_id?.contact_id?.full_name;
                      })
                      .join(", ")
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('course.view_course:basic_details_tab.assistant_teachers')}</Header2>
              <ItemValue>
                {courseData?.data?.program_assistant_teachers?.length > 0
                  ? courseData?.data?.program_assistant_teachers
                      ?.map((item: fullNameObject) => {
                        return item?.user_id?.contact_id?.full_name;
                      }) 
                      .join(",")
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('available_languages_for_translation')}</Header2>
              <ItemValue>
                {courseData?.data?.program_translation_languages?.length > 0
                  ? courseData?.data?.program_translation_languages
                      ?.map((item: LanguageItem) => {
                        return item?.language_id?.language_name;
                      })
                      .join(", ")
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('language_course_is_taught_in')}</Header2>
              <ItemValue>
                {courseData?.data?.program_languages?.length > 0
                  ? courseData?.data?.program_languages
                      ?.map((item: LanguageItem) => {
                        return item?.language_id?.language_name;
                      })
                      .join(", ")
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('program_visibility')}</Header2>
              <ItemValue>
                {courseData?.data?.visibility_id?.name
                  ? translatedText(courseData?.data?.visibility_id?.name)
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('max_capacity')}</Header2>
              <ItemValue>
                {courseData?.data?.max_capacity
                  ? courseData?.data?.max_capacity
                  : "-"}
              </ItemValue>
            </div>
            <div>
              <Header2>{t('new_strings:program_organizer')}</Header2>
              <ItemValue>
                {courseData?.data?.program_organizers?.length > 0
                  ? courseData?.data?.program_organizers
                      ?.map((item: fullNameObject) => {
                        return item?.user_id?.contact_id?.full_name;
                      })
                      .join(", ")
                  : "-"}
              </ItemValue>
            </div>
          </CardContent>
        </Card>
      </div>

      {/**
       * Fee and accommodation card
       */}
      <div>
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-[0px_4px_23.7px_rgba(139,139,139,0.25)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
            {t('course.view_course:basic_details_tab.fee_and_accommodation')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            {programFees?.length > 0
              ? programFees?.map((item: ProgramFeeItem) => {
                  return (
                    <div className="flex flex-col gap-1">
                      <Header2>
                        {translatedText(
                  item?.is_custom_fee
                   ? item?.custom_fee_label
                    : item?.fee_level_id?.name as object
                )}
                      </Header2>
                      <ItemValue>
                        {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                        {(item?.total)?.toFixed(2)}
                      </ItemValue>
                    </div>
                  );
                })
              : ""}
              {/* This IsEarlyBirdFeeEnable variable checks if only program_fee_settings_id is not null than we have to show early bird fee in program_fee_settings_id otherwise checks is_early_bird_enabled present in program */}
             {IsEarlyBirdFeeEnable
               && programFees?.map((item: ProgramFeeItem) => {
              return (
              <div className="flex flex-col gap-1">
              <Header2>
                {t("new_strings:early_bird")}{" "}
                {translatedText(
                item?.is_custom_fee
                 ? item?.custom_fee_label
                  : item?.fee_level_id?.name as object
                )}
              </Header2>
              <ItemValue>
              {countryConfigData?.data?.[0]?.default_currency_code}{" "}
              {(item?.early_bird_total as unknown as number)?.toFixed(2)}
              </ItemValue>
              </div>
            );
            })
            }
            {courseData?.data?.program_accommodations?.length > 0
              ? courseData?.data?.program_accommodations?.map(
                  (item: AccommodationItem) => {
                    return (
                      <div className="flex flex-col gap-1">
                        <Header2>
                          {translatedText(
                            item?.accommodation_type_id?.name as any
                          )}
                        </Header2>
                        <ItemValue>
                          {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                          {item?.fee_per_person}
                        </ItemValue>
                      </div>
                    );
                  }
                )
              : ""}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-[30px]">
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-[0px_4px_23.7px_rgba(139,139,139,0.25)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
            {t('time_and_venue')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div>
              <Header2>{t('venue_address')}</Header2>
              {courseData?.data?.program_type_id?.is_online_program == true ?
              (courseData?.data?.online_url ? ( <a href= {courseData?.data?.online_url} className="text-indigo-600 hover:text-indigo-800" target="_blank">{t("new_strings:online")}</a>
            ) : ( "-"))
          :
          (courseData?.data?.venue_id ? (
            <ItemValue>
              {venue}
            </ItemValue>
          ):( "-"))}
            </div>
            <Header2>
            {t('sessions')}
              <div className="text-[16px] font-semibold text-[#666666] gap-1">
                {courseData?.data?.program_schedules?.length > 0
                  ? courseData?.data?.program_schedules?.map(
                      (item: ProgramScheduleItem, index: number) => (
                        <div key={index}>
                          <div className="flex flex-col">
                            <div>
                              {formatDateTime(item?.start_time, item?.end_time)}
                            </div>
                          </div>
                        </div>
                      )
                    )
                  : "-"}
              </div>
            </Header2>
          </CardContent>
        </Card>

        {/**
         * Registration Links card*/}

        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-[0px_4px_23.7px_rgba(139,139,139,0.25)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
            {t('course.view_course:basic_details_tab.registration_links')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            <div className="gap-[23px] flex flex-col">
              {/* TODO  for now scope this cx url is to be hidden */}
              {/* {courseData?.data?.visibility_id?.id == publicVisibilityId && (
                <div>
                  <Header2>{t('course.view_course:basic_details_tab.course_details_url')}</Header2>
                  <ItemValue>
                    <div className="flex flex-row gap-4">
                      <div className="w-[90%] break-words">
                        {courseData?.data?.details_page_link
                          ? courseData?.data?.details_page_link
                          : "-"}
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
                              {t('new_strings:copied')}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                  </ItemValue>
                </div>
              )} */}
              <div>
                <Header2>{t('course.view_course:basic_details_tab.registration_url')}</Header2>
                <div className="flex flex-row gap-4 ">
                  <div className="text-[16px] font-semibold w-[90%] break-words">
                    {courseData?.data?.registration_link
                      ? courseData?.data?.registration_link
                      : "-"}
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
                          {t('new_strings:copied')}
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
        <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-[0px_4px_23.7px_rgba(139,139,139,0.25)]">
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
            {t('course.view_course:basic_details_tab.contact_details')}
            </CardTitle>
            <hr></hr>
          </CardHeader>
          <CardContent className="gap-[23px] flex flex-col">
            {courseData?.data?.program_contact_details?.length > 0
              ? courseData?.data?.program_contact_details?.map(
                  (item: ContactDetailsItem) => {
                    return (
                      <div className="gap-[23px] flex flex-col">
                        <div>
                          <Header2>{t('contact_name')}</Header2>
                          <ItemValue>{item.contact_name ? item.contact_name : "-"}</ItemValue>
                        </div>
                        <div>
                          <Header2>{t('contact_email')}</Header2>
                          <ItemValue>{item.contact_email}</ItemValue>
                        </div>
                        <div>
                          <Header2>{t('course.view_course:basic_details_tab.contact_phone')}</Header2>
                          <ItemValue>{item.contact_number ? item.contact_number : "-"}</ItemValue>
                        </div>
                      </div>
                    );
                  }
                )
              : "-"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseDetailsTab;
