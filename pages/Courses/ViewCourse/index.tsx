import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { authProvider } from "src/authProvider";
import { COURSE_ACCOUNTING_FORM_TAB, COURSE_DETAILS_TAB, PARTICIPANTS_TAB, REVENUE_SUMMARY_TAB } from "src/constants/CourseConstants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";

function index() {
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
