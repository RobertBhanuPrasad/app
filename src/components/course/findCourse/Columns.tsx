import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import { DisplayOptions } from "@components/courseBusinessLogic";
import Cross from "@public/assets/Cross";
import Exclamation from "@public/assets/Exclamation";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import _ from "lodash";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PROGRAM_STATUS, TIME_FORMAT } from "src/constants/OptionLabels";
import { CANCELED, TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import { Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { translatedText } from 'src/common/translations'

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
import { newCourseStore } from "src/zustandStore/NewCourseStore";

type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };
export const column = (
  hasFalseAliasName: boolean,
  t: any
): ExtendedColumnDef<any>[] => {
  const finalColumns = [
    {
      accessorKey: "program_code",
      column_name: t('course_id'),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div className="w-[100px]">{t('course_id')}</div>;
      },
      cell: ({ row }: any) => {
        const router = useRouter();
        return (
          <div
            onClick={() => {
              router.push(`/courses/${row?.original?.id}`);
            }}
            className="w-[100px]"
          >
            <Text className="text-[#7677F4] font-semibold cursor-pointer">
              {row.original.program_code}
            </Text>
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
      cell: ({ row }: any) => {
        return <div className="w-[150px]">{translatedText(row?.original?.program_types?.name)}</div>
      }
    },

    //TODO : for now may-13 release it has to be hidden
    // {
    //   accessorKey: "program_type_alias_names",
    //   column_name: t("new_strings:course_name"),
    //   //These columns are default columns and shouldnt be editable
    //   enableHiding: false,
    //   header: () => {
    //     return <div className="min-w-[150px]">{t("new_strings:course_name")}</div>;
    //   },
    //   cell: ({ row }: any) => {
    //     return <div className="min-w-[150px]">{translatedText(row?.original?.program_type_alias_names?.alias_name)}</div>
    //   }
    // },
    {
      accessorKey: "status",
      column_name: t("course.find_course:course_status"),
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:course_status")}</div>;
      },
      cell: ({ row }: any) => {
        return <div className="min-w-[150px]">{translatedText(row?.original?.status_id?.name)}</div>
      }
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
        // Check if start_date exists or not
        if (row?.original?.start_date) {
          const startDate = format(row?.original?.start_date, "dd MMM, yyyy");
          return (
            <div className="min-w-[150px]">{startDate ? startDate : "-"} </div>
          );
        }
      },
    },
    {
      accessorKey: "state",
      column_name: t("course.find_course:state"),
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:state")}</div>;
      },
      cell: ({ row }: any) => {
        return <div className="min-w-[150px]">{row?.original?.state?.name}</div>;
      },
    },
    {
      accessorKey: "city",
      column_name: t("city"),
      header: () => {
        return <div className="min-w-[150px]">{t("city")}</div>;
      },
      cell: ({ row }: any) => {
        return <div className="min-w-[150px]">{row?.original?.city?.name}</div>;
      },
    },
    {
      accessorKey: "center",
      column_name: t("course.find_course:center"),
      header: () => {
        return <div className="min-w-[150px]">{t("course.find_course:center")}</div>;
      },
      cell: ({ row }: any) => {
        return <div className="min-w-[150px]">{row?.original?.center?.name}</div>
      },
    },
    {
      accessorKey: "program_teachers",
      //These columns are default columns and shouldnt be editable
      enableHiding: false,
      column_name: t('course.participants:view_participant.course_information_tab.Teachers(S)'),
      header: () => {
        return <div className="min-w-[150px]">{t('course.participants:view_participant.course_information_tab.Teachers(S)')}</div>;
      },
      cell: ({ row }: any) => {
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
      column_name: t('program_organizer'),
      header: () => {
        return <div className="min-w-[150px]">{t('program_organizer')}</div>;
      },
      cell: ({ row }: any) => {
        //Mapping all the programOrganizers in the comma separated name
        const organizers = row?.original?.program_organizers?.map(
          (Organizer: any) => Organizer?.users?.contact_id?.full_name
        );

        return (
          <div className="flex flex-wrap min-w-[150px]">
            {/* If organisers present them map them by comma separated other wise it will display - */}
            <div>{organizers ? organizers.join(",  ") : "-"}</div>
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
        const router = useRouter()

        return (
          <div 
            className={`min-w-[150px] text-primary font-semibold ${row?.original?.participant_count === 0 ? '' : 'cursor-pointer'}`} 
            onClick={row?.original?.participant_count !== 0 ? () => router.push(`/courses/${row.original.id}/participants/list`) : undefined}
          >
            {row?.original?.participant_count}
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
        
        return <div className="min-w-[150px]">{translatedText(row?.original?.visibility_id?.name)}</div>
      }
    },
    
    //TODO : for now may-13 release it has to be hidden
    // {
    //   accessorKey: "course_accounting_status",
    //   column_name: t('course_accounting_status'),
    //   header: () => {
    //     return <div className="min-w-[200px]">{t('course_accounting_status')}</div>;
    //   },
    //   cell: ({ row }: any) => {
    //     return (
    //       <div className="min-w-[200px]">
    //         {row?.original?.program_accounting_status_id?.name
    //           ? translatedText(row?.original?.program_accounting_status_id?.name)
    //           : '-'}
    //       </div>
    //     );
    //   },
    // },

    //TODO : for now may-13 release it has to be hidden
    // {
    //   accessorKey: "Course Accounting Closure Date",
    //   column_name: t('course.find_course:course_accounting_closure_date'),
    //   header: () => {
    //     return (
    //       <div className="min-w-[250px]">{t('course.find_course:course_accounting_closure_date')}</div>
    //     );
    //   },
    //   cell: ({ row }: any) => {
    //     return <div className="min-w-[250px]">-</div>;
    //   },
    // },
    {
      accessorKey: "revenue",
      column_name: t('course.view_course:revenue_summary_tab.revenue'),
      header: () => {
        return <div className="min-w-[150px]">{t('course.view_course:revenue_summary_tab.revenue')}</div>;
      },
      cell: ({ row }: any) => {
        return <div className="min-w-[150px]">{row?.original?.revenue}</div>;
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
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

        const dropDownMenuData = DisplayOptions(
          row?.original?.status_id?.id,
          row?.original?.program_accounting_status_id?.id,
          loginUserData?.userData?.user_roles[0]?.role_id?.id
        );

        // here we need this variable to create default values
        const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
          TIME_FORMAT,
          TIME_FORMAT_12_HOURS
        )?.id as number;

        const handleEditCourse = async () => {
          router.push(`/courses/${row.original.id}/edit`);
        };

        /**
         * Handles creating a new course.
         * Retrieves default values for the course with the given ID,
         * sets the retrieved values as the new course data, and
         * switches the view to the new course page.
         */
        const handleCopyCourse = async () => {
          setViewThankyouPage(false);

          let defaultValues = await handleCourseDefaultValues(
            row.original.id,
            timeFormat12HoursId
          );
          // we have to delete schedules when user click on cipy course and other we need to prefill
          defaultValues = _.omit(defaultValues, ["id", "schedules"]);
          setNewCourseData(defaultValues);
          // when we do copy course we have to set the current step to first step
          setCurrentStep(1);
          router.push({ pathname: "/courses/add", query: { action: "Copy" } });
        };

        dropDownMenuData?.unshift({ label: t('course.find_course:view_course_details'), value: 9 });

        const handleSelected = (value: number) => {
          console.log("clicked on", value);

          switch (value) {
            case 1: {
              //Need to navigate to participants list of select course.
              router.push(`/courses/${row.original.id}/participants/list`);
              break;
            }
            // case 2: {
            //   // TODO - Navigate to Register Participant page
            //   router.push("/courses/add");
            //   break;
            // }
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
            // case 6: {
            //   // TODO - Navigate to submit course accounting page
            //   router.push(
            //     `/courses/${row.original.id}?tab=course_accounting_form`
            //   );
            //   break;
            // }
            // case 7: {
            //   // TODO - Navigate to view course accounting page
            //   router.push("/");
            //   break;
            // }
            // case 8: {
            //   // TODO - Navigate to edit course accounting page
            //   router.push("/");
            //   break;
            // }
            case 9: {
              router.push(`/courses/${row.original.id}`);
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
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                                {t('no_button')}
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
                                {t('yes')}
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
                            {t('close')}
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
    }
  ]
  const courseNameIndex = finalColumns.findIndex(finalColumns => finalColumns.column_name === 'Course Name')
  if (hasFalseAliasName && courseNameIndex !== -1) {
    finalColumns.splice(courseNameIndex, 1);
  }
  return finalColumns;
};
