import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "src/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { Input } from "src/ui/input";
import { Label } from "src/ui/label";

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "program_code",
    enableHiding: false,
    header: () => {
      return <div>Course ID</div>;
    },

    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.program_code}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "program_types",
    header: () => {
      return <div>Course Type Name</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.program_types?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_alias_names",
    header: () => {
      return <div>Course Name</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.program_type_alias_names?.alias_name}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <div>Course Status</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.status_id}</div>;
    },
  },
  {
    accessorKey: "state",
    header: () => {
      return <div>State</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.state?.name}</div>;
    },
  },
  {
    accessorKey: "city",
    header: () => {
      return <div>City</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.city?.name}</div>;
    },
  },
  {
    accessorKey: "center",
    header: () => {
      return <div>Center</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.center?.name}</div>;
    },
  },
  {
    accessorKey: "program_teachers",
    header: () => {
      return <div>Teachers</div>;
    },
    cell: ({ row }) => {
      const teachers = row?.original?.program_teachers?.map(
        (teacher: ProgramTeachers) => teacher?.users?.user_name
      );
      return (
        <div>
          <div>{teachers && teachers.join(", ")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "program_organizers",
    header: () => {
      return <div>Organizers</div>;
    },
    cell: ({ row }) => {
      const organizers = row?.original?.program_organizers?.map(
        (Organizer: ProgramOrganizers) => Organizer?.users?.user_name
      );
      return <div>{organizers && organizers.join(",")}</div>;
    },
  },
  {
    accessorKey: "participant_registration",
    header: () => {
      return <div>Attendees</div>;
    },
    cell: ({ row }: any) => {
      return <div>{row?.original?.participant_registration?.length}</div>;
    },
  },
  {
    accessorKey: "visibility_id",
    header: () => {
      return <div>Visibility</div>;
    },
    cell: ({ row }: any) => {
      // const visibility: any = row?.original?.program_details_info?.map(
      //   (details: any) => details?.visibility_id?.value
      // );
      return (
        <div>
          {row?.original?.program_details_info[0]?.visibility_id?.value}
        </div>
      );
    },
  },
  {
    accessorKey: "program_schedules",
    header: () => {
      return <div>Start Date</div>;
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

          return <div>{startDate}</div>;
        }
      }

      // Return empty if no record found or if program_schedules is not available
      return <div>No start date available</div>;
    },
  },
  {
    accessorKey: "course_accounting_status",
    header: () => {
      return <div>Course Accounting Status</div>;
    },
    cell: ({ row }: any) => {
      return (
        <div>
          {row?.original?.course_accounting_status
            ? row?.original?.course_accounting_status
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Course Accounting Closure Date",
    header: () => {
      return <div>Course Accounting Closure Date</div>;
    },
    cell: ({ row }: any) => {
      return <div>-</div>;
    },
  },
  {
    accessorKey: "revenue",
    header: () => {
      return <div>Revenue</div>;
    },
    cell: ({ row }: any) => {
      return <div>-</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter()
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const dropDownMenuData=["View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "Submit/Edit Course Accounting Form"]

        const handleSelected = (value:string) => {
         switch(value){
          case 'View Participants':
            {
              // TODO - Navigate to Participants Listing page
              router.push('/')
              break;
            }
          case 'Register Participant':
            {
              // TODO - Navigate to Register Participant page
              router.push('/Courses/FindCourse')
              break;
            }
          case 'Cancel Course':
            {
              setIsDialogOpen(true)
            }
          default :
          {
            console.log("other options")
          }
         }
        }
      return (
        <div className="flex justify-center text-primary">
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{
              dropDownMenuData.map((data)=> <DropdownMenuItem onClick={()=>handleSelected(data)}>{data}</DropdownMenuItem> )
            }
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
      );
    },
  },
];
