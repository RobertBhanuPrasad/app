import CalenderIcon from "@public/assets/CalenderIcon";
import CurrencyIcon from "@public/assets/CurrencyIcon";
import Important from "@public/assets/Important";
import LocationIcon from "@public/assets/LocationIcon";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import { CrudFilter, useList, useOne, useSelect } from "@refinedev/core";
import { Circle } from "lucide-react";
import React, { useState } from "react";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
  TIME_FORMAT,
} from "src/constants/OptionLabels";
import {
  COMPLETED_ATTENDANCE_STATUS,
  DROPOUT_ATTENDANCE_STATUS,
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PARTICIPANT_SUCCESS_PAYMENT_STATUS,
  PENDING_ATTENDANCE_STATUS,
} from "src/constants/OptionValueOrder";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { formatDate } from "src/utility/DateFunctions";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";

import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
} from "src/constants/Tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";
import CustomSelect from "src/ui/custom-select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "src/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/ui/alert-dialog";
import { Button } from "src/ui/button";
import ShareIcon from "@public/assets/ShareIcon";
import CopyIcon from "@public/assets/CopyIcon";
import WhatsappIcon from "@public/assets/WhatsappIcon";
import FaceBookIcon from "@public/assets/FaceBookIcon";
import TwitterIcon from "@public/assets/TwitterIcon";
import Instagram from "@public/assets/Instagram";
import LinkedInIcon from "@public/assets/LinkedInIcon";
// import { FiAlertCircle } from "react-icons/fi";
// import { FcOk } from "react-icons/fc";
// import { IoCloseSharp } from "react-icons/io5";
// import { FaWindowClose } from "react-icons/fa";

