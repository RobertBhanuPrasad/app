import CalenderIcon from "@public/assets/CalenderIcon";
import CurrencyIcon from "@public/assets/CurrencyIcon";
import Important from "@public/assets/Important";
import LocationIcon from "@public/assets/LocationIcon";
import ParticipantsIcon from "@public/assets/ParticipantsIcon";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
} from "src/constants/OptionLabels";
import {
  CANCELED_ATTENDANCE_STATUS,
  COMPLETED_ATTENDANCE_STATUS,
  DROPOUT_ATTENDANCE_STATUS,
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PARTICIPANT_SUCCESS_PAYMENT_STATUS,
  PENDING_ATTENDANCE_STATUS,
} from "src/constants/OptionValueOrder";
import { useGetIdentity, useList, useOne, useUpdate } from "@refinedev/core";
import { Circle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PROGRAM_STATUS } from "src/constants/OptionLabels";
import { ACTIVE, DECLINED } from "src/constants/OptionValueOrder";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { formatDate, formatDateString } from "src/utility/DateFunctions";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import _ from "lodash";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { authProvider } from "src/authProvider";
import CustomSelect from "src/ui/custom-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";

import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
} from "src/constants/CourseConstants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "src/ui/textarea";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import ShareIcon from "@public/assets/ShareIcon";
import CopyIcon from "@public/assets/CopyIcon";
import WhatsappIcon from "@public/assets/WhatsappIcon";
import FaceBookIcon from "@public/assets/FaceBookIcon";
import TwitterIcon from "@public/assets/TwitterIcon";
import Instagram from "@public/assets/Instagram";
import LinkedInIcon from "@public/assets/LinkedInIcon";
import Exclamation from "@public/assets/Exclamation";
import Cross from "@public/assets/Cross";
import Tick from "@public/assets/Tick.png";
import ParticipantsTab from "@components/course/viewCourse/participantsTab";
import { supabaseClient } from "src/utility/supabaseClient";
import {
  handleTabsBasedOnStatus,
  isApproved,
} from "@components/courseBusinessLogic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import CourseDetailsTab from "@components/course/viewCourse/courseDetailsTab";

