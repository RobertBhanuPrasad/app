import CalenderIcon from "@public/assets/CalenderIcon";
import CurrencyIcon from "@public/assets/CurrencyIcon";
import Important from "@public/assets/Important";
import LocationIcon from "@public/assets/LocationIcon";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import { useList, useOne } from "@refinedev/core";
import { Circle } from "lucide-react";
import React from "react";
import {
  PARTICIPANT_PAYMENT_STATUS,
  TIME_FORMAT,
} from "src/constants/OptionLabels";
import {
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PARTICIPANT_SUCCESS_PAYMENT_STATUS,
} from "src/constants/OptionValueOrder";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { formatDate } from "src/utility/DateFunctions";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";

function index() {
  const Id: number = 3;

  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,program_alias_name_id!inner(id,alias_name),program_schedules!inner(*),venue(*,city_id!inner(id ,name),state_id!inner(id ,name))",
    },
  });

  const participantSuccessPaymentId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_SUCCESS_PAYMENT_STATUS
  )?.id;

  const participantPendingPaymentId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_PENDING_PAYMENT_STATUS
  )?.id;

  const { data } = useList<any>({
    resource: "participation_registration",
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "payment_status",
        operator: "eq",
        value: participantSuccessPaymentId,
      },
      {
        field: "payment_status",
        operator: "eq",
        value: participantPendingPaymentId,
      },
      {
        field: "is_payment_refunded",
        operator: "eq",
        value: false,
      },
    ],
  });

  const startDate = formatDate(
    courseData?.data?.program_schedules[0]?.start_time
  );

  const endDate = formatDate(
    courseData?.data?.program_schedules[
      courseData?.data?.program_schedules?.length - 1
    ]?.end_time
  );

  const countryName = "India";

  console.log(courseData, "courseData");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="text-[32px] font-semibold">
          {courseData?.data?.program_alias_name_id?.alias_name}
        </div>
        <div className="w-[70px] h-6 bg-[#15AF530D] rounded-[15px] text-[#15AF53] text-[14px] font-semibold  flex flex-row justify-center items-center gap-[5px] ">
          <Circle className="fill-[#15AF53] size-2" />
          Active
        </div>
        <div className="w-[135px] h-[27px] bg-[#FFB9001A] rounded-[15px] text-[#FFB900] text-[14px] font-semibold  flex flex-row justify-center items-center gap-[5px] ">
          <Circle className="fill-[#FFB900] size-2" />
          Pending Review
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <CalenderIcon color="#7677F4" />
        {startDate} to {endDate}
        <ParticipantsIcon /> {216}
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              1 Participants with: Transaction status = Confirmed / Pending
              Attendance status = Confirmed / Pending / Dropout Total
              participants records:2{" "}
            </div>
          </HoverCardContent>
        </HoverCard>
        <CurrencyIcon />
        EUR 1,960.00
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Revenue from confirmed pending transaction participants revenue:
              EUR 10.00
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <LocationIcon />
        {courseData?.data?.venue?.address},
        {courseData?.data?.venue?.city_id?.name},
        {courseData?.data?.venue?.state_id?.name},{countryName},
        {courseData?.data?.venue?.postal_code}
      </div>
      <div className="flex flex-row items-center gap-2 w-full justify-end">
        Announced by: National Admin{" "}
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Approved by: National Admin(17 Mar, 2022)
              <br></br>
              Last Modified by: National Admin(17 Mar, 2022)
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

export default index;
