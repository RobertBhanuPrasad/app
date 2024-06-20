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
import { staticDataStore } from "src/zustandStore/StaticDataStore";


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
  
  const { staticData } = staticDataStore()  
  const { countryConfigData } = staticData
  const totalRevenue = courseData?.data?.revenue;
  const { replace } = useRouter();
  const { programId } = newCourseStore();

  return (
    <div className="flex flex-col mx-8">
      <div className="flex flex-row items-center ">
        <div
          className="  text-[#7677F4] pt-3 cursor-pointer"
          onClick={() => {
            replace(`/courses/${programId}?tab=course_accounting_form`);
          }}
        >
          <Back />
        </div>
        <div className="text-[33px] font-semibold pl-5 ">
          {courseData?.data?.program_alias_name_id
            ? translatedText(courseData?.data?.program_alias_name_id?.alias_name)
            : translatedText(courseData?.data?.program_type_id?.name)}
        </div>
        <div className="pr-2 ml-auto  ">
          <ActionsDropDown courseData={courseData?.data} />
        </div>
      </div>
      <div className="flex flex-row gap-5 ">
        <p className=" pl-9  text-[#666666] text-[16px]">
          Course Accounting Form
        </p>
        <div className="  ">
          <Line />
        </div>
        <div className="text-[#333333] text-[14px]">
          {startDate} to {endDate}
        </div>
        <div className="">
          <Line />
        </div>

        <div className="">
          <ParticipantsIcon />
        </div>
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
            <div className=" pt-1">
              <Important />
            </div>
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
        <div className="pt-1">
          <Currency />
        </div>

        <div
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer text-[#7677F4] "
        >
          {countryConfigData?.default_currency_code} {totalRevenue}
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <div className="pt-1">
              <Important />
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Revenue from confirmed pending transaction participants revenue:
              {countryConfigData?.default_currency_code}{" "}
              {totalRevenue}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

export default HeaderSection;
