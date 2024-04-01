"use client";
import { CopyIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "src/ui/button";
import ThankYou from "@public/assets/ThankYou.png";
import Image from "next/image";
import { Circle } from "lucide-react";

const index = () => {
  const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false);
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false);

  const copyText = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCopyDetailsPageLink = () => {
    copyText("details_page_link");
    setCopiedDetailsPageLink(true);

    setTimeout(() => {
      setCopiedDetailsPageLink(false);
    }, 1000);
  };

  const handleCopyRegistrationLink = () => {
    copyText("registration_link");
    setCopiedRegistrationLink(true);

    setTimeout(() => {
      setCopiedRegistrationLink(false);
    }, 1000);
  };

  return (
    <div className="m-4">
      <div className=" flex justify-end  grid-cols-2">
        <Button className=" width-[135px] rounded-[25px] bg-yellow-100 text-yellow-500 h-[25px] gap-2">
          <Circle color="#FFB900" size={5} fill="#FFB900"/>
          Review Pending
        </Button>
        <Button
          variant="outline"
          className="text-indigo-600 border-indigo-600  "
        >
          Go to Course Listing
        </Button>
      </div>
      <center className=" items-center">
        <Image src={ThankYou} alt="My Image" width={148} height={148} />
      </center>
      <div className="overflow-x-auto relative bottom-20 ">
        <div className="p-5 flex   text-[13px] border-dashed border-2 rounded-2xl border-indigo-600 m-5 h-auto bg-indigo-50">
          <div className="p-3 border-r-2 pr-14 pl-6 md:border-r-0">
            <span className="text-gray-400">Course ID</span>
            <h4 className="font-bold mt-1">AOL25478D</h4>
          </div>
          <div className="p-3 pr-14 pl-6 border-r-2 md:border-r-0">
            <span className="text-gray-400">Course Name</span>
            <h4 className="font-bold mt-1">
              Happiness Program <br />
              for Youth
            </h4>
          </div>
          <div className="p-3 pr-14 pl-6 border-r-2 md:border-r-0">
            <span className="text-gray-400">Teachers</span>
            <h4 className="font-bold mt-1">
              Kathryn Murthy, cameron <br />
              williamson
            </h4>
          </div>
          <div className="p-3 pr-14 pl-6 border-r-2 md:border-r-0">
            <span className="text-gray-400">Venue</span>
            <h4 className="font-bold mt-1">
              2118 Thornridge Cir. Syracuse, <br />
              Connecticut, Manchester,kentucky <br /> 33624
            </h4>
          </div>
          <div className="p-3 pr-15">
            <span className="text-gray-400">Course Date (UTC 05:00)</span>
            <h4 className="font-bold mt-1">
              08 Feb,2024 | 0:00 am to 12:00 pm
            </h4>
            <h4 className="font-bold mt-1">
              08 Feb,2024 | 03:00 am to 6:00 pm
            </h4>
            <h4 className="font-bold mt-1">
              09 Feb,2024 | 09:00 am to 12:00 pm
            </h4>
          </div>
        </div>
      </div>
      <center className="relative bottom-[85px]">
        <p className="text-gray-400">Share in Social Platforms</p>
        <div className="flex w-9   relative right-[90px] ">
          <img className="hover:p-1" src="img1.svg" alt="" />
          <img
            className="hover:p-1 ml-3 mouse cursor-pointer"
            src="img2.svg"
            alt=""
          />
          <img className="hover:p-1 ml-3" src="img3.svg" alt="" />
          <img className="hover:p-1 ml-3" src="img4.svg" alt="" />
          <img className="hover:p-1 w-6 ml-4" src="img5.svg" alt="" />
        </div>
        <p className="text-gray-400">or</p>
      </center>
      <center className=" flex justify-center relative bottom-[90px]">
        <div>
          <span className="text-gray-400 relative bg-white top-[10px] right-[60px] text-[13px] ">
            &nbsp;&nbsp; Registration link &nbsp;&nbsp;
          </span>
          <div className="flex border rounded-2xl p-3">
            <h4 id="textToCopy" className="">
              register.artofliving.com/cource1
            </h4>
            <div
              onClick={() => {
                handleCopyDetailsPageLink();
              }}
              className="relative mt-1"
            >
              <CopyIcon />
              {copiedDetailsPageLink ? (
                <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                  copied
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="pl-5 ">
          <span className="text-gray-400 relative bg-white top-[10px] right-[60px] text-[13px] ">
            &nbsp;&nbsp; Details page link &nbsp;&nbsp;
          </span>
          <div className="flex border rounded-2xl p-3">
            <h4 id="textToCopy1" className="">
              artofliving.com/cource1
            </h4>
            <div
              onClick={() => {
                handleCopyRegistrationLink();
              }}
              className="relative mt-1"
            >
              <CopyIcon />
              {copiedRegistrationLink ? (
                <div className="absolute -left-12 bottom-8 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                  copied
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="pl-5">
          <Button
            onClick={() => {
              handleCopyDetailsPageLink();
              handleCopyRegistrationLink();
            }}
            variant="outline"
            className="text-indigo-600 border-indigo-600 rounded-[13px] w-[150px] p-6 mt-6 text-[16px] "
          >
            Copy 2 Links
          </Button>
        </div>
      </center>
    </div>
  );
};
export default index;
