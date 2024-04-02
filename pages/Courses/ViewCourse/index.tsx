import CalenderIcon from "@public/assets/CalenderIcon";
import CurrencyIcon from "@public/assets/CurrencyIcon";
import Important from "@public/assets/Important";
import LocationIcon from "@public/assets/LocationIcon";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import { useList, useOne } from "@refinedev/core";
import { Circle } from "lucide-react";
import React, { useState } from "react";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
  TIME_FORMAT,
} from "src/constants/OptionLabels";
import {
  COMPLETED_ATTENDANCE_STATUS,
  DROPOUT_ATTENDANCE_STATUS,
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PARTICIPANT_SUCCESS_PAYMENT_STATUS,
  PENDING_ATTENDANCE_STATUS,
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

import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
} from "src/constants/Tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";
import CustomSelect from "src/ui/custom-select";

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

  const pendingAttendanceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    PENDING_ATTENDANCE_STATUS
  )?.id;

  const completedAttendanceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    COMPLETED_ATTENDANCE_STATUS
  )?.id;

  const dropoutAttendanceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    DROPOUT_ATTENDANCE_STATUS
  )?.id;

  const participantPendingPaymentId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_PENDING_PAYMENT_STATUS
  )?.id;

  const { data: participantData } = useList<any>({
    resource: "participant_registration",
    // filters: [
    //   {
    //     field: "program_id",
    //     operator: "eq",
    //     value: Id,
    //   },
    //   {
    //     field: "payment_status",
    //     operator: "eq",
    //     value: participantSuccessPaymentId,
    //   },
    //   {
    //     field: "payment_status",
    //     operator: "eq",
    //     value: participantPendingPaymentId,
    //   },
    //   {
    //     field: "is_payment_refunded",
    //     operator: "eq",
    //     value: false,
    //   },
    //   {
    //     field: "participant_attendence_status_id",
    //     operator: "eq",
    //     value: completedAttendanceStatusId,
    //   },
    //   {
    //     field: "participant_attendence_status_id",
    //     operator: "eq",
    //     value: dropoutAttendanceStatusId,
    //   },
    //   {
    //     field: "participant_attendence_status_id",
    //     operator: "eq",
    //     value: pendingAttendanceStatusId,
    //   },
    // ],
  });

  console.log(participantData, "participantData");

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

  const { t } = useTranslation("common");
  const [selectedValue, setSelectedValue] = useState();
  const tabTriggers: any = [
    {
      value: COURSE_DETAILS_TAB,
      label: t("pages.Tabs.CourseDetailsTab"),
      disabled: false,
    },
    {
      value: PARTICIPANTS_TAB,
      label: t("pages.Tabs.participantTab"),
      disabled: false,
    },
    {
      value: REVENUE_SUMMARY_TAB,
      label: t("pages.Tabs.revenueSummaryTab"),
      disabled: false,
    },
    {
      value: COURSE_ACCOUNTING_FORM_TAB,
      label: t("pages.Tabs.courseAccountingFormTab"),
      disabled: true,
    },
  ];

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

      <div className="w-full ">
        <Tabs
          onValueChange={(val: any) => {
            setSelectedValue(val);
          }}
        >
          <TabsList className="flex flex-row gap-10 !flex-start !justify-start !bg-[white] !rounded-none">
            {tabTriggers.map((trigger: any, index: any) => (
              <TabsTrigger
                key={index}
                value={trigger.value}
                className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
                disabled={trigger.disabled}
              >
                <div className="flex flex-col gap-1">
                  {trigger.label}
                  <div
                    className={`${
                      selectedValue === trigger.value
                        ? "bg-[#7677F4] rounded w-full h-[2px]"
                        : "w-full h-[2px]"
                    }`}
                  />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="w-full border-b -mt-2"></div>
          <TabsContent value={COURSE_DETAILS_TAB}>
            Place course details tab here
          </TabsContent>
          <TabsContent value={PARTICIPANTS_TAB}>
            Place participant tab here
          </TabsContent>
          <TabsContent value={REVENUE_SUMMARY_TAB}>
            Place Revenue Summary tab here
          </TabsContent>
          <TabsContent value={COURSE_ACCOUNTING_FORM_TAB}>
            Place Course Accounting Form tab here
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default index;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};

const CourseNameDropDown = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { options, onSearch, queryResult } = useSelect({
    resource: "program_type_alias_names",
    optionLabel: "alias_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "alias_name",
        operator: "contains",
        value,
      },
    ],
    filters: [
      {
        field: "program_type_id",
        operator: "eq",
        value: 1,
      },
    ],
    pagination: {
      current: currentPage,
      mode: "server",
    },
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Course Name <div className="text-[#7677F4]">*</div>
      </div>
      <CustomSelect
        value={value}
        placeholder="Select course name"
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={(val) => {
          onChange(val);
        }}
      />
    </div>
  );
};
