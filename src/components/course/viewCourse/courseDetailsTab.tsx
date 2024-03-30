import { useOne } from "@refinedev/core";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";

function CourseDetailsTab() {
  const id = 10;
  const { data: courseData, isLoading } = useOne({
    resource: "program",
    id,
    meta: {
      select: "*,organization_id!inner(id,name)",
    },
  });

  console.log(courseData, "data");
  return (
    <div>
      <Card className="w-[406px] rounded-[15px] border border-[#D9D9D9] shadow-md">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold">
            Basic Details
          </CardTitle>
          <hr></hr>
        </CardHeader>
        <CardContent>
          <div className="text-[#999999] text-[14px] font-normal">
            Organisation
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseDetailsTab;
