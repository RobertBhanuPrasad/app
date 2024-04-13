import CloseParticipantsSection from "@components/course/viewCourse/CloseParticipantsSection";
import ExpenseSection from "@components/course/viewCourse/ExpenseSection";
import RevenueSection from "@components/course/viewCourse/RevenueSection";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
// Define type for sectionComponents

function index() {
  const params = useSearchParams();
  const currentSection = params.get("current_section");
  console.log("current section", currentSection);

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

  const componentToRender = sections.find((item: any) => {
    return item.sectionName === currentSection;
  });

  return (
    <div>
      header
      <div>{componentToRender?.component}</div>
    </div>
  );
}

export default index;
