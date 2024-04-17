import EditIcon from "@public/assets/EditIcon";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useTable } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { CardValue, TableHeader, Text } from "src/ui/TextTags";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "src/ui/accordion";
import { Button } from "src/ui/button";
import { formatDateString } from "src/utility/DateFunctions";
import { BaseTable } from "../findCourse/BaseTable";


const ViewCourseAccountingFormTab = ({ programId }: { programId: number }) => {
    return (
        <div>
            {/* Edit button */}
            <div className="ml-auto max-w-fit">
                <Button className="items-end gap-3 " variant={"link"}>
                    <EditIcon />
                    <p>Edit Accounting Form</p>
                </Button>
            </div>
            <Accordion type="multiple">
                {/* Course Information Accordion */}
                {/** // TODO integrate the course details accordion */}
                {/* Revenue details Accordion */}
                <AccordionItem value="revenueDetails" className="px-4 mt-6 border rounded-3xl">
                    <AccordionTrigger className="font-semibold border-b hover:no-underline text-primary">
                        Revenue Details
                    </AccordionTrigger>
                    <AccordionContent className="py-2">
                        <RevenueDetailsAccordionContent programId={programId} />
                    </AccordionContent>
                </AccordionItem>

                {/* Expense Details Accordion */}
                <AccordionItem value="expenseDetails" className="px-4 mt-6 border rounded-3xl">
                    <AccordionTrigger className="font-semibold border-b hover:no-underline text-primary">
                        Expense Details
                    </AccordionTrigger>
                    <AccordionContent className="py-2">
                        <ExpenseDetailsAccordionContent programId={programId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {/* Action Buttons */}
            <div className="flex w-[60%] ml-auto mt-6">
                <div className="flex items-center gap-4">
                    <Button className="bg-white border text-primary border-primary">Back</Button>
                    <Button>Cancel</Button>
                </div>
                <Button className="ml-auto">
                    <p>Export</p> <ChevronDown />
                </Button>
            </div>
        </div>
    );
};

export default ViewCourseAccountingFormTab;

const RevenueDetailsAccordionContent = ({ programId }: { programId: number }) => {
    const { tableQueryResult: offlineRevenueData } = useTable({
        resource: "program_offline_revenue",
        meta: {
            select: "date, amount, notes",
        },
        pagination: {
            pageSize: 1000,
        },
        filters: {
            permanent: [
                {
                    field: "program_id",
                    operator: "eq",
                    value: programId,
                },
            ],
        },
    });
    return (
        <div>
            {offlineRevenueData?.isLoading ? (
                <LoadingIcon />
            ) : (
                <div>
                    {/* Summary cards */}
                    {/* //Todo : Requirement is not clear  */}
                    {/* Deposit of Offline Revenue Table */}
                    <TableHeader>Deposit of Offline Revenue</TableHeader>
                    <BaseTable
                        current={1}
                        tableStyles={{
                            table: "justify-start",
                            rowStyles: "!important border-none",
                        }}
                        columns={offlineRevenueTableColumns}
                        data={offlineRevenueData?.data?.data || []}
                    />
                    {/* Revenue Details - Participants table */}
                    <TableHeader className="mt-[10px]">Revenue Details - Participants</TableHeader>
                    {/* //Todo : Requirement is not clear */}
                </div>
            )}
        </div>
    );
};

type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

export const offlineRevenueTableColumns: ExtendedColumnDef<any>[] = [
    {
        accessorKey: "date",
        column_name: "Deposit date",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Deposit date</TableHeader>;
        },
        cell: ({ row }) => {
            const date = formatDateString(new Date(row.original.date.slice(0, 10)))
            return (
                <Text className="min-w-[150px]">
                    {date}
                </Text>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Deposit amount (EUR)",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Deposit amount (EUR)</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.amount}>
                    <Text className="max-w-[250px] truncate">{row.original.amount}</Text>
                </abbr>

            );
        },
    },
    {
        accessorKey: "notes",
        column_name: "Notes",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Notes</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.notes}>
                    <Text className="max-w-[250px] truncate">{row.original.notes}</Text>
                </abbr>


            );
        },
    },

];

