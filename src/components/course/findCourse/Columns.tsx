import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import { DisplayOptions } from "@components/courseBusinessLogic";
import Cross from "@public/assets/Cross";
import Exclamation from "@public/assets/Exclamation";
import { useGetIdentity, useOne, useUpdate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { PROGRAM_STATUS, TIME_FORMAT } from "src/constants/OptionLabels";
import { CANCELED, TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import { useEffect, useState } from "react";
import { Button } from "src/ui/button";
import { useTranslation } from 'next-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { supabaseClient } from "src/utility/supabaseClient";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { format } from "date-fns";

type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

export const columns: any =(t:any) =>{
  return [
    {
      accessorKey: "program_code",
      column_name: t("new_strings:course_id"),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div className="w-[100px]">{t("new_strings:course_id")}</div>;
      },
      cell: ({ row } : any) => {
        const router = useRouter();
        return (
          <div
            onClick={() => {
              router.push(`/Courses/ViewCourse/${row?.original?.id}`);
              console.log("View Course Route is",`/Courses/ViewCourse/${row?.original?.id}`)
            }}
            className="w-[100px] text-[#7677F4] font-semibold"
          >
            {row.original.program_code}
          </div>
        );
      },
    },
    {
      accessorKey: "program_types",
      column_name: t("new_strings:course_type_name"),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div className="w-[150px]">{t("new_strings:course_type_name")}</div>;
      },
      cell: ({ row } : any) => {
        return (
          <div className="w-[150px]">{row?.original?.program_types?.name}</div>
        );
      },
    },
    {
      accessorKey: "program_type_alias_names",
      column_name: t("new_strings:course_name"),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div className="min-w-[150px]">{t("new_strings:course_name")}</div>;
      },
      cell: ({ row } : any) => {
        
        return (
          <div className="min-w-[150px]">
            {row?.original?.program_type_alias_names?.alias_name}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      column_name: t("course.find_course:course_status"),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:course_status")}</div>;
      },
      cell: ({ row } : any) => {
        return (
          <div className="min-w-[150px]">{row?.original?.status_id?.value}</div>
        );
      },
    },
    {
      accessorKey: "program_schedules",
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      column_name: t("course.find_course:start_date"),
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:start_date")}</div>;
      },
      cell: ({ row }: any) => {
        // Check if program_schedules exists and has at least one record
        if (
          row?.original?.program_schedules &&
          row.original.program_schedules.length > 0
        ) {
          // Get the record with order 1 (assuming order starts from 1)
          const record = row.original.program_schedules.find(
            (schedule: any) => schedule.order === 1
          );
          // Check if record with order 1 exists
          if (record) {
            // Extract date from the timestamp (assuming it's stored in a property called 'timestamp')
            const startDate = new Date(record.start_time).toLocaleDateString();
            return <div className="min-w-[150px]">{startDate}</div>;
          }
        }
        // Return empty if no record found or if program_schedules is not available
        return <div className="min-w-[150px]">-</div>;
      },
    },
    {
      accessorKey: "state",
      column_name: t("course.find_course:state"),
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:state")}</div>;
      },
      cell: ({ row } : any) => {
        return <div className="min-w-[150px]">{row?.original?.state?.name}</div>;
      },
    },
    {
      accessorKey: "city",
      column_name: t("common:city"),
      header: () => {
        return <div className="min-w-[150px]">{t("common:city")}</div>;
      },
      cell: ({ row } : any) => {
        return <div className="min-w-[150px]">{row?.original?.city?.name}</div>;
      },
    },
    {
      accessorKey: "center",
      column_name: t("course.find_course:center"),
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:center")}</div>;
      },
      cell: ({ row } : any) => {
        return <div className="min-w-[150px]">{row?.original?.center?.name}</div>;
      },
    },
    
    {
      accessorKey: "program_teachers",
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      column_name: t('course.find_course:teachers'),
      header: () => {
        return <div className="min-w-[150px]">{t('course.find_course:teachers')}</div>;
      },
      cell: ({ row } : any) => {
        const teachers = row?.original?.program_teachers?.map(
          (teacher: any) => teacher?.users?.contact_id?.full_name
        );
        
        return (
          <div className="flex flex-wrap min-w-[150px]">
            <div>{teachers && teachers.join(", ")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "program_organizers",
      column_name: t('new_strings:organizers'),
      header: () => {
        return <div className="min-w-[150px]">{t('new_strings:organizers')}</div>;
      },
      cell: ({ row } : any) => {
        const organizers = row?.original?.program_organizers?.map(
          (Organizer: any) => Organizer?.users?.contact_id?.full_name
        );
        return (
          <div className="flex flex-wrap min-w-[150px]">
            <div>{organizers && organizers.join(",  ")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "participant_registration",
      column_name: t("course.find_course:attendees"),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div>{t("course.find_course:attendees")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div className="min-w-[150px]">
            {row?.original?.participant_registration?.length}
          </div>
        );
      },
    },
    {
      accessorKey: "visibility_id",
      column_name: t('new_strings:visibility'),
      header: () => {
        return <div>{t('new_strings:visibility')}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div className="min-w-[150px]">
            {row?.original?.visibility_id?.value}
          </div>
        );
      },
    },
    {
      accessorKey: "course_accounting_status",
      column_name: t('new_strings:course_accounting_form'),
      header: () => {
        return <div className="min-w-[200px]">{t('new_strings:course_accounting_form')}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div className="min-w-[200px]">
            {row?.original?.program_accounting_status_id?.value
              ? row?.original?.program_accounting_status_id?.value
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "Course Accounting Closure Date",
      column_name: t('course.find_course:course_accounting_closure_date'),
      header: () => {
        return (
          <div className="min-w-[250px]">{t('course.find_course:course_accounting_closure_date') }</div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="min-w-[250px]">-</div>;
      },
    },
    {
      accessorKey: "revenue",
      column_name: t('new_strings:revenue'),
      header: () => {
        const {t} =useTranslation()
        return <div className="min-w-[150px]">{t('new_strings:revenue')}</div>;
      },
      cell: ({ row }: any) => {
        const [revenue, setRevenue] = useState<any>();
        useEffect(() => {
          const fetchData = async () => {
            const { data, error } = await supabaseClient.functions.invoke(
              "get_program_participant_summary",
              {
                method: "POST",
                body: {
                  program_id: row.original.id,
                },
              }
            );
            setRevenue(data);
          };
  
          fetchData();
        }, []);
  
        return (
          <div className="min-w-[150px]">{revenue ? revenue.income : "-"}</div>
        );
      },
    },
  
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row } : any) => {
        const {
          setViewPreviewPage,
          setNewCourseData,
          setViewThankyouPage,
          setCurrentStep,
        } = newCourseStore();
  
        const router = useRouter();
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [cancelSuccessModalOpen, setCancelSuccessModalOpen] =
          useState(false);
  
        const courseCanceledStatusId = getOptionValueObjectByOptionOrder(
          PROGRAM_STATUS,
          CANCELED
        )?.id;
  
        const { mutate } = useUpdate();
  
        const cancelCourse = async () => {
          setIsDialogOpen(false);
          await mutate({
            resource: "program",
            values: {
              status_id: courseCanceledStatusId,
            },
            id: row.original.id,
          });
          setCancelSuccessModalOpen(true);
        };
  
        const { data: loginUserData }: any = useGetIdentity();
  
        //TODO: Need to use row only instead of this below api call
        const { data, isLoading } = useOne({
          resource: "program",
          id: row.original.id,
        });
  
        const dropDownMenuData = DisplayOptions(
          data?.data?.status_id,
          data?.data?.program_accounting_status_id,
          loginUserData?.userData?.user_roles[0]?.role_id?.id
        );
  
        const handleEditCourse = async () => {
          console.log("clicking on edit course");
  
          /**
           * load default value by calling this function and store in newCourseData redux variable so that it will be used to prefill
           */
          const defaultValues = await handleCourseDefaultValues(row.original.id,TIME_FORMAT_12_HOURS);
          console.log("default values are", defaultValues);
  
          setNewCourseData(defaultValues);
  
          setViewPreviewPage(true);
        };
  
        /**
         * Handles creating a new course.
         * Retrieves default values for the course with the given ID,
         * sets the retrieved values as the new course data, and
         * switches the view to the new course page.
         */
        const handleCopyCourse = async () => {
          setViewThankyouPage(false);
          
          let defaultValues = await handleCourseDefaultValues(row.original.id,TIME_FORMAT_12_HOURS);
          // we have to delete schedules when user click on cipy course and other we need to prefill
          defaultValues = _.omit(defaultValues, ["id", "schedules"]);
          setNewCourseData(defaultValues);
          // when we do copy course we have to set the current step to first step
          setCurrentStep(1);
          router.push("/Courses/NewCourse");
        };
        const {t} = useTranslation("course.find_course")
        dropDownMenuData?.unshift({label:t('course.find_course:view_course_details'), value: 10 });
  
        const handleSelected = (value: number) => {
          console.log("clicked on", value);
  
          switch (value) {
            case 1: {
              //Need to navigate to participants list of select course.
              router.push(`ViewCourse/${row.original.id}/participant/list`);
              console.log("Participant route is",`ViewCourse/${row.original.id}/participant/list`)
              break;
            }
            case 2: {
              // TODO - Navigate to Register Participant page
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
              setIsDialogOpen(true);
              break;
            }
            case 6: {
              // TODO - Navigate to submit course accounting page
              router.push("/");
              break;
            }
            case 7: {
              // TODO - Navigate to view course accounting page
              router.push("/");
              break;
            }
            case 8: {
              // TODO - Navigate to edit course accounting page
              router.push("/");
              break;
            }
            case 9: {
              // TODO - Navigate to edit course accounting page
              router.push("/");
              break;
            }
            case 10: {
              router.push(`/Courses/ViewCourse/${row.original.id}`);
              console.log('View Course Route is',`/Courses/ViewCourse/${row.original.id}`)
              break;
            }
          }
        };
  
       
  
        return (
          <div className="">
            <div className="pl-[1px]">
              <div className="flex justify-center text-primary">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">{t('new_strings:open_menu')}</span>
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!isLoading ? (
                      <p>
                        {dropDownMenuData &&
                          dropDownMenuData.map((data: any) => (
                            <DropdownMenuItem
                              onClick={() => {
                                handleSelected(data.value);
                              }}
                            >
                              {data.label}
                            </DropdownMenuItem>
                          ))}
                      </p>
                    ) : (
                      <div className="flex items-center justify-center">
                        <div>Loading...</div>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {isDialogOpen && (
                  <div>
                    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                      <DialogContent className="flex flex-col h-[248px] w-[425px]">
                        <DialogHeader>
                          <div className="flex items-center w-full justify-center">
                            <Exclamation />
                          </div>
                          <DialogDescription className="font-bold text-black text-lg items-center text-center">
                          {t('new_strings:cancel_course')}
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
                                  setIsDialogOpen(false);
                                }}
                              >
                                {t('common:no_button')}
                              </Button>
                            </div>
                            <div>
                              <Button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                                onClick={() => {
                                  cancelCourse();
                                }}
                              >
                                {t('common:yes_button')}
                              </Button>
                            </div>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={cancelSuccessModalOpen}>
                      <DialogContent className="w-[414px] h-[279px]">
                        <div className="text-center">
                          <div className="flex justify-center">
                            <Cross />
                          </div>
                          <div className="font-bold text-center my-5">
                            {t('new_strings:course_cancel_successful')}
                          </div>
                        </div>
  
                        <div className="w-full flex items-center justify-center">
                          <Button
                            className=" bg-[#7677F4] w-[91px] h-[46px] text-white"
                            onClick={() => {
                              setCancelSuccessModalOpen(false);
                            }}
                          >
                            {t('common:close')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
  ];
} 
