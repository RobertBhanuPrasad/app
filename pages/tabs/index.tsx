import React, { useState } from "react";
import { HttpError, useSelect } from "@refinedev/core";
import { useStepsForm } from "@refinedev/react-hook-form";
import { Card } from "src/ui/card";
import { Label } from "src/ui/label";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import Info from "@public/assets/Info";
import Group from "@public/assets/Group";
import Car from "@public/assets/Car";
import { Tabs, TabsList, TabsTrigger } from "src/ui/tabs";

// const stepTitles = ["Title", "Status", "Category and content"];
const stepTitles = [
  {
    value: "basic-details",
    label: "Basic Details",
    icon: <Profile />,
    color: "#7677F4",
  },
  {
    value: "course-details",
    label: "Course Details",
    icon: <Group />,
    color: "#7677F4",
  },
  {
    value: "time-venue",
    label: "Time and Venue",
    icon: <Venue />,
    color: "#7677F4",
  },
  {
    value: "accommodation-fees",
    label: "Accommodation",
    icon: <Car />,
    color: "#7677F4",
  },
  {
    value: "contact-info",
    label: "Contact Info",
    icon: <Info />,
    color: "#7677F4",
  },
];

function index() {
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IPost, HttpError, IPost>();

  //   const { options } = useSelect<ICategory, HttpError>({
  //     resource: "categories",
  //   });
  const [selectedRadioValue, setRadioSelectedValue] = useState("option-one");

  const [selectedValue, setSelectedValue] = useState();
  const triggerColor =
    "!h-12 items-center !shadow-none gap-2 data-[state=active]:bg-gradient-to-r from-[#7677F41A] to-transparent ";
  console.log(currentStep,'currentStep')
  const renderFormByStep = (step: number) => {
    console.log(step, "step");
    switch (step) {
      case 0:
        return (
          <>
            <div>
                hiii
            </div>
          </>
        );
      case 1:
        return (
          <>
            <label>Status: </label>
            <select {...register("status")}>
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="rejected">rejected</option>
            </select>
          </>
        );
      case 2:
        return (
          <>
            <label>Category: </label>

            <br />
            <br />
            <label>Content: </label>
            <textarea
              {...register("content", {
                required: "This field is required",
              })}
              rows={10}
              cols={50}
            />
            {errors.content && <span>{errors.content.message}</span>}
          </>
        );
    }
  };

  if (formLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 36 }}>
        {/* {stepTitles.map((title, index) => ( */}

        <div>
          <Tabs
            defaultValue="account"
            onValueChange={(value: any) => {
              console.log(value, "value");
              setSelectedValue(value);
            }}
          >
            <div className="flex flex-row">
              <TabsList className="h-[513px] bg-[#7677F41A]  mb-10 pt-10">
                <div className="flex flex-col mr-6 h-full gap-6">
                  {stepTitles.map((tab, index) => (
                    <TabsTrigger
                      key={index}
                      value={tab.value}
                      className={triggerColor}
                      onClick={() => gotoStep(index)}
                    >
                      {selectedValue === tab.value && (
                        <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]"></div>
                      )}
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
              <form autoComplete="off">{renderFormByStep(currentStep)}</form>
            </div>
          </Tabs>
        </div>
        {/* ))} */}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {currentStep > 0 && (
          <button
            onClick={() => {
              gotoStep(currentStep - 1);
            }}
          >
            Previous
          </button>
        )}
        {currentStep < stepTitles.length - 1 && (
          <button
            onClick={() => {
                console.log('beforeclicked',currentStep)
              gotoStep(currentStep + 1);
              console.log('afterclicked',currentStep)

            }}
          >
            Next
          </button>
        )}
        {currentStep === stepTitles.length - 1 && (
          <button onClick={handleSubmit(onFinish)}>Save</button>
        )}
      </div>
    </div>
  );
}

export default index;

interface ICategory {
  id: number;
  title: string;
}

interface IPost {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: {
    id: ICategory["id"];
  };
}

//   <button
//     key={index}
//     onClick={() => gotoStep(index)}
//     style={{
//       backgroundColor: currentStep === index ? "lightgray" : "initial",
//     }}
//   >
//     {index + 1} - {title}
//   </button>
