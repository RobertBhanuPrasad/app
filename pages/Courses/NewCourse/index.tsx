import NewCourseStep2 from "@components/course/newCourse/NewCourseStep2";
import { zodResolver } from "@hookform/resolvers/zod";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import { useStepsForm } from "@refinedev/react-hook-form";
import { Car } from "lucide-react";
import React from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "src/ui/button";
import { Tabs, TabsList, TabsTrigger } from "src/ui/tabs";
import { z } from "zod";

// Array of step titles, icons, and colors
const stepTitles = [
  {
    value: "0",
    label: "Basic Details",
    icon: <Profile />,
    color: "#7677F4",
  },
  {
    value: "1",
    label: "Course Details",
    icon: <Group />,
    color: "#7677F4",
  },
  {
    value: "2",
    label: "Time and Venue",
    icon: <Venue />,
    color: "#7677F4",
  },
  {
    value: "3",
    label: "Accommodation",
    icon: <Car />,
    color: "#7677F4",
  },
  {
    value: "4",
    label: "Contact Info",
    icon: <Info />,
    color: "#7677F4",
  },
];

function index() {
  // Schema definition for form validation
  const schema = z.object({
    max_capacity: z.string().refine((value: any) => value.trim().length > 3, {
      message: "course_type required",
    }),
  });

  // Destructuring values from useStepsForm hook
  const methods = useStepsForm({
    refineCoreProps: {
      action: "create",
      resource: "event",
    },
    resolver: zodResolver(schema),
  });

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = methods;

  const onSubmit = (formData: any) => {
    console.log(formData);
    // Call onFinish with the form data if needed
    onFinish(formData);
  };

  // Function to render form based on the current step
  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <label>max capacity</label>
            <input
              placeholder="max capacity"
              {...register("max_capacity", { required: true })}
            />
            {errors.max_capacity && <span>This field is required.</span>}
          </>
        );
      case 1:
        return <NewCourseStep2 />;
      case 2:
        return <div className="w-auto"></div>;
    }
  };

  // If the form is still loading, display a loading message
  if (formLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 36 }}>
        <div>
          <Tabs value={JSON.stringify(currentStep)}>
            <div className="flex flex-row">
              <TabsList className="h-[513px] bg-[#7677F41A]  mb-10 pt-10">
                <div className="flex flex-col mr-6 h-full gap-6">
                  {stepTitles.map((tab, index) => (
                    <TabsTrigger
                      key={index}
                      value={tab.value}
                      className="!h-12 w-[200px] items-center !shadow-none gap-2 data-[state=active]:bg-gradient-to-r from-[#7677F41A] to-transparent"
                      onClick={() => gotoStep(index)}
                    >
                      {JSON.stringify(currentStep) === tab.value && (
                        <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-16"></div>
                      )}
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
              <FormProvider {...methods}>
                <form autoComplete="off">
                  <div className="bg-[white] w-[1064px] rounded-[24px] p-6 -ml-4 -mt-1 shadow-md h-[517px]">
                    {renderFormByStep(currentStep)}
                  </div>
                </form>
              </FormProvider>
            </div>
          </Tabs>
        </div>
      </div>

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