function index() {
  const router = useRouter();

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const { data: courseData } = useOne({
    resource: "program",
    id: Id,
    meta: {
      select:
        "*,program_type_id(is_approval_required),approved_by_user_id(contact_id(full_name)),program_alias_name_id(id,alias_name),venue_id(*,center_id(id,name),city_id(id,name),state_id(id,name)),status_id(id,value),program_schedules!inner(*)",
    },
  });

  const [participantData, setParticipantData] = useState<any>();

  const fetchData = async () => {
    try {
      const { data, error } = await supabaseClient.functions.invoke(
        "get_program_participant_summary",
        {
          method: "POST",
          body: {
            program_id: Id,
          },
        }
      );
      setParticipantData(data);
    } catch (error) {
      console.error("Error fetching fee data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = participantData?.income;

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
  const { viewPreviewPage } = newCourseStore();

  const [selectedValue, setSelectedValue] = useState(
    JSON.stringify(COURSE_DETAILS_TAB)
  );
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

  const { data: loginUserData }: any = useGetIdentity();

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });
  if (viewPreviewPage) {
    return <NewCourseReviewPage />;
  }

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
        <div>
          <ParticipantsIcon />
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer"
        >
          {participantData?.participantCount}
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              {participantData?.participantCount} Participants with: Transaction
              status = Confirmed / Pending Attendance status = Confirmed /
              Pending / Dropout Total participants records:
              {participantData?.totalParticipantCount}
            </div>
          </HoverCardContent>
        </HoverCard>
        <div>
          <CurrencyIcon />
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer"
        >
          {countryConfigData?.data?.[0]?.default_currency_code} {totalRevenue}
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Revenue from confirmed pending transaction participants revenue:
              {countryConfigData?.data?.[0]?.default_currency_code}{" "}
              {totalRevenue}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-row gap-2 items-center mt-3">
        <LocationIcon />
        {courseData?.data?.venue_id?.address},
        {courseData?.data?.venue_id?.city_id?.name},
        {courseData?.data?.venue_id?.state_id?.name}, {countryName},
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
              Approved by:{" "}
              {courseData?.data?.approved_by_user_id?.contact_id?.full_name} ({" "}
              {formatDateString(
                new Date(courseData?.data?.program_approved_date)
              )}
              )<br></br>
              Last Modified by: National Admin(17 Mar, 2022)
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="w-full mt-6 sticky">
        <Tabs
          onValueChange={(val: string) => {
            setSelectedValue(val);
          }}
          value={selectedValue}
        >
          <TabsList className="flex flex-row gap-10 !flex-start !justify-start !bg-[white] !rounded-none">
            {tabTriggers.map((trigger: any, index: number) => (
              <TabsTrigger
                key={index}
                value={JSON.stringify(trigger.value)}
                className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
                disabled={handleTabsBasedOnStatus(
                  courseData?.data?.status_id?.id,
                  trigger.value
                )}
              >
                <div className="flex flex-col gap-1">
                  {trigger.label}
                  <div
                    className={`${
                      selectedValue === JSON.stringify(trigger.value)
                        ? "bg-[#7677F4] rounded w-full h-[2px]"
                        : "w-full h-[2px]"
                    }`}
                  />
                </div>
              </TabsTrigger>
            ))}
            <div className="ml-auto mb-6 ">
              <ActionsDropDown />
              {isApproved(
                courseData?.data?.program_type_id?.is_approval_required,
                courseData?.data?.status_id?.id,
                loginUserData?.userData?.user_roles[0]?.role_id?.id
              ) && <PendingApprovalDropDown courseId={Id} />}
            </div>
          </TabsList>
          <div className="w-full border-b border-[#D6D7D8] -mt-2"></div>
          <TabsContent value={JSON.stringify(COURSE_DETAILS_TAB)}>
            <CourseDetailsTab />
          </TabsContent>
          <TabsContent value={JSON.stringify(PARTICIPANTS_TAB)}>
            <ParticipantsTab />
          </TabsContent>
          <TabsContent value={JSON.stringify(REVENUE_SUMMARY_TAB)}>
            Place Revenue Summary tab here
          </TabsContent>
          <TabsContent value={JSON.stringify(COURSE_ACCOUNTING_FORM_TAB)}>
            Place Course Accounting Form tab here
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default index;

const PendingApprovalDropDown = ({ courseId }: any) => {
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    ACTIVE
  )?.id;

  const courseDeclinedStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    DECLINED
  )?.id;
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
  const { mutate } = useUpdate();
  const approveCourse = () => {
    mutate({
      resource: "program",
      values: {
        status_id: courseActiveStatusId,
      },
      id: courseId,
    });
  };

  const rejectCourse = () => {
    mutate({
      resource: "program",
      values: {
        status_id: courseDeclinedStatusId,
      },
      id: courseId,
    });
  };
  return (
    <div>
      <Select
        onValueChange={(val) => {
          if (val == 1) {
            setApproveModalOpen(true);
          } else {
            setRejectModalOpen(true);
          }
        }}
      >
        <SelectTrigger className="w-[192px] border text-[#333333] font-semibold !border-[#999999]">
          <SelectValue placeholder="Pending Approval" />
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
            {options?.map((option: any, index: number) => (
              <>
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="h-[44px]"
                >
                  {option.label}
                </SelectItem>
              </>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="flex flex-col h-[248px] w-[425px]">
          <DialogHeader>
            <div className="flex items-center w-full justify-center">
              <Exclamation />
            </div>
            <DialogDescription className="font-bold text-black text-lg items-center text-center">
              Are you sure you want to approve this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-center items-center gap-5">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-blue-500 w-[71px] h-[46px]"
                  onClick={() => {
                    setApproveModalOpen(false);
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                      onClick={approveCourse}
                    >
                      Yes
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-50">
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTrigger></AlertDialogTrigger>
                      <div className="flex justify-center">
                        <Image src={Tick} alt="tick" />
                      </div>
                      <AlertDialogTitle className="font-bold text-center">
                        Course approved Successfully
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        Thank you for contribution in the course
                        <br /> approval process.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center justify-center">
                      <AlertDialogCancel
                        className=" bg-blue-500 mx-auto text-white"
                        onClick={() => setApproveModalOpen(false)}
                      >
                        Close
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="flex flex-col items-center px-6 w-[415px] ">
          <DialogHeader className="text-center">
            <div className="flex items-center w-full justify-center">
              <Cross />{" "}
            </div>
            <DialogTitle className="text-gray-500 text-sm font-normal pt-5">
              {" "}
              Describe your rejection reason
              <span className="text-blue-500">(optional)</span>
            </DialogTitle>
            <DialogDescription>
              <Textarea
                placeholder="Comment"
                className="border-[#E1E1E1] resize-none h-[112px] w-[366px]"
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogTrigger>
              <Button
                type="button"
                variant="outline"
                className="text-blue-500 mt-5"
                onClick={() => {
                  setRejectModalOpen(false);
                }}
              >
                No
              </Button>
            </DialogTrigger>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2"
                  onClick={rejectCourse}
                >
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[414px] h-[279px]">
                <AlertDialogHeader className="text-center">
                  <AlertDialogTrigger></AlertDialogTrigger>
                  <div className="flex items-center w-full justify-center">
                    <Cross />{" "}
                  </div>
                  <AlertDialogTitle className="font-bold text-center">
                    Course Rejected
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    The Course got rejected successfully
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center justify-center">
                  <AlertDialogCancel
                    className=" bg-blue-500 mx-auto text-white"
                    onClick={() => setRejectModalOpen(false)}
                  >
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

const ActionsDropDown = () => {
  const [cancelCourseModalOpen, setCancelCourseModalOpen] = useState(false);

  const { setNewCourseData, setViewPreviewPage } = newCourseStore();

  const router = useRouter();

  const Id: number | undefined = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const options = [
    {
      label: "View Participants",
      value: 1,
    },
    {
      label: "Register Participants",
      value: 2,
    },
    {
      label: "Edit Course",
      value: 3,
    },
    {
      label: "Copy Course",
      value: 4,
    },
    {
      label: "Cancel Course",
      value: 5,
    },
    {
      label: "Submit Course Accounting Form",
      value: 6,
    },
  ];

  /**
   * handle the Edit Course
   * Retrieves default values for the course with the given ID,
   * sets the retrieved values as the new course data, and
   * switches the view to the preview page.
   */
  const handleEditCourse = async () => {
    if (Id) {
      const defaultValues = await handleCourseDefaultValues(Id);
      setNewCourseData(defaultValues);
      setViewPreviewPage(true);
    }
  };

  /**
   * Handles creating a new course.
   * Retrieves default values for the course with the given ID,
   * sets the retrieved values as the new course data, and
   * switches the view to the new course page.
   */
  const handleCopyCourse = async () => {
    if (Id) {
      let defaultValues = await handleCourseDefaultValues(Id);

      // we have to delete schedules when user click on cipy course and other we need to prefill

      defaultValues = _.omit(defaultValues, ["schedules"]);
      setNewCourseData(defaultValues);
      router.push("/Course/NewCourse");
    }
  };
  return (
    <div>
      <CustomSelect
        placeholder="Actions"
        data={options}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={(val: any) => {
          switch (val) {
            case 1: {
              // TODO - navigate to view participants page
              router.push("/");
              break;
            }
            case 2: {
              // TODO - navigate to register participants page
              router.push("/");
              break;
            }
            case 3: {
              handleEditCourse();
              break;
            }
            case 4: {
              handleCopyCourse();
              break;
            }
            case 5: {
              setCancelCourseModalOpen(true);
              break;
            }
            case 6: {
              // TODO - navigate to course accounting form
              router.push("/");
              break;
            }
            default: {
              router.push("/");
            }
          }
        }}
        value={undefined}
        selectBoxStyles={{
          header: "w-[192px] ",
          dropdown: "w-[192px]",
        }}
      />
      <Dialog
        open={cancelCourseModalOpen}
        onOpenChange={setCancelCourseModalOpen}
      >
        <DialogContent className="flex flex-col h-[248px] w-[425px]">
          <DialogHeader>
            <div className="flex items-center w-full justify-center">
              <Exclamation />
            </div>
            <DialogDescription className="font-bold text-black text-lg items-center text-center">
              Are you sure you want to cancel this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-center items-center gap-5">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-blue-500 w-[71px] h-[46px]"
                  onClick={() => {
                    setCancelCourseModalOpen(false);
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                    >
                      Yes
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-50">
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTrigger></AlertDialogTrigger>
                      <div className="flex justify-center">
                        <Image src={Tick} alt="tick" />
                      </div>
                      <AlertDialogTitle className="font-bold text-center">
                        Course cancelled Successfully
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center justify-center">
                      <AlertDialogCancel
                        className=" bg-blue-500 mx-auto text-white"
                        onClick={() => setCancelCourseModalOpen(false)}
                      >
                        Close
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DisplayingCourseStatus = ({ statusId }: any) => {
  let statusText;
  let statusColor;
  let color;
  switch (statusId) {
    case "Active":
      statusText = "Active";
      statusColor = "text-[#15AF53] bg-[#15AF530D]";
      color = "#15AF53";
      break;
    case "Pending Review":
      statusText = "Pending Review";
      statusColor = "text-[#FFB900] bg-[#FFB9000D]";
      color = "#FFB900";
      break;
    case "Canceled":
      statusText = "Cancelled";
      statusColor = "text-[#FF5630] bg-[#FF56300D]";
      color = "#FF5630";
      break;
    case "Declined":
      statusText = "Declined";
      statusColor = "text-[#FF5630] bg-[#FF56300D]";
      color = "#FF5630";
      break;
    case "Completed":
      statusText = "Completed";
      statusColor = "text-[#36B37E] bg-[#36B37E0D]";
      color = "#36B37E";
      break;
    case "Full":
      statusText = "Full";
      statusColor = "text-[#15AF53] bg-[#15AF530D]";
      color = "#15AF53";
      break;
  }

  return (
    <div
      className={`h-[24px] rounded-[15px]  font-semibold flex flex-row items-center gap-[5px] px-2  ${statusColor}`}
    >
      <div>
        <Circle fill={color} size={4} />
      </div>
      <div>{statusText}</div>
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
