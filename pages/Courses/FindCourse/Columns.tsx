import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import { DisplayOptions } from "@components/courseBusinessLogic";
import { useGetIdentity, useOne } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "src/ui/button";
import { Dialog, DialogContent } from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

export const columns: ExtendedColumnDef<any>[] = [
  {
    accessorKey: "program_code",
    column_name: "Course ID",
    enableHiding: false,
    header: () => {
      return <div className="w-[100px]">Course ID</div>;
    },
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div
          onClick={() => {
            router.push(`/Courses/ViewCourse/${row?.original?.id}`);
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
    column_name: "Course Type Name",
    enableHiding: false,
    header: () => {
      return <div className="w-[150px]">Course Type Name</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-[150px]">{row?.original?.program_types?.name}</div>
      );
    },
  },
  {
    accessorKey: "program_type_alias_names",
    column_name: "Course Name",
    enableHiding: false,
    header: () => {
      return <div className="min-w-[150px]">Course Name</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-[150px]">
          {row?.original?.program_type_alias_names?.alias_name}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    column_name: "Course Status",
    enableHiding: false,
    header: () => {
      return <div className="min-w-[150px]">Course Status</div>;
    },
    cell: ({ row }) => {
      console.log("hey status", row?.original?.status_id);
      return (
        <div className="min-w-[150px]">{row?.original?.status_id?.value}</div>
      );
    },
  },
  {
    accessorKey: "program_schedules",
    enableHiding: false,
    column_name: "Start Date",
    header: () => {
      return <div className="min-w-[150px]">Start Date</div>;
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
    column_name: "State",
    header: () => {
      return <div className="min-w-[150px]">State</div>;
    },
    cell: ({ row }) => {
      return <div className="min-w-[150px]">{row?.original?.state?.name}</div>;
    },
  },
  {
    accessorKey: "city",
    column_name: "City",
    header: () => {
      return <div className="min-w-[150px]">City</div>;
    },
    cell: ({ row }) => {
      return <div className="min-w-[150px]">{row?.original?.city?.name}</div>;
    },
  },
  {
    accessorKey: "center",
    column_name: "Center",
    header: () => {
      return <div className="min-w-[150px]">Center</div>;
    },
    cell: ({ row }) => {
      return <div className="min-w-[150px]">{row?.original?.center?.name}</div>;
    },
  },
  {
    accessorKey: "program_teachers",
    enableHiding: false,
    column_name: "Teachers",
    header: () => {
      return <div className="min-w-[150px]">Teachers</div>;
    },
    cell: ({ row }) => {
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
    column_name: "Organizers",
    header: () => {
      return <div className="min-w-[150px]">Organizers</div>;
    },
    cell: ({ row }) => {
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
    column_name: "Attendees",
    header: () => {
      return <div>Attendees</div>;
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
    column_name: "Visibility",
    header: () => {
      return <div>Visibility</div>;
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
    column_name: "Course Accounting Status",
    header: () => {
      return <div className="min-w-[200px]">Course Accounting Status</div>;
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
    column_name: "Course Accounting Closure Date",
    header: () => {
      return (
        <div className="min-w-[250px]">Course Accounting Closure Date</div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="min-w-[250px]">-</div>;
    },
  },
  {
    accessorKey: "revenue",
    column_name: "Revenue",
    enableHiding: false,
    header: () => {
      return <div className="min-w-[150px]">Revenue</div>;
    },
    cell: ({ row }: any) => {
      return <div className="min-w-[150px]">-</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { setViewPreviewPage, setNewCourseData } = newCourseStore();

      const router = useRouter();
      const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        const defaultValues = await handleCourseDefaultValues(row.original.id);
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
        let defaultValues = await handleCourseDefaultValues(row.original.id);
        // we have to delete schedules when user click on cipy course and other we need to prefill
        defaultValues = _.omit(defaultValues, ["schedules"]);
        setNewCourseData(defaultValues);
        router.push("/Courses/NewCourse");
      };

      dropDownMenuData?.unshift({ label: "View Course", value: 10 });

      const handleSelected = (value: number) => {
        console.log("clicked on", value);

        switch (value) {
          case 1: {
            // TODO - Navigate to Participant Listing page
            router.push("/");
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
            router.push(`/Courses/ViewCourse/${[row.original.id]}`);
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
                <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <Button>Yes</Button>
                    <Button>No</Button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
];
