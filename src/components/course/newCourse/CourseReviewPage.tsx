import EditIcon from "@public/assets/EditIcon";
import { useTranslation } from "next-i18next";
import { Button } from "src/ui/button";

export default function CourseReviewPage() {
    const { t } = useTranslation("common");
    console.log("lanugage is", t("pages"));

    return (
        <div className="w-full text-base max-h-fit">
            {/* Basic Details */}
            <section className="w-full pb-8 text-base border-b">
                {/* title section */}
                <div className="flex items-center gap-2 ">
                    <p className="text-accent-primary">Basic Details</p>
                    <EditIcon />
                </div>
                {/* body */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Creator</p>
                        <p className="font-semibold truncate text-accent-secondary">I am teaching this course</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Organization</p>
                        <p className="font-semibold truncate text-accent-secondary">Name of the organization</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Program Organizer</p>
                        <p className="font-semibold truncate text-accent-secondary">Jenny Wilson</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">
                            Is geo restriction applicable for registrations
                        </p>
                        <p className="font-semibold truncate text-accent-secondary">Yes</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Registration via 3rd party gateway</p>
                        <p className="font-semibold truncate text-accent-secondary">No</p>
                    </div>
                </div>
            </section>
            {/* Course Details */}
            <section className="w-full py-8 text-base border-b">
                {/* title section */}
                <div className="flex items-center gap-2 ">
                    <p className="text-accent-primary">Course Details</p>
                    <EditIcon />
                </div>
                {/* body */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Course Type</p>
                        <p className="font-semibold truncate text-accent-secondary">Shailendra Kamble</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Teacher</p>
                        <p className="font-semibold truncate text-accent-secondary">Cameron Williamson</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Language(s) course is taught in</p>
                        <p className="font-semibold truncate text-accent-secondary">English</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Available language(s) for translation</p>
                        <p className="font-semibold truncate text-accent-secondary">French</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Max Capacity</p>
                        <p className="font-semibold truncate text-accent-secondary">850</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Program Visibility</p>
                        <p className="font-semibold truncate text-accent-secondary">Public</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Online zoom URL</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            https://artofliving.zoom.us/j/97973938580
                        </p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">
                            Country(s) from where registrations are allowed
                        </p>
                        <p className="font-semibold truncate text-accent-secondary">India, Germany</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">
                            Is geo restriction applicable for registrations
                        </p>
                        <p className="font-semibold truncate text-accent-secondary">Yes</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Course Description</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                            consequuntur ma
                        </p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Course Notes</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                            consequuntur ma
                        </p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Email Notes</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                            consequuntur ma
                        </p>
                    </div>
                </div>
            </section>
            {/* Time and Venue */}
            <section className="w-full py-8 text-base border-b">
                {/* title section */}
                <div className="flex items-center gap-2 ">
                    <p className="text-accent-primary">Time and Venue</p>
                    <EditIcon />
                </div>
                {/* body */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Venue Address</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            2118 Thornridge Cir. Syracuse, Connecticut, Kentucky 35624
                        </p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Time Format</p>
                        <p className="font-semibold truncate text-accent-secondary">12 Hours</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Sessions</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            08 Feb, 2024 |09:00 am to 12:00 pm 08 Feb, 2024 |03:00 pm to 06:00 pm 09 Feb, 2024 |09:00 am
                            to 12:00 pm 09 Feb, 2024 |09:00 am to 12:00 pm
                        </p>
                    </div>
                </div>
            </section>
            {/* Fees Information */}
            <section className="w-full py-8 text-base border-b">
                {/* title section */}
                <div className="flex items-center gap-2 ">
                    <p className="text-accent-primary">Fees Information</p>
                    <EditIcon />
                </div>
                {/* body */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Regular</p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Student </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Repeater </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Senior </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Early Bird Regular </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Early Bird Student </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Early Bird Repeater </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Early Bird Senior </p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 160.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Early bird cut-off period</p>
                        <p className="font-semibold truncate text-accent-secondary">16 Feb, 2024 (15 Days)</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Disable Pay Later Label123?</p>
                        <p className="font-semibold truncate text-accent-secondary">Yes</p>
                    </div>
                </div>
            </section>
            {/* Accommodation Information */}
            <section className="w-full py-8 text-base border-b">
                {/* title section */}
                <div className="flex items-center gap-2 ">
                    <p className="text-accent-primary">Accommodation Information</p>
                    <EditIcon />
                </div>
                {/* body */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Single Accomodation</p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">2 Person Sharing (Men)</p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">3 Person Sharing (Men)</p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Accommodation fee payment mode</p>
                        <p className="font-semibold truncate text-accent-secondary">MYR 100.00</p>
                    </div>
                </div>
            </section>
            {/* Contact Info */}
            <section className="w-full py-8 text-base ">
                {/* title section */}
                <div className="flex items-center gap-2 ">
                    <p className="text-accent-primary">Contact Info</p>
                    <EditIcon />
                </div>
                {/* body */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light ">Contact Email</p>
                        <p className="font-semibold truncate text-accent-secondary">course123@aol.com</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Contact Phone</p>
                        <p className="font-semibold truncate text-accent-secondary">+91 5248745985</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">Contact Name</p>
                        <p className="font-semibold truncate text-accent-secondary">Cameron Williamson</p>
                    </div>
                    <div className=" min-w-72">
                        <p className="text-sm font-normal text-accent-light">BCC registration confirmation email</p>
                        <p className="font-semibold truncate text-accent-secondary">course123@aol.com</p>
                    </div>
                </div>
            </section>
            <div className="flex items-center justify-center ">
                <Button>Continue</Button>
            </div>
        </div>
    );
}
