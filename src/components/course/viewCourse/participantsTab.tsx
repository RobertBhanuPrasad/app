import LoadingIcon from "@public/assets/LoadingIcon";
import { useOne } from "@refinedev/core";
import { Circle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { supabaseClient } from "src/utility";
import { getColorWithDecreasedOpacity } from "src/utility/GenerateColours";
import { useTranslation } from 'next-i18next';

function ParticipantsTab() {
  const {t} = useTranslation(["common", "course.view_course"])
  
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const { data: courseData, isLoading } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "attendance_cancelled_participant_count,attendance_completed_participant_count,attendance_dropout_participant_count,attendance_pending_participant_count,fee_level_breakup,gender_breakup,participant_count,revenue,total_participant_count",
    },
  });
  console.log(courseData);
  
  if (isLoading) {
    return <LoadingIcon />;
  }
 

  return (
    <div className="my-[31px] mb-6 overscroll ">
      <div className="flex justify-between">
        <div className="text-[23px] font-semibold">{t('course.view_course:participants_tab.overall_participants')}</div>
        <div className="flex gap-4">
          <Button
            className="text-primary bg-[white] border border-primary w-[206px] h-[46px] rounded-[12px]"
            // onClick={() =>
            //     // router.push('/courses/add')
            // }
          >
            {t('register_participant')}
          </Button>
          <Button
            className="w-[188px] h-[46px] rounded-[12px]"
            onClick={() => router.push(`/courses/${id}/participants/list`)}
          >
            {t('view_participants')}
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-row  gap-[30px]">
        <AttendancePieChart participantData={courseData?.data} />
        <FeeLevelPieChart participantData={courseData?.data} />
        <GenderPieChart participantData={courseData?.data} />
      </div>
    </div>
  );
}

export default ParticipantsTab;

const FeeLevelPieChart = ({ participantData }: any) => {
  const {t} = useTranslation(["course.view_course", "new_strings"])
  const baseColor = "#7677F4";
  const feeLevelData = Object.keys(
    participantData?.fee_level_breakup || {}
  )?.map((label: any, index: any) => {
    return {
      title: label,
      value: participantData?.fee_level_breakup[label],
      color: getColorWithDecreasedOpacity(
        baseColor,
        index + 1,
        Object.keys(participantData?.fee_level_breakup)?.length
      ),
    };
  });

  return (
    <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
      <CardHeader>
        <CardTitle>
          <div className="text-[18px] font-semibold">{t('course.view_course:participants_tab.fee_level_breakup')}</div>
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
            totalValue={participantData?.total_participant_count}
            startAngle={0}
          />
          <div className="chart-inner-text flex flex-col">
            <p className="text-[10px]">{t('new_strings:total_participants')}</p>
            <p className="chart-inner-value">
              {participantData?.total_participant_count}
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="">
            {feeLevelData?.map((item: any, index: number) => {
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

const AttendancePieChart = ({ participantData }: any) => {
  
  const {t} = useTranslation(["course.view_course", "course.find_course", "course.participants"])
  const baseColor = "#7677F4";

  // TODO: need to translations
  const attendanceDataArray = [

    {
      
      label: t('course.find_course:completed'),
      value: participantData?.attendance_completed_participant_count,
    },
    {
      label: t('course.participants:find_participant.pending'),
      value: participantData?.attendance_pending_participant_count,
    },
    {
      label: t('course.participants:find_participant.dropout'),
      value: participantData?.attendance_dropout_participant_count,
    },
    {
      label: t('course.find_course:canceled'),
      value: participantData?.attendance_cancelled_participant_count,
    },
  ];

  const attendanceData = attendanceDataArray?.map((item: any, index: any) => {
    return {
      title: item.label,
      value: item.value,
      color: getColorWithDecreasedOpacity(
        baseColor,
        index + 1,
        attendanceDataArray?.length
      ),
    };
  });
  console.log("attendence data", attendanceData);
  

  return (
    <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6 ">
      <CardHeader>
        <CardTitle>
          <div className="text-[18px] font-semibold">{t('course.view_course:participants_tab.attendance_status')}</div>
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
            totalValue={participantData?.total_participant_count}
            startAngle={0}
          />
          <div className="chart-inner-text flex flex-col">
            <p className="text-[10px]">{t('new_strings:total_participants')}</p>
            <p className="chart-inner-value">
              {participantData?.total_participant_count}
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
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
      </CardContent>
    </Card>
  );
};

const GenderPieChart = ({ participantData }: any) => {
  const baseColor = "#7677F4";

  const genderData = Object.keys(participantData?.gender_breakup || {})?.map(
    (item: any, index: any) => {
      return {
        title: item,
        value: participantData?.gender_breakup[item],
        color: getColorWithDecreasedOpacity(
          baseColor,
          index + 1,
          Object.keys(participantData?.gender_breakup)?.length
        ),
      };
    }
  );
  const {t} = useTranslation(["course.view_course", "new_strings"])

  return (
    <Card className="w-[303px] rounded-[15px] border border-[#D9D9D9] drop-shadow-[0_0px_10px_rgba(0,0,0,0.1)] mb-6">
      <CardHeader>
        <CardTitle>
          <div className="text-[18px] font-semibold">{t('course.view_course:participants_tab.gender_breakdown')}</div>
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
            totalValue={participantData?.total_participant_count}
            startAngle={0}
          />
          <div className="chart-inner-text flex flex-col">
            <p className="text-[10px]">{t('new_strings:total_participants')}</p>
            <p className="chart-inner-value">
              {participantData?.total_participant_count}
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
