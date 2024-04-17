import EditIcon from "@public/assets/EditIcon";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useTable } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
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
                    <p className="font-semibold">Deposit of Offline Revenue</p>
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
                    <p className="font-semibold mt-[10px]">Revenue Details - Participants</p>
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
            return <div className="min-w-[150px]">Deposit date</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            const date = formatDateString(new Date(row.original.date.slice(0, 10)))
            console.log(date, 'date')
            return (
                <div className="min-w-[150px]">
                    {date}
                </div>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Deposit amount (EUR)",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Deposit amount (EUR)</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    {row.original.amount}
                </div>
            );
        },
    },
    {
        accessorKey: "notes",
        column_name: "Notes",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Notes</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    {row.original.notes}
                </div>
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
                            <p className="flex-[0.8] font-semibold">Reimbursable Total:</p>
                            <p className="flex-[0.2]">0.00</p>
                        </div>
                        <div className="flex-1 flex border-r p-2">
                            <p className="flex-[0.8] font-semibold">Reimbursable Total:</p>
                            <p className="flex-[0.2]">0.00</p>
                        </div>
                        <div className="flex-1 flex  p-2">
                            <p className="flex-[0.8] font-semibold">Reimbursable Total:</p>
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
                            <p className="flex-[0.8] font-semibold">Total Requested:</p>
                            <p className="flex-[0.2]">0.00</p>
                        </div>
                        <div className="flex-1 flex p-2">
                            <p className="flex-[0.8] font-semibold"></p>
                        </div>
                       

                    </div>
                    {/* Expense Summary and Details */}
                    {/* Expense Summary */}
                    <div className="mt-4">

                        <p className="font-semibold">Expense Summary and Details</p>
                        <div className="border rounded-lg px-4 py-6 mt-2">
                            <p className="font-semibold">Expense Summary </p>
                            <div className="flex border-b py-2">
                                 <p className="flex-[0.4]">Expense category</p>
                                 <p className="flex-[0.4]">Amount (EUR)</p>
                             </div>
                            {
                               
                                [1, 2].map(() => {
                                    return (
                                        <div className="flex border-b py-2">
                                            <p className="flex-[0.4]">key</p>
                                            <p className="flex-[0.4]">value</p>
                                        </div>

                                    )
                                })
                            }
                            <div className="flex border-b py-2">
                                <p className="flex-[0.4] font-semibold">Total</p>
                                <p className="flex-[0.4]">value</p>
                            </div>
                            <div className="flex  py-2">
                                <p className="flex-[0.4]">Current Expense:</p>
                                <p className="flex-[0.4]">60.00 (10.00%)</p>
                            </div>
                            <div className="flex  py-2">
                                <p className="flex-[0.4]">Allowed Expense Limit</p>
                                <p className="flex-[0.4]">180.00 (30.00%)</p>
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
            return <div className="min-w-[150px]">Username</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="min-w-[150px]">
                    {row.original.user_id.contact_id.full_name}
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        column_name: "Timestamp",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Timestamp</div>;
        },
        cell: ({ row }) => {
            const date = formatDateString(new Date(row.original.created_at.slice(0, 10)))
            return (
                <div className="min-w-[150px]">
                    {date}
                </div>
            );
        },
    },
    {
        accessorKey: "caf_status_id",
        column_name: "Action",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Action</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="min-w-[150px]">
                    {`${row.original.caf_status_id.value} (${row.original.comment})`}
                </div>
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
            return <div className="min-w-[150px]">Person Requesting Reimbursement</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "Email",
        column_name: "Email",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Email</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "Phone",
        column_name: "Phone",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Phone</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "Mailing Address to Send Reimbursement",
        column_name: "Mailing Address to Send Reimbursement",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Mailing Address to Send Reimbursement</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Amount Requested (EUR)",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Amount Requested (EUR)</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
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
            return <div className="min-w-[150px]">Expense Category</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "details",
        column_name: "Details",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Details</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "receipt_id",
        column_name: "Receipt ID",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Receipt ID</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "purchase_date",
        column_name: "Purchase Date",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Purchase Date</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Amount (EUR) (i)",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Amount (EUR) (i)</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "amount",
        column_name: "Amount Requested (EUR)",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Amount Requested (EUR)</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "reimbursable",
        column_name: "Reimbursable",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Reimbursable</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },
    {
        accessorKey: "Name of Person to Reimburse",
        column_name: "Name of Person to Reimburse",
        enableHiding: false,
        header: () => {
            return <div className="min-w-[150px]">Name of Person to Reimburse</div>;
        },
        cell: ({ row }) => {
            console.log(row, 'row')
            return (
                <div className="min-w-[150px]">
                    Jhansi
                </div>
            );
        },
    },

]
