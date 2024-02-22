import Car from "@public/assets/Car";
import Group from "@public/assets/Group";
import Info from "@public/assets/Info";
import Profile from "@public/assets/Profile";
import Venue from "@public/assets/Venue";
import React, { useState } from "react";
import { Card } from "src/ui/card";
import { Label } from "src/ui/label";
import { RadioGroup, RadioGroupItem } from "src/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "src/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/ui/dialog";
import { Input } from "src/ui/input";
import dynamic from "next/dynamic";
import { HttpError, useSelect } from "@refinedev/core";
import { useStepsForm } from "@refinedev/react-hook-form";
import "react-quill/dist/quill.snow.css";

function index() {
  const [value, setValue] = useState<string>("");
  const stepTitles = ["Basic Details", "Course Details", "Time and Venue",  "Accommodation", "Contact Info"];

  const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
  });

  const handleChange = (content: string) => {
    setValue(content);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  const [selectedValue, setSelectedValue] = useState();

  const [selectedRadioValue, setRadioSelectedValue] = useState("option-one");

  const triggerColor =
    "!h-12 items-center !shadow-none gap-2 data-[state=active]:bg-gradient-to-r from-[#7677F41A] to-transparent ";

  const contentStylings =
    "inline-flex !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background  data-[state=active]:shadow-sm";
  return (
    <div className="mt-4">
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
                <TabsTrigger value="basic-details" className={triggerColor}>
                  {selectedValue === "basic-details" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Profile
                    color={` ${
                      selectedValue === "basic-details" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Basic Details
                </TabsTrigger>
                <TabsTrigger value="course-details" className={triggerColor}>
                  {selectedValue === "course-details" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Group
                    color={` ${
                      selectedValue === "course-details" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Course Details
                </TabsTrigger>
                <TabsTrigger value="time-venue" className={triggerColor}>
                  {selectedValue === "time-venue" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Venue
                    color={` ${
                      selectedValue === "time-venue" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Time and Venue
                </TabsTrigger>
                <TabsTrigger
                  value="accommodation-fees"
                  className={triggerColor}
                >
                  {selectedValue === "accommodation-fees" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Car
                    color={` ${
                      selectedValue === "accommodation-fees"
                        ? "#7677F4"
                        : "#999999"
                    }`}
                  />
                  Accommodation
                </TabsTrigger>
                <TabsTrigger value="contact-info" className={triggerColor}>
                  {selectedValue === "contact-info" && (
                    <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-[14px]  "></div>
                  )}
                  <Info
                    color={` ${
                      selectedValue === "contact-info" ? "#7677F4" : "#999999"
                    }`}
                  />
                  Contact Info
                </TabsTrigger>
              </div>
            </TabsList>
            <div className="bg-[white] w-full rounded-[24px] -ml-2 -mt-1 p-4 shadow-md h-[517px]">
              <TabsContent value="basic-details" className={contentStylings}>
                <RadioGroup
                  defaultValue="option-one"
                  onValueChange={(selectedRadioValue: string) => {
                    console.log(selectedRadioValue, "selectedRadioValue");
                    setRadioSelectedValue(selectedRadioValue);
                  }}
                >
                  <div className="flex items-center space-x-2 flex-col">
                    <Card
                      className={`flex justify-center p-2 gap-2 ${
                        selectedRadioValue === "option-one"
                          ? "border-[#7677F4]"
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value="option-one"
                        id="option-one"
                        className={
                          selectedRadioValue === "option-one"
                            ? "!bg-[#7677F4]"
                            : "border !border-[#D6D7D8] border-[1.5px]"
                        }
                      />
                      <Label
                        htmlFor="option-one"
                        className={`text-[#333333] font-normal ${
                          selectedRadioValue === "option-one"
                            ? "text-[#7677F4]"
                            : ""
                        }`}
                      >
                        Option One
                      </Label>
                    </Card>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Card
                      className={`flex justify-center p-2 gap-2 ${
                        selectedRadioValue === "option-two"
                          ? "border-[#7677F4]"
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value="option-two"
                        id="option-two"
                        className={
                          selectedRadioValue === "option-two"
                            ? "!bg-[#7677F4]"
                            : "border !border-[#D6D7D8] border-[1.5px]"
                        }
                      />
                      <Label
                        htmlFor="option-two"
                        className={`text-[#333333] font-normal ${
                          selectedRadioValue === "option-two"
                            ? "text-[#7677F4]"
                            : ""
                        }`}
                      >
                        Option Two
                      </Label>
                    </Card>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="course-details" className={contentStylings}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Manage</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Course Description</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <QuillNoSSRWrapper
                        modules={modules}
                        formats={formats}
                        theme="snow"
                      />
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="time-venue" className={contentStylings}>
                Change your password here.
              </TabsContent>
              <TabsContent
                value="accommodation-fees"
                className={contentStylings}
              >
                Change your accommodation details
              </TabsContent>
              <TabsContent value="contact-info" className={contentStylings}>
                Change your contact info
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default index;
