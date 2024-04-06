"use client";
import { getCourseStatusColorBasedOnStatusId } from "@components/courseBusinessLogic";
import LoadingIcon from "@public/assets/LoadingIcon";
import InstagramIcon from "@public/images/InstagramIcon.png";
import ThankyouGif from "@public/images/ThankYou.png";
import WhatsappIcon from "@public/images/WhatsappIcon.png";
import facebookIcon from "@public/images/facebookIcon.png";
import linkedInIcon from "@public/images/linkedInIcon.png";
import twitterIcon from "@public/images/twitterIcon.png";
import { CopyIcon } from "@radix-ui/react-icons";
import { useOne } from "@refinedev/core";
import { Circle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROGRAM_STATUS } from "src/constants/OptionLabels";
import { ACTIVE } from "src/constants/OptionValueOrder";
import { Button } from "src/ui/button";
import { formatDateTime } from "src/utility/DateFunctions";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

const NewCourseThankyouPage = () => {
    const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false);
    const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false);
    const { programId } = newCourseStore();
    const copyText = async (text: any) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const handleCopyDetailsPageLink = (textToCopy: string) => {
        copyText(textToCopy);
        setCopiedDetailsPageLink(true);

        setTimeout(() => {
            setCopiedDetailsPageLink(false);
        }, 1000);
    };

    const handleCopyRegistrationLink = (textToCopy: string) => {
        copyText(textToCopy);
        setCopiedRegistrationLink(true);

        setTimeout(() => {
            setCopiedRegistrationLink(false);
        }, 1000);
    };

    const { data, isLoading: isThankyouPageDataIsLoading } = useOne({
        resource: "program",
        id: programId,
        meta: {
            select: "program_code,program_type_id,venue_id,registration_link,details_page_link,status_id,time_zone_id,program_type_id!inner(name),venue_id!inner(*,center_id!inner(name),state_id!inner(name),city_id!inner(name)),program_teachers(users(contact_id!inner(full_name))),program_schedules(start_time,end_time),status_id(id,value)",
        },
    });

    console.log("program data is", data);
    // if (isThankyouPageDataIsLoading)
    //     return (
    //         <div className="flex items-center justify-center h-16 bg-white shadow-md rounded-3xl">
    //             <LoadingIcon />
    //         </div>
    //     );

    // Formatting teacher string
    const teachers = data?.data?.program_teachers
        ?.map((teacher: any) => {
            return teacher?.users?.contact_id?.full_name;
        })
        .join(",");

    // Formatting the venue details
    const venue =
        data?.data?.venue_id?.address +
        "," +
        data?.data?.venue_id?.name +
        "," +
        data?.data?.venue_id?.center_id?.name +
        "," +
        data?.data?.venue_id?.city_id?.name +
        "," +
        data?.data?.venue_id?.state_id?.name +
        "," +
        data?.data?.venue_id?.postal_code;

    const statusColorCode = getCourseStatusColorBasedOnStatusId(data?.data?.status_id?.id)?.colorCode;
    const statusStyles = getCourseStatusColorBasedOnStatusId(data?.data?.status_id?.id)?.styles;
    const courseActiveStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, ACTIVE)?.id;

    return (
        <div>
            {isThankyouPageDataIsLoading ? (
                <div className="flex items-center justify-center h-16 bg-white shadow-md rounded-3xl">
                    <LoadingIcon />
                </div>
            ) : (
                <div className="relative pb-8 m-4 bg-white shadow-md rounded-3xl">
                    {/* header : top buttons */}
                    <div className="absolute flex items-center gap-4 right-6 top-4 rid-cols-2">
                        <Button className={`width-[135px] rounded-[25px]  h-[25px] gap-2 ${statusStyles}`}>
                            <Circle
                                color={statusColorCode}
                                fill={statusColorCode}
                                size={5}
                                className="text-[#FFB900]"
                            />
                            {data?.data?.status_id?.value}
                        </Button>
                        <Link href="/course">
                            <Button variant="outline" className="text-indigo-600 border-indigo-600 " onClick={() => {}}>
                                Go to Course Listing
                            </Button>
                        </Link>
                    </div>
                    <Image src={ThankyouGif} alt="My Image" width={148} height={148} className="mx-auto" />
                    <div className="mx-auto text-center max-w-fit ">
                        <p className="text-2xl font-semibold text-accent-primary">Congratulations!</p>
                        <p className="text-accent-secondary">You have successfully announced a course</p>
                    </div>
                    {/* body: Course details view section */}
                    <div className="flex h-auto px-4 py-4 m-5 text-base border-2 border-indigo-600 border-dashed rounded-2xl bg-indigo-50">
                        <div className="flex-[1] p-4 border-r border-light">
                            <p className=" text-accent-secondary">Course ID</p>
                            <Link href="/course">
                                <p className="font-bold cursor-pointer text-accent-primary">
                                    {data?.data?.program_code}
                                </p>
                            </Link>
                        </div>
                        <div className="flex-[1.5] p-4 border-r border-light">
                            <p className="text-accent-secondary">Course Name</p>
                            <p className="font-bold text-accent-primary">{data?.data?.program_type_id?.name}</p>
                        </div>
                        <div className="flex-[1.5] p-4 border-r border-light">
                            <p className="text-accent-secondary">Teachers</p>
                            <p className="font-bold text-accent-primary">{teachers ? teachers : "-"}</p>
                        </div>
                        {/* // TODO need to do when the form filed is clear */}
                        <div className="flex-[2.5] p-4 border-r border-light">
                            <p className="text-accent-secondary">Venue</p>
                            <p className="font-bold text-accent-primary">{venue ? venue : "-"}</p>
                        </div>
                        <div className="flex-[2.5] p-4 ">
                            <p className="text-accent-secondary">Course Date (UTC 05:00)</p>
                            {data?.data?.program_schedules?.map((data: any) => {
                                return (
                                    <p className="font-semibold truncate text-accent-secondary">
                                        {formatDateTime(data?.start_time, data?.end_time)}
                                    </p>
                                );
                            })}
                        </div>
                    </div>

                    {/* Thank you page footer  */}
                    {data?.data?.status_id?.id == courseActiveStatusId && (
                        <section>
                            <div className="">
                                <p className="mx-auto text-accent-secondary max-w-fit">Share in Social Platforms</p>
                                {/* Social media icons */}
                                <div className="flex items-center justify-center gap-4 my-4">
                                    <Image src={WhatsappIcon} alt="whats app icon"></Image>
                                    <Image src={facebookIcon} alt="facebook icon"></Image>
                                    <Image src={twitterIcon} alt="twitter icon"></Image>
                                    <Image src={InstagramIcon} alt="Instagram icon"></Image>
                                    <Image src={linkedInIcon} alt="Linked in icon"></Image>
                                </div>
                            </div>
                            <p className="mx-auto text-accent-secondary max-w-fit">Or</p>
                            {/* Hyper links section */}
                            <div className="flex items-center justify-center gap-4 mt-4 ">
                                <div className="relative">
                                    <p className="absolute text-xs bg-white text-accent-secondary -top-[10px] left-4 ">
                                        Registration link
                                    </p>
                                    <div className="flex justify-between gap-2 p-3 border rounded-2xl min-w-72">
                                        <h4 id="textToCopy" className="">
                                            {data?.data?.registration_link}
                                        </h4>
                                        <div
                                            onClick={() => {
                                                handleCopyDetailsPageLink(data?.data?.registration_link);
                                            }}
                                            className="relative mt-1 cursor-pointer"
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
                                <div className="relative ">
                                    <p className="absolute text-xs bg-white text-accent-secondary -top-[10px] left-4 ">
                                        Details page link
                                    </p>
                                    <div className="flex justify-between gap-2 p-3 border rounded-2xl min-w-72">
                                        <h4 id="textToCopy1" className="">
                                            {data?.data?.details_page_link}
                                        </h4>
                                        <div
                                            onClick={() => {
                                                handleCopyRegistrationLink(data?.data?.details_page_link);
                                            }}
                                            className="relative mt-1 cursor-pointer"
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
                                            handleCopyDetailsPageLink(data?.data?.details_page_link);
                                            handleCopyRegistrationLink(data?.data?.registration_link);
                                            copyText(
                                                data?.data?.registration_link + "," + data?.data?.details_page_link
                                            );
                                        }}
                                        variant="outline"
                                        className="text-indigo-600 border-indigo-600 rounded-[13px] w-[150px] p-6  text-base "
                                    >
                                        Copy 2 Links
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};
export default NewCourseThankyouPage;
