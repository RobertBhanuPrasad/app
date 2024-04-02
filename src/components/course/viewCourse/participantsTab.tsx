import React from "react";
import { Button } from "src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/ui/card";
import { PieChart } from "react-minimal-pie-chart";
import { Circle } from "lucide-react";
import { GENDER } from "src/constants/OptionLabels";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";
import { generateColors } from "src/utility/GenerateColours";

function ParticipantsTab() {
  const genderOptions =
    getOptionValuesByOptionLabel(GENDER)?.[0]?.option_values;

  // Function to generate random color
  const getRandomColor = () => {
    // Implement your logic to generate a random color
    // For simplicity, returning a fixed color for now
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const baseColor = "#7677F4";
  const numColors = genderOptions.length; // Use the length of genderOptions for the number of colors

  console.log(generateColors(baseColor, numColors),)

  const data = genderOptions.map((item: any, index: number) => ({
    title: item.gender,
    value: 5,
    color: generateColors(baseColor, numColors)[index], // Use the index to get the color from the generated colors
  }));

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
            <CardTitle>
              <div className="text-[18px] font-semibold">Gender Breakdown</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <PieChart
              data={data}
              rounded
              lineWidth={20}
              paddingAngle={16}
              radius={30}
              center={[50, 30]}
              viewBoxSize={[100, 60]}
            />
            <div className="flex flex-col mt-6">
              <div className="">
                {genderOptions?.map((item: any) => {
                  return (
                    <div className="flex flex-row items-center gap-[7px]">
                      <Circle size={6} fill="#7677F4" />
                      <div className="text-[#999999]">{item?.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ParticipantsTab;
