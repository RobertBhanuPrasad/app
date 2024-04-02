import React from "react";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { PieChart } from "react-minimal-pie-chart";
import { Circle } from "lucide-react";
import {
  GENDER,
  PARTICIPANT_ATTENDANCE_STATUS,
} from "src/constants/OptionLabels";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import { generateColors } from "src/utility/GenerateColours";
import { useOne } from "@refinedev/core";
import _ from "lodash";

function ParticipantsTab() {
  const genderOptions =
    getOptionValuesByOptionLabel(GENDER)?.[0]?.option_values;

  const participantAttendanceStatusOptions = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  console.log(
    participantAttendanceStatusOptions,
    "participantAttendanceStatusOptions"
  );

  const baseColor = "#7677F4";
  const numColors = genderOptions.length; // Use the length of genderOptions for the number of colors

  const Id = 10;
  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,participant_registration(*,contact_id(gender_id(id,value)),participant_attendence_status_id(id,value))",
    },
  });

  console.log(courseData, "courseData");
  const genderObjects = _.countBy(
    courseData?.data?.participant_registration,
    (obj) => obj.contact_id.gender_id?.value
  );

  const participantAttendanceObjects = _.countBy(
    courseData?.data?.participant_registration,
    (obj) => obj.participant_attendence_status_id?.value
  );

  console.log(
    courseData?.data?.participant_registration,
    "participantAttendanceObjectsF"
  );
  const participantAttendanceOptionsWithCounts =
    participantAttendanceStatusOptions.map((option: any) => ({
      ...option,
      count: participantAttendanceObjects[option.value] || 0, // Add count from genderCounts object or default to 0 if not found
    }));

  const genderOptionsWithCounts = genderOptions.map((option: any) => ({
    ...option,
    count: genderObjects[option.value] || 0, // Add count from genderCounts object or default to 0 if not found
  }));

  const data = genderOptionsWithCounts.map((item: any, index: number) => ({
    title: item.value,
    value: item.count,
    color: generateColors(baseColor, genderOptions.length)[index], // Use the index to get the color from the generated colors
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
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <div>
            <div className="text-[18px] font-semibold mt-4 ml-6">
              Attendance Status
            </div>
            <div className="">
              <PieChart
                data={[
                  {
                    title: "One",
                    value: 1,
                    color: "#3637b4",
                  },
                  { title: "Two", value: 2, color: "#CCCCFF" },
                  { title: "Three", value: 3, color: "#AFB0FF" },
                  { title: "four", value: 3, color: "#7677F4" },
                ]}
                rounded
                lineWidth={20}
                paddingAngle={18}
                radius={20}
              />
            </div>
          </div>
        </Card>
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <div>
            <div className="text-[18px] font-semibold mt-4 ml-6">
              Fee Level Breakup
            </div>
            <div className="relative">
              <PieChart
                data={participantAttendanceData}
                rounded
                style={{ position: "relative" }}
                lineWidth={20}
                paddingAngle={16}
                radius={30}
                center={[50, 30]}
                viewBoxSize={[100, 60]}
                totalValue={
                  courseData?.data?.participant_registration
                    ?.participant_attendence_status_id?.length
                }
              />
            </div>
            <div className="chart-inner-text flex flex-col">
              <p>Total Participants</p>
              <p className="chart-inner-value">
                {
                  courseData?.data?.participant_registration
                    ?.participant_attendence_status_id?.length
                }
              </p>
            </div>
          </div>
        </Card>
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle>
              <div className="text-[18px] font-semibold">Gender Breakdown</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="relative">
              <PieChart
                data={data}
                rounded
                style={{ position: "relative" }}
                lineWidth={20}
                paddingAngle={16}
                radius={30}
                center={[50, 30]}
                viewBoxSize={[100, 60]}
                totalValue={courseData?.data?.participant_registration?.length}
              />
              <div className="chart-inner-text flex flex-col">
                <p>Total Participants</p>
                <p className="chart-inner-value">
                  {courseData?.data?.participant_registration?.length}
                </p>
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <div className="">
                {genderOptionsWithCounts?.map((item: any, index: number) => {
                  return (
                    <div className="flex flex-row items-center justify-center justify-between">
                      <div className="flex items-center gap-2 py-[6px]">
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
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ParticipantsTab;
