import React, { useEffect, useState } from "react";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { PieChart } from "react-minimal-pie-chart";
import { Circle } from "lucide-react";
import {
  FEE_LEVEL,
  GENDER,
  PARTICIPANT_ATTENDANCE_STATUS,
} from "src/constants/OptionLabels";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import { generateColors } from "src/utility/GenerateColours";
import { useList, useOne } from "@refinedev/core";
import _ from "lodash";
import { supabaseClient } from "src/utility";

function ParticipantsTab() {
  const genderOptions =
    getOptionValuesByOptionLabel(GENDER)?.[0]?.option_values;

  const participantAttendanceStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  const participantFeeStatusOptions =
    getOptionValuesByOptionLabel(FEE_LEVEL)?.[0]?.option_values;

  const baseColor = "#7677F4";
  const numColors = genderOptions.length; // Use the length of genderOptions for the number of colors

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
      select:
        "id,contact_id(gender_id(id,value)),participant_attendence_status_id(id,value),price_category_id(fee_level_id(id,value))",
    },
  });

  const fetchData = async () => {
    try {
      const { data, error } = await supabaseClient.functions.invoke(
        "get_program_participant_summary",
        {
          method: "POST",
          body: {
            program_id: 2,
          },
        }
      );
      console.log(data, "data");
    } catch (error) {
      console.error("Error fetching fee data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const participantAttendanceObjects = _.countBy(
    participantData?.data,
    (obj) => obj.participant_attendence_status_id?.value
  );

  const participantFeeLevelObjects = _.countBy(
    participantData?.data,
    (obj) => obj.price_category_id?.fee_level_id?.value
  );

  const participantFeeLevelOptionsWithCounts = participantFeeStatusOptions.map(
    (option: any) => ({
      ...option,
      count: participantFeeLevelObjects[option.value] || 0, // Add count from genderCounts object or default to 0 if not found
    })
  );

  const participantAttendanceOptionsWithCounts =
    participantAttendanceStatusOptions.map((option: any) => ({
      ...option,
      count: participantAttendanceObjects[option.value] || 0, // Add count from genderCounts object or default to 0 if not found
    }));

  const participantAttendanceData = participantAttendanceOptionsWithCounts.map(
    (item: any, index: number) => ({
      title: item.value,
      value: item.count,
      color: generateColors(
        baseColor,
        participantAttendanceStatusOptions.length
      )[index], // Use the index to get the color from the generated colors
    })
  );

  const participantFeeLevelData = participantFeeLevelOptionsWithCounts.map(
    (item: any, index: number) => ({
      title: item.value,
      value: item.count,
      color: generateColors(
        baseColor,
        participantAttendanceStatusOptions.length
      )[index], // Use the index to get the color from the generated colors
    })
  );

  return (
    <div className="my-[31px] mb-6 overscroll ">
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
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
          <CardHeader>
            <CardTitle>
              <div className="text-[18px] font-semibold">Attendance Status</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="relative">
              <PieChart
                data={participantAttendanceData}
                rounded
                style={{ position: "relative" }}
                lineWidth={20}
                paddingAngle={20}
                radius={25}
                center={[50, 30]}
                viewBoxSize={[100, 60]}
                totalValue={participantData?.total}
              />
              <div className="chart-inner-text flex flex-col">
                <p>Total Participants</p>
                <p className="chart-inner-value">{participantData?.total}</p>
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <div className="">
                {participantAttendanceOptionsWithCounts?.map(
                  (item: any, index: number) => {
                    return (
                      <div className="flex flex-row items-center justify-center justify-between">
                        <div className="flex items-center gap-2 py-[2px]">
                          <Circle
                            size={6}
                            fill={generateColors(baseColor, numColors)[index]}
                            color={generateColors(baseColor, numColors)[index]}
                          />
                          <div className="text-[#999999]">{item?.value}</div>
                        </div>
                        <div className="font-semibold">{item?.count}</div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
          <CardHeader>
            <CardTitle>
              <div className="text-[18px] font-semibold">Fee Level Breakup</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="relative">
              <PieChart
                data={participantFeeLevelData}
                rounded
                style={{ position: "relative" }}
                lineWidth={20}
                paddingAngle={20}
                radius={25}
                center={[50, 30]}
                viewBoxSize={[100, 60]}
                totalValue={participantData?.total}
              />
              <div className="chart-inner-text flex flex-col">
                <p>Total Participants</p>
                <p className="chart-inner-value">{participantData?.total}</p>
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <div className="">
                {participantFeeLevelOptionsWithCounts?.map(
                  (item: any, index: number) => {
                    return (
                      <div className="flex flex-row items-center justify-center justify-between">
                        <div className="flex items-center gap-2 py-[2px]">
                          <Circle
                            size={6}
                            fill={generateColors(baseColor, numColors)[index]}
                            color={generateColors(baseColor, numColors)[index]}
                          />
                          <div className="text-[#999999]">{item?.value}</div>
                        </div>
                        <div className="font-semibold">{item?.count}</div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <GenderPieChart />
      </div>
    </div>
  );
}

export default ParticipantsTab;

const GenderPieChart = () => {
  const genderOptions =
    getOptionValuesByOptionLabel(GENDER)?.[0]?.option_values;

  const baseColor = "#7677F4";
  const numColors = genderOptions.length;
  const Id = 2;

  const [participantData, setParticipantData] = useState<any>();

  const fetchData = async () => {
    try {
      const { data, error } = await supabaseClient.functions.invoke(
        "get_program_participant_summary",
        {
          method: "POST",
          body: {
            program_id: 2,
          },
        }
      );
      setParticipantData(data);
      console.log(data, "data");
    } catch (error) {
      console.error("Error fetching fee data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const genderData = [
    {
      title: genderOptions[0]?.value,
      value: participantData?.Gender?.Female
        ? participantData?.Gender?.Female
        : 0,
      color: "red",
    },
    {
      title: genderOptions[1]?.value,
      value: participantData?.Gender?.Male ? participantData?.Gender?.Male : 0,
      color: "green",
    },
    {
      title: genderOptions[2]?.value,
      value: participantData?.Gender?.Other
        ? participantData?.Gender?.Other
        : 0,
      color: "blue",
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
            data={genderData}
            rounded
            style={{ position: "relative" }}
            lineWidth={20}
            paddingAngle={20}
            radius={25}
            center={[50, 30]}
            viewBoxSize={[100, 60]}
            totalValue={participantData?.totalParticipantCount}
          />
          <div className="chart-inner-text flex flex-col">
            <p>Total Participants</p>
            <p className="chart-inner-value">
              {participantData?.totalParticipantCount}
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="">
            {genderData?.map((item: any, index: number) => {
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