const ExpenseDetailsAccordionContent = ({ programId }: { programId: number }) => {
    const { tableQueryResult: changeLogData } = useTable({
        resource: "program_accounting_activity",
        meta: {
            select: "*,user_id(contact_id(full_name)), caf_status_id(id,value) ,created_at ,comment",
        },
        pagination: {
            pageSize: 1000,
        },
        filters: {
            permanent: [
                {
                    field: "program_id",
                    operator: "eq",
                    value: programId,
                },
            ],
        },
    });

    // TODO need to do api call for expense details after tables are came
    return (
        <div>
            {changeLogData?.isLoading ? (
                <LoadingIcon />
            ) : (
                <div>
                    {/* Expense Details table */}
                    <BaseTable
                        current={1}
                        tableStyles={{
                            table: "justify-start",
                            rowStyles: "!important border-none",
                        }}
                        columns={expenseDetailsColumns}
                        data={changeLogData?.data?.data || []}
                    />
                    {/* Expense Total Calculations */}
                    <div className="border flex mt-4 rounded-xl ">
                        <div className="flex-1 flex border-r py-2 px-4">
                            <TableHeader className="flex-[0.8]">Reimbursable Total:</TableHeader>
                            <p className="flex-[0.2]">0.00</p>
                        </div>
                        <div className="flex-1 flex border-r p-2">
                            <TableHeader className="flex-[0.8]">Reimbursable Total:</TableHeader>
                            <p className="flex-[0.2]">0.00</p>
                        </div>
                        <div className="flex-1 flex  p-2">
                            <TableHeader className="flex-[0.8]">Reimbursable Total:</TableHeader>
                            <p className="flex-[0.2]">0.00</p>
                        </div>

                    </div>
                    {/* Reimbursement Summary Table */}
                    <p className="font-semibold mt-4">Reimbursement Summary</p>
                    <BaseTable
                        current={1}
                        tableStyles={{
                            table: "justify-start",
                            rowStyles: "!important border-none",
                        }}
                        columns={reimbursementSummaryColumns}
                        data={changeLogData?.data?.data || []}
                    />
                    <p className="text-xs">
                        <span className="font-medium ">Note:</span> Please enter a complete and accurate your bank account
                        information above for each person to be reimbursed to ensure that they receive their reimbursement.
                    </p>
                    {/* Reimbursement Summary Total  Calculations */}
                    <div className="border flex mt-4 rounded-xl ">
                        <div className="flex-[1.5] flex border-r py-2 px-4">
                            <TableHeader className="flex-[0.8] font-semibold">Total Requested:</TableHeader>
                            <p className="flex-[0.2]">0.00</p>
                        </div>
                        <div className="flex-1 flex p-2">
                            <p className="flex-[0.8]"></p>
                        </div>


                    </div>
                    {/* Expense Summary and Details */}
                    {/* Expense Summary */}
                    <div className="mt-4">

                        <p className="font-semibold">Expense Summary and Details</p>
                        <div className="border rounded-lg px-4 py-6 mt-2">
                            <TableHeader className="font-semibold">Expense Summary </TableHeader>
                            <div className="flex border-b py-2">
                                <Text className="flex-[0.4]">Expense category</Text>
                                <Text className="flex-[0.4]">Amount (EUR)</Text>
                            </div>
                            {

                                [1, 2].map(() => {
                                    return (
                                        <div className="flex border-b py-2">
                                            <Text className="flex-[0.4]">key</Text>
                                            <Text className="flex-[0.4]">value</Text>
                                        </div>

                                    )
                                })
                            }
                            <div className="flex border-b py-2">
                                <TableHeader className="flex-[0.4]">Total</TableHeader>
                                <CardValue className="flex-[0.4]">value</CardValue>
                            </div>
                            <div className="flex  py-2">
                                <Text className="flex-[0.4]">Current Expense:</Text>
                                <Text className="flex-[0.4]">60.00 (10.00%)</Text>
                            </div>
                            <div className="flex  py-2">
                                <Text className="flex-[0.4]">Allowed Expense Limit</Text>
                                <Text className="flex-[0.4]">180.00 (30.00%)</Text>
                            </div>

                        </div>
                    </div>
                    {/* Expense  Details */}
                    <p className="font-semibold">Expense Summary and Details</p>
                    <BaseTable
                        current={1}
                        tableStyles={{
                            table: "justify-start",
                            rowStyles: "!important border-none",
                        }}
                        columns={changeLogSummaryColumns}
                        data={changeLogData?.data?.data || []}
                    />
                </div>
            )}
        </div>
    );
};

export const changeLogSummaryColumns: ExtendedColumnDef<any>[] = [
    {
        accessorKey: "user_id",
        column_name: "Username",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Username</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.user_id.contact_id.full_name}>
                    <Text className="max-w-[150px] truncate">{row.original.user_id.contact_id.full_name}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "created_at",
        column_name: "Timestamp",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Timestamp</TableHeader>;
        },
        cell: ({ row }) => {
            const date = formatDateString(new Date(row.original.created_at.slice(0, 10)))
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">{date}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "caf_status_id",
        column_name: "Action",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Action</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={`${row.original.caf_status_id.value} (${row.original.comment})`}>
                    <Text className="max-w-[450px] truncate">{`${row.original.caf_status_id.value} (${row.original.comment})`}</Text>
                </abbr>
            );
        },
    },

]


export const reimbursementSummaryColumns: ExtendedColumnDef<any>[] = [
    {
        accessorKey: "Person Requesting Reimbursement",
        column_name: "Person Requesting Reimbursement",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[300px]">Person Requesting Reimbursement</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title="jhansi">
                    <Text className="max-w-[250px] truncate">jhansiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "Email",
        column_name: "Email",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Email</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">jhansi@gmail.com</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "Phone",
        column_name: "Phone",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Phone</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">9701295781</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "Mailing Address to Send Reimbursement",
        column_name: "Mailing Address to Send Reimbursement",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[300px]">Mailing Address to Send Reimbursement</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[300px] truncate">jhansi,nagarajuuuuuuuuuuuu</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Amount Requested (EUR)",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[250px]">Amount Requested (EUR)</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[250px] truncate">4000</Text>
                </abbr>
            );
        },
    },

]

export const expenseDetailsColumns: ExtendedColumnDef<any>[] = [
    {
        accessorKey: "expense_category",
        column_name: "Expense Category",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Expense Category</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[200px] truncate">jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "details",
        column_name: "Details",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Details</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">Jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "receipt_id",
        column_name: "Receipt ID",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Receipt ID</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">Jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "purchase_date",
        column_name: "Purchase Date",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Purchase Date</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Amount (EUR) (i)",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Amount (EUR) (i)</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Amount Requested (EUR)",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Amount Requested (EUR)</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "reimbursable",
        column_name: "Reimbursable",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Reimbursable</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">jhansi</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "Name of Person to Reimburse",
        column_name: "Name of Person to Reimburse",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Name of Person to Reimburse</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline">
                    <Text className="max-w-[150px] truncate">Jhansi</Text>
                </abbr>
            );
        },
    },

]
