import { ViewCourseGlobalActions } from "@components/course/viewCourse/ViewCourseGlobalActions";
import CalenderIcon from "@public/assets/CalenderIcon";
import CurrencyIcon from "@public/assets/CurrencyIcon";
import Important from "@public/assets/Important";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import { useList, useOne } from "@refinedev/core";
import { ChevronLeftIcon, MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { translatedText } from "src/common/translations";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { formatDate } from "src/utility/DateFunctions";
import { supabaseClient } from "src/utility/supabaseClient";
import { useTranslation } from 'next-i18next';
import { getCurrencyFormat, getCurrencySymbol } from "src/utility/CurrencyFormat";
import useGetCountryCode from "src/utility/useGetCountryCode";
import useGetLanguageCode from "src/utility/useGetLanguageCode";



export const ParticipantsListMainHeader = () => {
  const router = useRouter();

  const countryCode = useGetCountryCode()

  const languageCode = useGetLanguageCode()


  //TODO: we need to pass the  currency code as the argument that is taken from country_config table
  const currencySymbol = getCurrencySymbol(countryCode, languageCode, 'EUR')

  const currencyFormat = getCurrencyFormat(countryCode, languageCode)

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,program_type_id(name,is_approval_required),program_alias_name_id(id,alias_name),program_schedules!inner(*)",
    },
  });

  const totalRevenue = courseData?.data?.revenue;

  const startDate = formatDate(
    courseData?.data?.program_schedules[0]?.start_time
  );

  const endDate = formatDate(
    courseData?.data?.program_schedules[
      courseData?.data?.program_schedules?.length - 1
    ]?.end_time
  );

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });
  const {t} = useTranslation(["course.view_course", "course.new_course", "new_strings", "common"])
  return (
    <div className="flex justify-between w-full px-8 h-auto">
      {/* Course Details Section */}
      <div className="flex gap-2">
        <ChevronLeftIcon
          color="#7677F4"
          height={32}
          width={32}
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <div>
          {/* Course Name */}
          <div className="text-[24px] font-medium ">
            {courseData?.data?.program_alias_name_id
              ? translatedText(
                  courseData?.data?.program_alias_name_id?.alias_name
                )
              : translatedText(courseData?.data?.program_type_id?.name)}
          </div>
          {/* Course Info */}
          <div className="flex gap-8 pt-2">
            {/* Course ID */}
            <div className="items-center text-[16px] font-medium">
              <span className="text-[#666666] ">
              {t("common:course_id")}: {courseData?.data?.program_code}
              </span>
            </div>
            {/* Course Schedule */}
            <div className="flex gap-2 items-center border-x-2 px-6">
              <CalenderIcon color="#7677F4" />
             {startDate} {t('course.new_course:time_and_venue_tab.to')} {endDate}
            </div>
            {/* Participant Count */}
            <div className="flex gap-2 items-center">
              <ParticipantsIcon />
              <div className="text-[#7677F4] font-medium">
                {courseData?.data?.participant_count}
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <Important />
                </HoverCardTrigger>
                <HoverCardContent>
                <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                    {courseData?.data?.participant_count} {t("new_strings:participants_header_hover_text")}
                    {courseData?.data?.total_participant_count}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {/* Revenue */}
            <div className="flex gap-2 items-center justify-center">
              <div className="text-[15px] flex items-center justify-center text-[#7677F4]">
                {currencySymbol}
              </div>
              <div className="text-[#7677F4] font-semibold cursor-pointer">
              {countryConfigData?.data?.[0]?.default_currency_code}{" "}
              {currencyFormat.format(totalRevenue)}
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <Important />
                </HoverCardTrigger>
                <HoverCardContent>
                <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                    {t("new_strings:revenue_from_confirmed_pending_transaction_participants_revenue")}
                    {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                    {totalRevenue}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </div>
      {/* Global Action Section */}
      <div className="flex items-center">
        <ViewCourseGlobalActions />
      </div>
    </div>
  );
};
