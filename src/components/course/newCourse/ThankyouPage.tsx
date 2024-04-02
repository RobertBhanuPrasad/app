"use client";
import ThankYou from "@public/assets/ThankYou.png";
import InstagramIcon from "@public/images/InstagramIcon.png";
import linkedInIcon from "@public/images/LinkedInIcon.png";
import facebookIcon from "@public/images/facebookIcon.png";
import twitterIcon from "@public/images/twitterIcon.png";
import WhatsappIcon from "@public/images/whapsAppIconImage.png";
import { CopyIcon } from "@radix-ui/react-icons";
import { Circle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "src/ui/button";

const CourseThankyouPage = () => {
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
        <div className="relative m-4 bg-white rounded-lg ">
            {/* header : top buttons */}
            <div className="absolute flex items-center gap-4 right-6 top-4 rid-cols-2">
                <Button className=" width-[135px] rounded-[25px] bg-yellow-100 text-yellow-500 h-[25px] gap-2">
                    <Circle color="#FFB900" size={5} fill="#FFB900" />
                    Review Pending
                </Button>
                <Button variant="outline" className="text-indigo-600 border-indigo-600 ">
                    Go to Course Listing
                </Button>
            </div>
            <Image src={ThankYou} alt="My Image" width={148} height={148} className="mx-auto" />
            <div className="mx-auto text-center max-w-fit ">
                <p className="text-2xl font-semibold text-accent-primary">Congratulations!</p>
                <p className="text-accent-secondary">You have successfully announced a course</p>
            </div>
            {/* body: Course details view section */}
            <div className="flex h-auto px-4 py-4 m-5 text-base border-2 border-indigo-600 border-dashed rounded-2xl bg-indigo-50">
                <div className="flex-[1] p-4 border-r border-light">
                    <p className=" text-accent-secondary">Course ID</p>
                    <p className="font-bold text-accent-primary">AOL25478D</p>
                </div>
                <div className="flex-[1.5] p-4 border-r border-light">
                    <p className="text-accent-secondary">Course Name</p>
                    <p className="font-bold text-accent-primary">Happiness Program for Youth</p>
                </div>
                <div className="flex-[1.5] p-4 border-r border-light">
                    <p className="text-accent-secondary">Teachers</p>
                    <p className="font-bold text-accent-primary">Kathryn Murthy, cameron williamson</p>
                </div>
                <div className="flex-[2.5] p-4 border-r border-light">
                    <p className="text-accent-secondary">Venue</p>
                    <p className="font-bold text-accent-primary">
                        2118 Thornridge Cir. Syracuse, Connecticut, Manchester,kentucky 33624
                    </p>
                </div>
                <div className="flex-[2.5] p-4 ">
                    <p className="text-accent-secondary">Course Date (UTC 05:00)</p>
                    <p className="font-bold">08 Feb,2024 | 0:00 am to 12:00 pm</p>
                    <p className="font-bold">08 Feb,2024 | 03:00 am to 6:00 pm</p>
                    <p className="font-bold">09 Feb,2024 | 09:00 am to 12:00 pm</p>
                </div>
            </div>

            {/* Thank you page footer  */}
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
                <div className="flex items-center justify-center mt-4 ">
                    <div className="relative">
                        <p className="absolute text-xs bg-white text-accent-secondary -top-3 left-4 ">
                            Registration link
                        </p>
                        <div className="flex justify-between gap-2 p-3 border rounded-2xl min-w-72">
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
                        <p className="absolute text-xs bg-white text-accent-secondary -top-3 left-4 ">
                            Details page link
                        </p>
                        <div className="flex justify-between gap-2 p-3 border rounded-2xl min-w-72">
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
                            className="text-indigo-600 border-indigo-600 rounded-[13px] w-[150px] p-6  text-base "
                        >
                            Copy 2 Links
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default CourseThankyouPage;
