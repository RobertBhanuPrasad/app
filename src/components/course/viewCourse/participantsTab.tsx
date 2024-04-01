import React from "react";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { PieChart } from "react-minimal-pie-chart";
import { Circle } from "lucide-react";

function ParticipantsTab() {
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
                  { title: "One", value: 1, color: "#E2E3FF" },
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
            <div className="">
              <PieChart
                data={[
                  { title: "One", value: 1, color: "#E2E3FF" },
                  { title: "Two", value: 9, color: "#CCCCFF" },
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
          <CardHeader>
            <div className="text-[18px] font-semibold">Gender Breakdown</div>
          </CardHeader>
          <CardContent className="-mt-16 !p-0">
            <PieChart
              data={[
                { title: "Other", value: 3, color: "#AFB0FF" },
                { title: "Female", value: 2, color: "#CCCCFF" },
                { title: "Male", value: 3, color: "#7677F4" },
              ]}
              rounded
              lineWidth={20}
              paddingAngle={18}
              radius={22}
            />
            <div className="flex flex-col">
              <div>
                <Circle size={6} fill="#7677F4" />
                <div className="text-[#999999]">Male</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ParticipantsTab;
