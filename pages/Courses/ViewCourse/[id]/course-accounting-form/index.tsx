import Form from "@components/Formfield";
import CloseParticipantsSection from "@components/course/viewCourse/CourseAccountingForm/CloseParticipantsSection";
import ExpenseSection from "@components/course/viewCourse/CourseAccountingForm/ExpenseSection";
import RevenueSection from "@components/course/viewCourse/CourseAccountingForm/RevenueSection";
import { useSearchParams } from "next/navigation";
import React from "react";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
// Define type for sectionComponents

function index() {
  const params = useSearchParams();
  const currentSection = params.get("current_section");

  const sections = [
    {
      sectionName: "close_participants",
      component: <CloseParticipantsSection />,
    },
    {
      sectionName: "revenue",
      component: <RevenueSection />,
    },
    {
      sectionName: "expense",
      component: <ExpenseSection />,
    },
  ];

  /**
   * WE have 3 sections right but we have to render only one section at a moment
   * For this we will use find method
   * We will find the component to render based on the current section
   * we will get current section form url params
   * We are storing the curren_section information in params when user click on buttons we are setting
   */
  const componentToRender = sections.find((item: any) => {
    return item.sectionName === currentSection;
  });

  const onSubmit = (data: unknown) => {
    console.log("form data", data);
  };

  const { courseAccountingFormDefaultValues } = newCourseStore();
  return (
    <div>
      <section>
        {/* //TODO: here we have to keep header section code here */}
        {/* //TODO: The people we are doing header section US team is already done please dont do again ask them take code and use all only one componet */}
        header
      </section>

      <Form
        defaultValues={courseAccountingFormDefaultValues}
        onSubmit={onSubmit}
      >
        <section>{componentToRender?.component}</section>
      </Form>
    </div>
  );
}

export default index;
