import { ViewCourseGlobalActions } from "@components/course/viewCourse/ViewCourseGlobalActions";
import CalenderIcon from "@public/assets/CalenderIcon";
import CurrencyIcon from "@public/assets/CurrencyIcon";
import Important from "@public/assets/Important";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import { useList, useOne } from "@refinedev/core";
import { ChevronLeftIcon, MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { formatDate } from "src/utility/DateFunctions";
import { supabaseClient } from "src/utility/supabaseClient";

export const ParticipantsListMainHeader = () => {
  const router = useRouter();

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

  return (
    <div className="flex justify-between px-8 h-auto pb-4">
      {/* Course Details Section */}
      <div className="flex gap-2">
        <ChevronLeftIcon
          color="#7677F4"
          height={50}
          width={50}
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <div>
          {/* Course Name */}
          <div className="text-[32px] font-medium">
            {courseData?.data?.program_alias_name_id
              ? courseData?.data?.program_alias_name_id?.alias_name
              : courseData?.data?.program_type_id?.name}
          </div>
          {/* Course Info */}
          <div className="flex gap-8 pt-2">
            {/* Course ID */}
            <div className="items-center font-medium">
              Course ID: {courseData?.data?.program_code}
            </div>
            {/* Course Schedule */}
            <div className="flex gap-2 items-center border-x-2 px-6">
              <CalenderIcon color="#7677F4" />
              {startDate} to {endDate}
            </div>
            {/* Participant Count */}
            <div className="flex gap-2 items-center">
              <ParticipantsIcon />
              <div className="cursor-pointer text-[#7677F4] font-medium">
                {courseData?.data?.participant_count}
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <Important />
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                    {courseData?.data?.participant_count} Participants with:
                    Transaction status = Confirmed / Pending Attendance status =
                    Confirmed / Pending / Dropout Total participants records:
                    {courseData?.data?.total_participant_count}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {/* Revenue */}
            <div className="flex gap-2 items-center">
              <CurrencyIcon />
              <div className="cursor-pointer text-[#7677F4] font-medium">
                {countryConfigData?.data?.[0]?.default_currency_code}{" "}
                {totalRevenue}
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <Important />
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                    Revenue from confirmed pending transaction participants
                    revenue:
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
