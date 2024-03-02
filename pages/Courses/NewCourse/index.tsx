import NewCourseStep1 from "@components/course/newCourse/NewCourseStep1";
import NewCourseStep2 from "@components/course/newCourse/NewCourseStep2";
import { zodResolver } from "@hookform/resolvers/zod";
import Car from "@public/assets/Car";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import { useStepsForm } from "@refinedev/react-hook-form";
import React from "react";
import { Button } from "src/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";
import { z } from "zod";

function index() {
  // Schema definition for form validation
  // const schema = z.object({
  //   max_capacity: z.string().refine((value: any) => value.trim().length > 3, {
  //     message: "course_type required",
  //   }),
  // });

  // Destructuring values from useStepsForm hook

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm({
    refineCoreProps: {
      action: "create",
      resource: "event",
    },
    // resolver: zodResolver(schema),
  });
  // Array of step titles, icons, and colors
  const stepTitles = [
    {
      value: "0",
      label: "Basic Details",
      icon: <Profile color={` ${currentStep == 0 ? "#7677F4" : "#999999"}`} />,
      color: "#7677F4",
    },
    {
      value: "1",
      label: "Course Details",
      icon: <Group color={` ${currentStep == 1 ? "#7677F4" : "#999999"}`} />,
      color: "#7677F4",
    },
    {
      value: "2",
      label: "Time and Venue",
      icon: <Venue color={` ${currentStep == 2 ? "#7677F4" : "#999999"}`} />,
      color: "#7677F4",
    },
    {
      value: "3",
      label: "Accommodation",
      icon: <Car color={` ${currentStep == 3 ? "#7677F4" : "#999999"}`} />,
      color: "#7677F4",
    },
    {
      value: "4",
      label: "Contact Info",
      icon: <Info color={` ${currentStep == 4 ? "#7677F4" : "#999999"}`} />,
      color: "#7677F4",
    },
  ];

  const onSubmit = (formData: any) => {
    console.log(formData);
    // Call onFinish with the form data if needed
    onFinish(formData);
  };

  // If the form is still loading, display a loading message
  if (formLoading) {
    return <div>Loading...</div>;
  }
  const contentStylings =
    "inline-flex !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background  data-[state=active]:shadow-sm";
  return (
    <div className="'bg-[white]">
      <Tabs value={JSON.stringify(currentStep)}>
        <div className="flex flex-row">
          <TabsList className="h-[513px]  bg-[#7677F41B] w-[238px] rounded-l-[24px] shadow-md mb-10 pt-10">
            <div className="flex flex-col  h-full gap-6">
              {stepTitles.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className="!h-12  items-center w-[230px]  data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] "
                  onClick={() => gotoStep(index)}
                >
                  {JSON.stringify(currentStep) === tab.value && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-3"></div>
                  )}
                  <div className="flex flex-row gap-[10px] ml-[14px] items-center">
                    {tab.icon}
                    {tab.label}
                  </div>
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          <div className="bg-[white] w-full rounded-[24px] -ml-4 -mt-1 p-4 shadow-md h-[517px]">
            <form autoComplete="off">
              <TabsContent value="0" className={contentStylings}>
              <NewCourseStep1 />
              </TabsContent>
              <TabsContent value="1" className={contentStylings}>
              <NewCourseStep2 />
              </TabsContent>
              <TabsContent value="2" className={contentStylings}>
               
              </TabsContent>
              <TabsContent value="3" className={contentStylings}>
                Change your password here.
              </TabsContent>
              <TabsContent value="4" className={contentStylings}>
                Change your accommodation details
              </TabsContent>
            </form>
          </div>
        </div>
      </Tabs>

      <div className="flex justify-center -mt-32 gap-4">
        {currentStep > 0 && (
          <Button
            onClick={() => {
              gotoStep(currentStep - 1);
            }}
            className="border border-[#7677F4] bg-[white] text-[#7677F4] font-semibold"
          >
            Previous
          </Button>
        )}
        {currentStep < stepTitles.length - 1 && (
          <Button
            className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] "
            onClick={() => {
              gotoStep(currentStep + 1);
            }}
          >
            Next
          </Button>
        )}
        {currentStep === stepTitles.length - 1 && (
          <Button
            className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] "
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

export default index;
