import Back from "@public/assets/Back";
import Currency from "@public/assets/Currency";
import Important from "@public/assets/Important";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import Line from "@public/assets/line";
import { useList, useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import { ActionsDropDown } from "pages/courses/[id]";
import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { formatDate } from "src/utility/DateFunctions";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { translatedText } from 'src/common/translations'


function HeaderSection() {
  const router = useRouter();
  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;
  
  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        '*,created_by_user_id(contact_id(full_name)),program_type_id(name,is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,name),program_schedules!inner(*)'
    }
  })
  
  const startDate = formatDate(courseData?.data?.program_schedules[0]?.start_time)

  const endDate = formatDate(
    courseData?.data?.program_schedules[
      courseData?.data?.program_schedules?.length - 1
    ]?.end_time
  );
  const { data: countryConfigData } = useList({
    resource: "country_config",
  });
  const totalRevenue = courseData?.data?.revenue;
  const { replace } = useRouter();
  const { programId } = newCourseStore();

  return (
    <div className="flex justify-between w-full px-8 h-auto">
      {/* course accounting section */}
      <div className="flex gap-2 pb-3 pt-3">
        <div
          className="text-[#7677F4] pt-3 cursor-pointer w-8 h-8"
          onClick={() => {
            replace(`/courses/${Id}?tab=course_accounting_form`);
          }}
        >
          <Back />
        </div>
        <div className="pl-3">
        {/* course name */}
        <div className="text-2xl font-semibold">
          {courseData?.data?.program_alias_name_id
            ? translatedText(courseData?.data?.program_alias_name_id?.alias_name)
            : translatedText(courseData?.data?.program_type_id?.name)}
        </div>
        {/* course info */}
      <div className="flex flex-row gap-6">
        <p className="text-[#666666] text-base font-normal">
          Course Accounting Form
        </p>
        <div className="  ">
          <Line />
        </div>
        <div className="text-[#333333] text-base font-normal">
          {startDate} to {endDate}
        </div>
        <div className="">
          <Line />
        </div>
            {/* participants count */}
        <div className="flex gap-2 items-center">
          <ParticipantsIcon />
        <div
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer text-[#7677F4]"
        >
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
        {/* revenue */}
        <div className="flex gap-2 items-center">
          <Currency />
        <div
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer text-[#7677F4] font-medium"
        >
          {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
        </div>
        <HoverCard>
          <HoverCardTrigger>
              <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Revenue from confirmed pending transaction participants revenue:
              {countryConfigData?.data?.[0]?.default_currency_code}{" "}
              {totalRevenue}
            </div>
          </HoverCardContent>
        </HoverCard>
        </div>
      </div>
      </div>
      </div>
      {/* action dropdown */}
      <div className="flex items-center">
          <ActionsDropDown courseData={courseData?.data} />
        </div>
    </div>
  );
}

export default HeaderSection;
