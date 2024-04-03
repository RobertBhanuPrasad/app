import EditIcon from "@public/assets/EditIcon";
import { useOne } from "@refinedev/core";
import { PROGRAM_ORGANIZER_TYPE } from "src/constants/OptionLabels";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";
import { getOptionValueObjectById } from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

export default function NewCourseReviewPage() {
    const { newCourseData, setViewPreviewPage, setViewThankyouPage } = newCourseStore();

    const creator =
        newCourseData?.program_created_by &&
        getOptionValueObjectById(PROGRAM_ORGANIZER_TYPE, newCourseData?.program_created_by);

    const { data: organizationName } = useOne({
        resource: "organizations",
        id: newCourseData?.organization_id,
    });

    const getUserName = (user_id: number) => {
        const { data: userName } = useOne({
            resource: "users",
            id: user_id,
        });
        return userName;
    };
    const getLanguageName = (id: number) => {
        const { data: userName } = useOne({
            resource: "languages",
            id: id,
        });
        return userName;
    };

    const programOrganizers = newCourseData?.organizer_ids
        ?.map((user_id: any) => {
            console.log("user id", user_id);

            return getUserName(user_id)?.data?.user_name;
        })
        .join(",");

    const { data: courseType } = useOne({
        resource: "program_types",
        id: newCourseData?.program_type_id,
    });

    const teachers = newCourseData?.teacher_ids
        ?.map((user_id: any) => {
            console.log("user id", user_id);

            return getUserName(user_id)?.data?.user_name;
        })
        .join(",");

    const languages = newCourseData?.language_ids
        ?.map((id: any) => {
            console.log("user id", id);

            return getLanguageName(id)?.data?.name;
        })
        .join(",");

    const languagesTranslations = newCourseData?.program_translation_language_ids
        ?.map((id: any) => {
            console.log("user id", id);

            return getLanguageName(id)?.data?.name;
        })
        .join(",");

    const allowedCountries = newCourseData?.allowed_countries
        ?.map((data: any) => {
            return data.value;
        })
        .join(",");

    console.log(courseType, "program");

    return (
        <div className="pb-12">
            <div className="text-[24px] my-4 font-semibold">Review Your Details Right Here</div>
            <div className="w-full p-6 text-base bg-white shadow-sm max-h-fit rounded-3xl">
                {/* Basic Details */}
                <section className="w-full pb-8 text-base border-b">
                    {/* title section */}
                    <div className="flex items-center gap-2 ">
                        <p className="font-semibold text-accent-primary">Basic Details</p>
                        <EditIcon />
                    </div>
                    {/* body */}
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light ">Creator</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {creator ? creator?.value : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Organization</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {organizationName?.data?.name}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Program Organizer</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {programOrganizers ? programOrganizers : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">
                                Is geo restriction applicable for registrations
                            </p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {newCourseData?.is_geo_restriction_applicable ? "yes" : "No"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Registration via 3rd party gateway</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {newCourseData?.is_registration_via_3rd_party ? "yes" : "No"}
                            </p>
                        </div>
                    </div>
                </section>
                {/* Course Details */}
                <section className="w-full py-8 text-base border-b">
                    {/* title section */}
                    <div className="flex items-center gap-2 ">
                        <p className="font-semibold text-accent-primary">Course Details</p>
                        <EditIcon />
                    </div>
                    {/* body */}
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light ">Course Type</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {courseType?.data?.name ? courseType?.data?.name : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Teacher</p>
                            <p className="font-semibold truncate text-accent-secondary">{teachers ? teachers : "-"}</p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Language(s) course is taught in</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {languages ? languages : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">
                                Available language(s) for translation
                            </p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {languagesTranslations ? languagesTranslations : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Max Capacity</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {newCourseData?.max_capacity ? newCourseData?.max_capacity : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Program Visibility</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {newCourseData?.visibility_id}
                            </p>
                        </div>
                        {/* // TODO need to do when the form name is clear */}
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
                            <p className="font-semibold truncate text-accent-secondary">
                                {allowedCountries ? allowedCountries : "-"}
                            </p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">
                                Is geo restriction applicable for registrations
                            </p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {newCourseData?.is_geo_restriction_applicable ? "yes" : "No"}
                            </p>
                        </div>
                        {/* // TODO need to do when the form filed is clear */}
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Course Description</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {/* {newCourseData} */}
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                                consequuntur ma
                            </p>
                        </div>
                        {/* // TODO need to do when the form filed is clear */}

                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Course Notes</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                                consequuntur ma
                            </p>
                        </div>
                        {/* // TODO need to do when the form filed is clear */}

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
                        <p className="font-semibold text-accent-primary">Time and Venue</p>
                        <EditIcon />
                    </div>
                    {/* body */}
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {/* // TODO need to do when the form filed is clear */}
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light ">Venue Address</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                2118 Thornridge Cir. Syracuse, Connecticut, Kentucky 35624
                            </p>
                        </div>
                        {/* // TODO need to do when the form filed is clear */}
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Time Format</p>
                            <p className="font-semibold truncate text-accent-secondary">12 Hours</p>
                        </div>
                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light">Sessions</p>
                            {newCourseData?.schedules?.map((data) => {
                                const schedule = `${formatDateString(data.date)} | ${data?.startHour} : ${
                                    data?.startMinute
                                }  ${data?.startTimeFormat} to ${data?.endHour} : ${data?.endMinute}  ${
                                    data?.endTimeFormat
                                }`;
                                return <p className="font-semibold truncate text-accent-secondary">{schedule}</p>;
                            })}
                        </div>
                    </div>
                </section>
                {/* Fees Information */}
                {/* // TODO need to do when the form filed is clear */}
                <section className="w-full py-8 text-base border-b">
                    {/* title section */}
                    <div className="flex items-center gap-2 ">
                        <p className="font-semibold text-accent-primary">Fees Information</p>
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
                        <p className="font-semibold text-accent-primary">Accommodation Information</p>
                        <EditIcon />
                    </div>
                    {/* body */}
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {newCourseData?.accommodation?.map((data: any) => {
                            const { data: accommodationType } = useOne({
                                resource: "accomdation_types",
                                id: data?.accomodationType,
                            });
                            console.log("accommodationType", accommodationType);

                            return (
                                <div className=" min-w-72">
                                    <p className="text-sm font-normal text-accent-light ">
                                        {accommodationType?.data?.name}
                                    </p>
                                    <p className="font-semibold truncate text-accent-secondary">
                                        MYR {data?.accomodationFee}
                                    </p>
                                </div>
                            );
                        })}

                        <div className=" min-w-72">
                            <p className="text-sm font-normal text-accent-light ">Accommodation fee payment mode</p>
                            <p className="font-semibold truncate text-accent-secondary">
                                {newCourseData?.accommodationPaymentMode}
                            </p>
                        </div>
                    </div>
                </section>
                {/* Contact Info */}
                <section className="w-full py-8 text-base ">
                    {/* title section */}
                    <div className="flex items-center gap-2 ">
                        <p className="font-semibold text-accent-primary">Contact Info</p>
                        <EditIcon />
                    </div>
                    {/* body */}
                    {newCourseData?.contact?.map((data: any) => {
                        return (
                            <div className="grid grid-cols-3 gap-4 pb-4 mt-2 border-b">
                                <div className=" min-w-72">
                                    <p className="text-sm font-normal text-accent-light ">Contact Email</p>
                                    <p className="font-semibold truncate text-accent-secondary">
                                        MYR {data?.contactEmail}
                                    </p>
                                </div>
                                <div className=" min-w-72">
                                    <p className="text-sm font-normal text-accent-light ">Contact Phone</p>
                                    <p className="font-semibold truncate text-accent-secondary">
                                        MYR {data?.contactMobile}
                                    </p>
                                </div>
                                <div className=" min-w-72">
                                    <p className="text-sm font-normal text-accent-light ">Contact Name</p>
                                    <p className="font-semibold truncate text-accent-secondary">
                                        MYR {data?.contactName}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div className="mt-4 min-w-72">
                        <p className="text-sm font-normal text-accent-light">BCC registration confirmation email</p>
                        <p className="font-semibold truncate text-accent-secondary">
                            {newCourseData?.contact?.courseEmails ? newCourseData?.contact?.courseEmails : "-"}
                        </p>
                    </div>
                </section>
                <div className="flex items-center justify-center ">
                    <Button
                        onClick={() => {
                            setViewPreviewPage(false);
                            setViewThankyouPage(true);
                        }}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