function index() {
  const Id: number = 1;

  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,participant_registration!inner(id),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules!inner(*)",
    },
  });

  const { data: courseDataa } = useOne({
    resource: "program",
    id: Id,
  });

  console.log(courseDataa, "courseDataa");
  const participantSuccessPaymentId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_SUCCESS_PAYMENT_STATUS
  )?.id;

  const pendingAttendanceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    PENDING_ATTENDANCE_STATUS
  )?.id;

  const completedAttendanceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    COMPLETED_ATTENDANCE_STATUS
  )?.id;

  const dropoutAttendanceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    DROPOUT_ATTENDANCE_STATUS
  )?.id;

  const participantPendingPaymentId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_PENDING_PAYMENT_STATUS
  )?.id;

  const dfilter: any = [
    {
      operator: "or",
      value: [
        {
          field: "payment_status_id",
          operator: "eq",
          value: participantSuccessPaymentId,
        },
        {
          field: "payment_status_id",
          operator: "eq",
          value: participantPendingPaymentId,
        },
      ],
    },
    {
      operator: "or",
      value: [
        {
          field: "participant_attendence_status_id",
          operator: "eq",
          value: completedAttendanceStatusId,
        },
        {
          field: "participant_attendence_status_id",
          operator: "eq",
          value: dropoutAttendanceStatusId,
        },
        {
          field: "participant_attendence_status_id",
          operator: "eq",
          value: pendingAttendanceStatusId,
        },
      ],
    },
    {
      field: "program_id",
      operator: "eq",
      value: Id,
    },
    ,
    {
      field: "is_payment_refunded",
      operator: "eq",
      value: false,
    },
  ];

  const { data: participantData } = useList<any>({
    resource: "participant_registration",
    filters: dfilter,
    meta: {
      select: "*,participant_payment_history(*)",
    },
  });

  

  console.log(participantData, "participantData");

  const startDate = formatDate(
    courseData?.data?.program_schedules[0]?.start_time
  );

  const endDate = formatDate(
    courseData?.data?.program_schedules[
      courseData?.data?.program_schedules?.length - 1
    ]?.end_time
  );

  const countryName = "India";

  console.log(courseData, "courseData");

  const { t } = useTranslation("common");
  const [selectedValue, setSelectedValue] = useState();
  const tabTriggers: any = [
    {
      value: COURSE_DETAILS_TAB,
      label: t("pages.Tabs.CourseDetailsTab"),
      disabled: false,
    },
    {
      value: PARTICIPANTS_TAB,
      label: t("pages.Tabs.participantTab"),
      disabled: false,
    },
    {
      value: REVENUE_SUMMARY_TAB,
      label: t("pages.Tabs.revenueSummaryTab"),
      disabled: false,
    },
    {
      value: COURSE_ACCOUNTING_FORM_TAB,
      label: t("pages.Tabs.courseAccountingFormTab"),
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="text-[32px] font-semibold">
          {courseData?.data?.program_alias_name_id?.alias_name}
        </div>
        <div className="flex items-center gap-4">
          <DisplayingCourseStatus
            statusId={courseData?.data?.status_id?.value}
          />
          <ShareButton courseData={courseData} />
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <CalenderIcon color="#7677F4" />
        {startDate} to {endDate}
        <ParticipantsIcon /> {participantData?.total}
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              {participantData?.total} Participants with: Transaction status =
              Confirmed / Pending Attendance status = Confirmed / Pending /
              Dropout Total participants records:
              {courseData?.data?.participant_registration?.length}
            </div>
          </HoverCardContent>
        </HoverCard>
        <CurrencyIcon />
        EUR 1,960.00
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Revenue from confirmed pending transaction participants revenue:
              EUR 10.00
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <LocationIcon />
        {courseData?.data?.venue_id?.address},
        {courseData?.data?.venue_id?.city_id?.name},
        {courseData?.data?.venue_id?.state_id?.name},{countryName},
        {courseData?.data?.venue_id?.postal_code}
      </div>

      <div className="flex flex-row items-center gap-2 w-full justify-end">
        Announced by: National Admin{" "}
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Approved by: National Admin(17 Mar, 2022)
              <br></br>
              Last Modified by: National Admin(17 Mar, 2022)
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="w-full mt-6 ">
        <Tabs
          onValueChange={(val: any) => {
            setSelectedValue(val);
          }}
        >
          <TabsList className="flex flex-row gap-10 !flex-start !justify-start !bg-[white] !rounded-none">
            {tabTriggers.map((trigger: any, index: any) => (
              <TabsTrigger
                key={index}
                value={trigger.value}
                className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
                disabled={trigger.disabled}
              >
                <div className="flex flex-col gap-1">
                  {trigger.label}
                  <div
                    className={`${
                      selectedValue === trigger.value
                        ? "bg-[#7677F4] rounded w-full h-[2px]"
                        : "w-full h-[2px]"
                    }`}
                  />
                </div>
              </TabsTrigger>
            ))}
            <div className="ml-auto mb-6 ">
              <PendingApprovalDropDown />
            </div>
          </TabsList>
          <div className="w-full border-b -mt-2"></div>
          <TabsContent value={COURSE_DETAILS_TAB}>
            Place course details tab here
          </TabsContent>
          <TabsContent value={PARTICIPANTS_TAB}>
            Place participant tab here
          </TabsContent>
          <TabsContent value={REVENUE_SUMMARY_TAB}>
            Place Revenue Summary tab here
          </TabsContent>
          <TabsContent value={COURSE_ACCOUNTING_FORM_TAB}>
            Place Course Accounting Form tab here
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default index;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};

const PendingApprovalDropDown = () => {
  const options = [
    {
      label: "Approve Course",
      value: 1,
    },
    {
      label: "Reject Course",
      value: 2,
    },
  ];
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  return (
    <div>
      <CustomSelect
        placeholder="Pending Approval"
        data={options}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={(val: any) => {
          if (val == 1) {
            setApproveModalOpen(true);
          } else {
            setRejectModalOpen(true);
          }
        }}
        value={undefined}
        selectBoxStyles={{
          header: "w-[192px] ",
          dropdown: "w-[192px]",
        }}
      />
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="flex flex-col items-center">
          <DialogHeader className="text-center">
            {/* <FiAlertCircle className={'text-yellow-300 w-12 h-12 mx-auto'} /><br /> */}
            <DialogDescription className="font-bold text-black text-lg">
              Are you sure you want to approve this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="text-blue-500"
              onClick={() => {
                setApproveModalOpen(false);
              }}
            >
              No
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2"
                >
                  Yes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-50">
                <AlertDialogHeader className="text-center">
                  <AlertDialogTrigger>
                    {/* <IoCloseSharp className="absolute top-3 right-3 cursor-pointer " /> */}
                  </AlertDialogTrigger>
                  {/* <FcOk className="w-11 h-11 mx-auto" /> */}
                  <AlertDialogTitle className="font-bold text-center">
                    Course approved Successfully
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Thank you for contribution in the course
                    <br /> approval process.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center justify-center">
                  <AlertDialogCancel className=" bg-blue-500 mx-auto text-white">
                    Close
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="flex flex-col items-center">
          <DialogHeader className="text-center">
            {/* <FaWindowClose className="w-11 h-11 mx-auto text-red-500" /> */}
            <DialogTitle className="text-gray-500 text-sm">
              {" "}
              Describe your rejection reason
              <span className="text-blue-500">(optional)</span>
            </DialogTitle>
            <DialogDescription>
              <p className="box-border h-32 w-80 p-4 border-[2px] text-gray-400 rounded-lg">
                Comment.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogTrigger>
              <Button
                type="button"
                variant="outline"
                className="text-blue-500"
                onClick={() => {
                  setRejectModalOpen(false);
                }}
              >
                No
              </Button>
            </DialogTrigger>
            <AlertDialog className="w-full max-w-xs">
              <AlertDialogTrigger>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2"
                >
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-50">
                <AlertDialogHeader className="text-center">
                  <AlertDialogTrigger>
                    {/* <IoCloseSharp className="absolute top-3 right-3 cursor-pointer " /> */}
                  </AlertDialogTrigger>
                  {/* <FaWindowClose className="w-11 h-11 mx-auto text-red-500" /> */}
                  <AlertDialogTitle className="font-bold text-center">
                    Course Rejected
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    The Course got rejected successfully
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center justify-center">
                  <AlertDialogCancel className=" bg-blue-500 mx-auto text-white">
                    Close
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DisplayingCourseStatus = ({ statusId }: any) => {
  let statusText;
  let statusColor;
  switch (statusId) {
    case "Active":
      statusText = "Active";
      statusColor = "red";
      break;
    case "Pending Review":
      statusText = "Pending Review";
      statusColor = "#FFB900";
      break;
    case "Cancelled":
      statusText = "Cancelled";
      statusColor = "#FFB900";
      break;
    case "Declined":
      statusText = "Declined";
      statusColor = "#FFB900";
      break;
    case "Completed":
      statusText = "Completed";
      statusColor = "#FFB900";
      break;
    case "Full":
      statusText = "Full";
      statusColor = "#FFB900";
      break;
  }

  return (
    <div>
      <div
        className={`w-[70px] h-6 bg-[${statusColor}0D] rounded-[15px] text-[${statusColor}] text-[14px] font-semibold  flex flex-row justify-center items-center gap-[5px] `}
      >
        <Circle className={`fill-[${statusColor}] size-2`} />
        {statusText}
      </div>
    </div>
  );
};

const ShareButton = (courseData: any) => {
  const [copiedDetailsPageLink, setCopiedDetailsPageLink] = useState(false);
  const [copiedRegistrationLink, setCopiedRegistrationLink] = useState(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCopyDetailsPageLink = () => {
    copyText(courseData?.data?.details_page_link);
    setCopiedDetailsPageLink(true);

    setTimeout(() => {
      setCopiedDetailsPageLink(false);
    }, 1000);
  };

  const handleCopyRegistrationLink = () => {
    copyText(courseData?.data?.registration_link);
    setCopiedRegistrationLink(true);

    setTimeout(() => {
      setCopiedRegistrationLink(false);
    }, 1000);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="border border-primary text-primary w-[93px] bg-[white] rounded-[12px] flex gap-2 ">
          Share <ShareIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[414px] h-[310px]">
        <DialogHeader>
          <DialogTitle>
            <center className="font-open-sans text-2xl font-semibold leading-8 relative bottom-2">
              Share in Social
            </center>
          </DialogTitle>
          <DialogDescription>
            <center>
              <div className="flex w-auto h-auto max-w-[336px] max-h-[48px] gap-x-6 ">
                <WhatsappIcon />
                <FaceBookIcon />
                <TwitterIcon />
                <Instagram />
                <LinkedInIcon />
              </div>
              <br />
              <p className="text-gray-600">Or</p>
            </center>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <center className="">
            <div className="w-[366px] h-[36px] px-3 relative bottom-12">
              <span className="text-gray-600 relative bg-white top-[10px] right-[100px] text-[13px] ">
                &nbsp;&nbsp; Registration link &nbsp;&nbsp;
              </span>
              <div className="flex border rounded-2xl p-3 justify-between">
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
            <div className="w-[366px] h-[36px] px-3 relative bottom-3">
              <span className="text-gray-600 relative bg-white top-[10px] right-[100px] text-[13px] ">
                &nbsp;&nbsp; Details page link &nbsp;&nbsp;
              </span>
              <div className="flex border rounded-2xl p-3 justify-between">
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
                    <div className="absolute -left-8 bottom-12 rounded-md bg-black px-5 py-2 text-[white] shadow-md sm:-left-8 sm:bottom-12">
                      copied
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </center>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
