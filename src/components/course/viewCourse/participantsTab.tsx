import { Circle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { supabaseClient } from "src/utility";
import { getColorWithDecreasedOpacity } from "src/utility/GenerateColours";
import _ from "lodash";

import { useTranslation } from 'next-i18next';

function ParticipantsTab() {
    const router = useRouter();

    const Id: number | undefined = router?.query?.id
        ? parseInt(router.query.id as string)
        : undefined;

    const [participantData, setParticipantData] = useState<any>();

    const fetchData = async () => {
        try {
            const { data, error } = await supabaseClient.functions.invoke(
                "get_program_participant_summary",
                {
                    method: "POST",
                    body: {
                        program_id: Id,
                    },
                }
            );
            setParticipantData(data);
        } catch (error) {
            console.error("Error fetching fee data:", error);
        }
    };

  useEffect(() => {
    fetchData();
  }, []);
  const {t} = useTranslation("common")
  return (
    <div className="my-[31px] mb-6 overscroll ">
      <div className="flex justify-between">
        <div className="text-[23px] font-semibold">Overall Participants</div>
        <div className="flex gap-4">
          <Button className="text-primary bg-[white] border border-primary w-[206px] h-[46px] rounded-[12px]">
          {t('register_participant')},
          </Button>
          <Button className="w-[188px] h-[46px] rounded-[12px]">
          {t('view_participants')}
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-row  gap-[30px]">
        <AttendancePieChart participantData={participantData} />
        <FeeLevelPieChart participantData={participantData} />
        <GenderPieChart participantData={participantData} />
      </div>
    </div>
  );
}

export default ParticipantsTab;

const FeeLevelPieChart = ({ participantData }: any) => {
    const baseColor = "#7677F4";

    const feeLevelData = participantData?.FeeLevelBreakUp?.map(
        (item: any, index: any) => {
            // Extract the title from the object key
            const title = Object.keys(item)[0];
            // Extract the value from the object value
            const value = Object.values(item)[0];
            return {
                title: title,
                value: value,
                color: getColorWithDecreasedOpacity(
                    baseColor,
                    index + 1,
                    participantData?.FeeLevelBreakUp?.length
                ),
            };
        }
    );
    return (
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="text-[18px] font-semibold">
                        Fee Level Breakup
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
                <div className="relative">
                    <PieChart
                        data={feeLevelData}
                        lineWidth={20}
                        paddingAngle={18}
                        radius={25}
                        rounded={true}
                        center={[50, 30]}
                        viewBoxSize={[100, 60]}
                        totalValue={participantData?.totalParticipantCount}
                        startAngle={0}
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
                        {feeLevelData?.map((item: any, index: number) => {
                            return (
                                <div className="flex flex-row items-center justify-center justify-between">
                                    <div className="flex items-center gap-2 py-[2px]">
                                        <Circle
                                            size={6}
                                            fill={item?.color}
                                            color={item?.color}
                                        />
                                        <div className="text-[#999999]">
                                            {item?.title}
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {item?.value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AttendancePieChart = ({ participantData }: any) => {
    const baseColor = "#7677F4";

    const attendanceData = participantData?.AttendanceStatus?.map(
        (item: any, index: any) => {
            // Extract the title from the object key
            const title = Object.keys(item)[0];
            // Extract the value from the object value
            const value = Object.values(item)[0];
            return {
                title: title,
                value: value,
                color: getColorWithDecreasedOpacity(
                    baseColor,
                    index + 1,
                    participantData?.AttendanceStatus?.length
                ),
            };
        }
    );

    return (
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="text-[18px] font-semibold">
                        Attendance Status
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
                <div className="relative">
                    <PieChart
                        data={attendanceData}
                        style={{ position: "relative" }}
                        lineWidth={20}
                        paddingAngle={18}
                        radius={25}
                        rounded={true}
                        center={[50, 30]}
                        viewBoxSize={[100, 60]}
                        totalValue={participantData?.totalParticipantCount}
                        startAngle={0}
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
                        {attendanceData?.map((item: any, index: number) => {
                            return (
                                <div className="flex flex-row items-center justify-center justify-between">
                                    <div className="flex items-center gap-2 py-[2px]">
                                        <Circle
                                            size={6}
                                            fill={item?.color}
                                            color={item?.color}
                                        />
                                        <div className="text-[#999999]">
                                            {item?.title}
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {item?.value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const GenderPieChart = ({ participantData }: any) => {
    const baseColor = "#7677F4";

    const genderData = participantData?.Gender?.map((item: any, index: any) => {
        // Extract the title from the object key
        const title = Object.keys(item)[0];
        // Extract the value from the object value
        const value = Object.values(item)[0];
        return {
            title: title,
            value: value,
            color: getColorWithDecreasedOpacity(
                baseColor,
                index + 1,
                participantData?.Gender?.length
            ),
        };
    });

    return (
        <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="text-[18px] font-semibold">
                        Gender Breakdown
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
                <div className="relative pension-summary-chart">
                    <PieChart
                        data={genderData}
                        style={{ position: "relative" }}
                        lineWidth={20}
                        paddingAngle={18}
                        radius={25}
                        rounded={true}
                        center={[50, 30]}
                        viewBoxSize={[100, 60]}
                        totalValue={participantData?.totalParticipantCount}
                        startAngle={0}
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
                                        <Circle
                                            size={6}
                                            fill={item?.color}
                                            color={item?.color}
                                        />
                                        <div className="text-[#999999]">
                                            {item?.title}
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {item?.value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
