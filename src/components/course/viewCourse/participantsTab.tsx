import React from "react";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { PieChart } from "react-minimal-pie-chart";
import { Circle } from "lucide-react";
import {
  FEE_LEVEL,
  GENDER,
  PARTICIPANT_ATTENDANCE_STATUS,
} from "src/constants/OptionLabels";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";
import {
  generateColors,
  getColorWithDecreasedOpacity,
} from "src/utility/GenerateColours";
import { useList, useOne } from "@refinedev/core";
import _ from "lodash";
import { FEMALE, MALE, OTHER } from "src/constants/OptionValueOrder";

function ParticipantsTab() {
  const Id = 1;

  const { data: participantData } = useList({
    resource: "participant_registration",
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
    ],
    meta: {
      select: "id",
    },
  });

  return (
    <div className="my-[31px]">
      <div className="flex justify-between">
        <div className="text-[23px] font-semibold">Overall Participants</div>
        <div className="flex gap-4">
          <Button className="text-primary bg-[white] border border-primary w-[206px] h-[46px] rounded-[12px]">
            Register Participant
          </Button>
          <Button className="w-[188px] h-[46px] rounded-[12px]">
            View Participants
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-row  gap-[30px]">
        <AttendancePieChart totalValue={participantData?.total} />
        <FeeLevelPieChart totalValue={participantData?.total} />
        <GenderPieChart totalValue={participantData?.total} />
      </div>
    </div>
  );
}

export default ParticipantsTab;

const AttendancePieChart = ({ totalValue }: any) => {
  const Id = 1;
  const completed = 55;
  const pending = 53;
  const dropout = 54;
  const canceled = 56;
  const { data: completedParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,participant_attendence_status_id!inner(id,value)",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "participant_attendence_status_id.id",
        operator: "eq",
        value: completed,
      },
    ],
  });

  const { data: pendingParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,participant_attendence_status_id!inner(id,value)",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "participant_attendence_status_id.id",
        operator: "eq",
        value: pending,
      },
    ],
  });

  const { data: dropoutParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,participant_attendence_status_id!inner(id,value)",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "participant_attendence_status_id.id",
        operator: "eq",
        value: dropout,
      },
    ],
  });

  const { data: canceledParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,participant_attendence_status_id!inner(id,value)",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "participant_attendence_status_id.id",
        operator: "eq",
        value: canceled,
      },
    ],
  });

  const baseColor = "#7677F4";

  const attendanceData = [
    {
      title: "completed",
      value: completedParticipantData ? completedParticipantData?.total : 0,
      color: baseColor,
    },
    {
      title: "Pending",
      value: pendingParticipantData ? pendingParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 1, totalValue),
    },
    {
      title: "Dropout",
      value: dropoutParticipantData ? dropoutParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 2, totalValue),
    },
    {
      title: "Canceled",
      value: canceledParticipantData ? canceledParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 3, totalValue),
    },
  ];
  return (
    <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
      <CardHeader>
        <CardTitle>
          <div className="text-[18px] font-semibold">Attendance Status</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="relative">
          <PieChart
            data={attendanceData}
            rounded
            style={{ position: "relative" }}
            lineWidth={20}
            paddingAngle={20}
            radius={25}
            center={[50, 30]}
            viewBoxSize={[100, 60]}
            totalValue={totalValue}
          />
          <div className="chart-inner-text flex flex-col">
            <p>Total Participants</p>
            <p className="chart-inner-value">{totalValue}</p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="">
            {attendanceData?.map((item: any, index: number) => {
              return (
                <div className="flex flex-row items-center justify-center justify-between">
                  <div className="flex items-center gap-2 py-[2px]">
                    <Circle size={6} fill={item?.color} color={item?.color} />
                    <div className="text-[#999999]">{item?.title}</div>
                  </div>
                  <div className="font-semibold">{item?.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FeeLevelPieChart = ({ totalValue }: any) => {
  const Id = 1;
  const regular = 1;
  const repeater = 2;
  const student = 3;
  const senior = 4;
  const { data: regularParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,price_category_id!inner(fee_level_id(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "price_category_id.fee_level_id.id",
        operator: "eq",
        value: regular,
      },
    ],
  });

  const { data: repeaterParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,price_category_id!inner(fee_level_id(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "price_category_id.fee_level_id.id",
        operator: "eq",
        value: repeater,
      },
    ],
  });

  console.log(repeaterParticipantData, "repeaterParticipantData");

  const { data: studentParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,price_category_id!inner(fee_level_id(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "price_category_id.fee_level_id.id",
        operator: "eq",
        value: student,
      },
    ],
  });

  const { data: seniorParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,price_category_id!inner(fee_level_id(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "price_category_id.fee_level_id.id",
        operator: "eq",
        value: senior,
      },
    ],
  });
  const baseColor = "#7677F4";
  const feeData = [
    {
      title: "Regular",
      value: regularParticipantData ? regularParticipantData?.total : 0,
      color: baseColor,
    },
    {
      title: "Repeater",
      value: repeaterParticipantData ? repeaterParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 1, totalValue),
    },
    {
      title: "Student",
      value: studentParticipantData ? studentParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 2, totalValue),
    },
    {
      title: "Senior",
      value: seniorParticipantData ? seniorParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 3, totalValue),
    },
  ];
  return (
    <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
      <CardHeader>
        <CardTitle>
          <div className="text-[18px] font-semibold">Fee Level Breakup</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="relative">
          <PieChart
            data={feeData}
            rounded
            style={{ position: "relative" }}
            lineWidth={20}
            paddingAngle={20}
            radius={25}
            center={[50, 30]}
            viewBoxSize={[100, 60]}
            totalValue={totalValue}
          />
          <div className="chart-inner-text flex flex-col">
            <p>Total Participants</p>
            <p className="chart-inner-value">{totalValue}</p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="">
            {feeData?.map((item: any, index: number) => {
              return (
                <div className="flex flex-row items-center justify-center justify-between">
                  <div className="flex items-center gap-2 py-[2px]">
                    <Circle size={6} fill={item?.value} color={item?.value} />
                    <div className="text-[#999999]">{item?.title}</div>
                  </div>
                  <div className="font-semibold">{item?.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GenderPieChart = ({ totalValue }: any) => {
  const baseColor = "#7677F4";

  const Id = 1;

  const genderOptions =
    getOptionValuesByOptionLabel(GENDER)?.[0]?.option_values;

  console.log(genderOptions, "genderOptions");

  const numColors = genderOptions.length; // Use the length of genderOptions for the number of colors

  const maleId = 23;

  console.log(maleId, "maleId");

  const femaleId = 24;

  const other = 62;
  // const maleId = getOptionValueObjectByOptionOrder(GENDER, MALE);

  const { data: MaleParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,contact_id!inner(gender_id!inner(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "contact_id.gender_id.id",
        operator: "eq",
        value: maleId,
      },
    ],
  });

  const { data: femaleParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,contact_id!inner(gender_id!inner(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "contact_id.gender_id.id",
        operator: "eq",
        value: femaleId,
      },
    ],
  });

  const { data: otherParticipantData } = useList({
    resource: "participant_registration",
    meta: {
      select: "id,contact_id!inner(gender_id!inner(id,value))",
    },
    filters: [
      {
        field: "program_id",
        operator: "eq",
        value: Id,
      },
      {
        field: "contact_id.gender_id.id",
        operator: "eq",
        value: other,
      },
    ],
  });

  const colorData = [
    {
      title: "Male",
      value: MaleParticipantData ? MaleParticipantData?.total : 0,
      color: baseColor,
    },
    {
      title: "Female",
      value: femaleParticipantData ? femaleParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 2, totalValue),
    },
    {
      title: "Other",
      value: otherParticipantData ? otherParticipantData?.total : 0,
      color: getColorWithDecreasedOpacity(baseColor, 3, totalValue),
    },
  ];
  return (
    <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
      <CardHeader>
        <CardTitle>
          <div className="text-[18px] font-semibold">Gender Breakdown</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="relative">
          <PieChart
            data={colorData}
            rounded
            style={{ position: "relative" }}
            lineWidth={20}
            paddingAngle={20}
            radius={25}
            center={[50, 30]}
            viewBoxSize={[100, 60]}
            totalValue={totalValue}
          />
          <div className="chart-inner-text flex flex-col">
            <p>Total Participants</p>
            <p className="chart-inner-value">{totalValue}</p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="">
            {colorData?.map((item: any, index: number) => {
              return (
                <div className="flex flex-row items-center justify-center justify-between">
                  <div className="flex items-center gap-2 py-[2px]">
                    <Circle size={6} fill={item.color} color={item.color} />
                    <div className="text-[#999999]">{item?.title}</div>
                  </div>
                  <div className="font-semibold">{item?.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
