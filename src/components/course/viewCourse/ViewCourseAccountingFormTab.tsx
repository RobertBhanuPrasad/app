import EditIcon from "@public/assets/EditIcon";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useList, useOne, useTable } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CardValue, Header, TableHeader, Text } from "src/ui/TextTags";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "src/ui/accordion";
import { Button } from "src/ui/button";
import { supabaseClient } from "src/utility";
import { formatDateString } from "src/utility/DateFunctions";
import { BaseTable } from "../findCourse/BaseTable";

const ViewCourseAccountingFormTab = ({ programId }: { programId: number }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname()

    const { replace } = useRouter();

    function setParamValue(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("current_section", term);
        }
        replace(`${pathname}/course-accounting-form?${params.toString()}`);
    }


    return (
        <div>
            {/* Edit button */}
            <div className="ml-auto max-w-fit">
                {/* when we click on edit icon we are navigate to revenue section page*/}
                    <Button className="items-end gap-3" variant={"link"}
                        onClick={() => {
                        setParamValue("revenue")
                    }}
                    >
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
                <div className="flex justify-center items-center h-32">
                    <LoadingIcon />
                </div>
            ) : (
                <div>
                    {/* Summary cards */}
                    {/* //Todo : Requirement is not clear  */}
                    {/* Deposit of Offline Revenue Table */}
                    <Header>Deposit of Offline Revenue</Header>
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
                    <Header className="mt-[10px]">Revenue Details - Participants</Header>
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

    /**
     * To fetch data from the "program_accounting_activity" table to show the change log table.
     * Retrieves accounting activity data related to a specific program ID.
     */
    const { tableQueryResult: changeLogData } = useTable({
        // Specify the resource (table) from which to fetch data
        resource: "program_accounting_activity",
        // Define metadata options for the query
        meta: {
            // Specify fields to select, including user information, status, timestamps, and comments
            select: "*, user_id(contact_id(full_name)), caf_status_id(id, value), created_at, comment",
        },
        // Set pagination options, such as the page size
        pagination: {
            pageSize: 1000,
        },
        // Define filters to apply to the query
        filters: {
            // Apply permanent filters to retrieve data related to a specific program ID
            permanent: [
                {
                    // Filter by the "program_id" field
                    field: "program_id",
                    // Use the equality operator to match the program ID
                    operator: "eq",
                    // Specify the program ID value
                    value: programId,
                },
            ],
        },
    });


    /**
     * To fetch data from the "program_expenses" table to show data at expense details table.
     * Retrieves expense data related to a specific program ID.
     */
    const { tableQueryResult: programExpensesData } = useTable({
        // Specify the resource (table) from which to fetch data
        resource: "program_expenses",
        // Define metadata options for the query
        meta: {
            // Select all fields from the "program_expenses" table
            select: "*",
        },
        // Set pagination options, such as the page size
        pagination: {
            pageSize: 1000,
        },
        // Define filters to apply to the query
        filters: {
            // Apply permanent filters to retrieve data related to a specific program ID
            permanent: [
                {
                    // Filter by the "program_id" field
                    field: "program_id",
                    // Use the equality operator to match the program ID
                    operator: "eq",
                    // Specify the program ID value
                    value: programId,
                },
            ],
        },
    });

    /**
     * To fetch data for a specific program from the "program" table.
     * Retrieves information about the program's organization ID.
     */
    const { data: courseData } = useOne({
        // Specify the resource (table) from which to fetch data
        resource: 'program',
        // Provide the ID of the program to fetch data for
        id: programId,
        // Define metadata options for the query
        meta: {
            // Select the organization ID field
            select: 'organization_id'
        }
    });

    /**
     * To fetch data from the "course_accounting_config" table.
     * Retrieves expense limit percentage data based on the organization ID retrieved from the program data.
     */
    const { data: expenseLimitPercentageData } = useList({
        // Specify the resource (table) from which to fetch data
        resource: 'course_accounting_config',
        // Define configuration options for the query, including filters
        config: {
            // Define filters to retrieve data related to the organization ID
            filters: [
                {
                    // Filter by the "organization_id" field
                    field: 'organization_id',
                    // Use the equality operator to match the organization ID from the program data
                    operator: 'eq',
                    // Specify the organization ID obtained from the program data
                    value: courseData?.data?.organization_id
                }
            ]
        },
        // Define metadata options for the query
        meta: {
            // Select the individual expense limit field
            select: 'Individual_expense_limit'
        }
    });

    // Define state for holding participant data
    const [participantData, setParticipantData] = useState<any>()
    // Function to fetch participant data from server
    const fetchParticipantSummaryData = async () => {
        try {
            // Invoke serverless function to get participant summary data
            const { data } = await supabaseClient.functions.invoke('get_program_participant_summary', {
                method: 'POST',
                body: {
                    program_id: programId
                }
            })
            // Set fetched participant data to state
            setParticipantData(data)
        } catch (error) {
            // Handle any errors that occur during fetching data
            console.error('Error fetching fee data:', error)
        }
    }
    // Fetch participant data when component mounts
    useEffect(() => {
        fetchParticipantSummaryData()
    }, [])

    // Get total revenue from participant data
    const totalRevenue: number = participantData?.income

    /**
     * Filter program expenses data to retrieve reimbursable expenses.
     * It filters the program expenses data to include only expenses that are marked as reimbursable.
     * Uses lodash's _.filter() method for filtering.
     */
    const reimbursableExpenseData: any[] = _.filter(programExpensesData?.data?.data, (obj) => obj.is_reimbursable === true);

    /**
    * Calculate the total amount of reimbursable expenses.
    * It calculates the total amount of expenses that are marked as reimbursable.
    * Uses lodash's _.sumBy() method to sum the "amount" property of each expense in the reimbursable expense data.
    */
    const reimbursableTotal: number = _.sumBy(reimbursableExpenseData, "amount");

    /**
     * Calculate the total amount of expenses.
     * It calculates the total amount of all expenses in the program expenses data.
     * Uses lodash's _.sumBy() method to sum the "amount" property of each expense in the program expenses data.
     */
    const totalExpense: number = _.sumBy(programExpensesData?.data?.data, "amount");

    /**
     * Retrieve the expense limit percentage.
     * It retrieves the individual expense limit percentage from the expense limit percentage data.
     * The percentage value is typically stored in the "Individual_expense_limit" property of the first item in the data array.
     */
    const expenseLimitPercentage: number = expenseLimitPercentageData?.data?.[0]?.Individual_expense_limit;

    /**
     * Calculate the allowed expense amount based on total revenue and expense limit percentage.
     * It calculates the maximum allowed expense amount based on the total revenue and the expense limit percentage.
     * If both total revenue and expense limit percentage are available, it computes the allowed amount as a percentage of the total revenue.
     * If either total revenue or expense limit percentage is unavailable, the allowed amount is set to 0.
     */
    const allowedExpenseAmount: number = totalRevenue && expenseLimitPercentage ? (totalRevenue / 100) * expenseLimitPercentage : 0;

    /**
     * Calculate the current expense percentage relative to total revenue.
     * It computes the percentage of total revenue that represents the current total expenses.
     * If both total expense and total revenue are available, it calculates the ratio of total expense to total revenue.
     * The result is expressed as a percentage.
     * If either total expense or total revenue is unavailable, the current expense percentage is set to 0.
     */
    const currentExpensePercentage: number = totalExpense && totalRevenue ? (totalExpense / totalRevenue) * 100 : 0;

    return (
        <div>
            {changeLogData?.isLoading || programExpensesData?.isLoading ? (
                <div className="flex justify-center items-center h-32">
                    <LoadingIcon />
                </div>
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
                        data={programExpensesData?.data?.data || []}
                    />
                    {/* Expense Total Calculations */}
                    <div className="border flex mt-6 rounded-xl ">
                        <div className="flex-1 flex border-r py-2 px-4">
                            <Text className="flex-[0.8] font-bold text-[#383838] text-base">Reimbursable Total:</Text>
                            <p className="flex-[0.2] font-bold text-[#383838] text-base">{reimbursableTotal}</p>
                        </div>
                        <div className="flex flex-1 p-2 border-r">
                            <Text className="flex-[0.8] font-bold text-[#383838] text-base">Non-reimbursable Total:</Text>
                            <p className="flex-[0.2] font-bold text-[#383838] text-base">{totalExpense - reimbursableTotal}</p>
                        </div>
                        <div className="flex flex-1 p-2">
                            <Text className="flex-[0.8] font-bold text-[#383838] text-base">Total:</Text>
                            <p className="flex-[0.2] font-bold text-[#383838] text-base">{totalExpense}</p>
                        </div>

                    </div>
                    {/* Reimbursement Summary Table */}
                    <Header className="mt-6">Reimbursement Summary</Header>
                    <BaseTable
                        current={1}
                        tableStyles={{
                            table: "justify-start",
                            rowStyles: "!important border-none",
                        }}
                        columns={reimbursementSummaryColumns}
                        data={reimbursableExpenseData || []}
                    />
                    <p className="text-xs text-[#666666] font-medium italic mt-2">
                        <span className="font-semi-bold text-[#666666] text-xs">Note:</span> Please enter a complete and accurate your bank account
                        information above for each person to be reimbursed to ensure that they receive their reimbursement.
                    </p>
                    {/* Reimbursement Summary Total  Calculations */}
                    <div className="border flex mt-4 rounded-xl ">
                        <div className="flex-[1.5] flex border-r py-2 px-4">
                            <Text className="flex-[0.8] font-bold text-[#383838] text-base">Total Requested:</Text>
                            <Text className="flex-[0.2] font-bold text-[#383838] text-base">{reimbursableTotal}</Text>
                        </div>
                        <div className="flex-1 flex p-2">
                            <p className="flex-[0.8]"></p>
                        </div>


                    </div>
                    {/* Expense Summary and Details */}
                    {/* Expense Summary */}
                    <div className="mt-6">

                        <Header>Expense Summary and Details</Header>
                        <div className="border rounded-lg px-4 py-6 mt-2">
                            <Text className="font-semibold text-[#454545] text-lg">Expense Summary </Text>
                            <div className="flex border-b py-2 mt-2">
                                <Text className="flex-[0.4] text-[#383838] font-normal text-base">Expense category</Text>
                                <Text className="flex-[0.4] text-[#898989] font-normal text-base">Amount (EUR)</Text>
                            </div>
                            {programExpensesData?.data?.data?.map((expense) => {
                                return (
                                    <div className="flex py-2 border-b" key={expense?.id}>
                                        <Text className="flex-[0.4] text-[#383838] font-normal text-base">{expense?.expense_category_id}</Text>
                                        <Text className="flex-[0.4] text-[#898989] font-normal text-base">{expense?.amount}</Text>
                                    </div>
                                );
                            })}
                            <div className="flex py-2 border-b mt-2">
                                <Text className="flex-[0.4] text-[#383838] font-bold text-base">Total</Text>
                                <Text className="flex-[0.4] text-[#898989] font-bold text-base">{totalExpense}</Text>
                            </div>
                            <div className="flex  py-2">
                                <Text className="flex-[0.4] text-[#383838] font-normal text-base">Current Expense:</Text>
                                <Text className="flex-[0.4] text-[#898989] font-normal text-base">
                                    {totalExpense} ({currentExpensePercentage}%)
                                </Text>
                            </div>
                            <div className="flex  py-2">
                                <Text className="flex-[0.4] text-[#383838] font-normal text-base">Allowed Expense Limit</Text>
                                <Text className="flex-[0.4]">
                                    {allowedExpenseAmount} ({expenseLimitPercentage}%)
                                </Text>
                            </div>

                        </div>
                    </div>
                    {/* Expense  Details */}
                    <Header className="mt-6">Expense Summary and Details</Header>
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
                    <Text className="max-w-[250px] truncate">{row.original.reimburse_person_user_id}</Text>
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
                    <Text className="max-w-[150px] truncate">{row.original.email}</Text>
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
                    <Text className="max-w-[150px] truncate">{row.original.phone}</Text>
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
                    <Text className="max-w-[300px] truncate">{row.original.mailing_address}</Text>
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
                    <Text className="max-w-[250px] truncate">{row.original.amount}</Text>
                </abbr>
            );
        },
    },

]

export const expenseDetailsColumns: ExtendedColumnDef<any>[] = [
    {
        accessorKey: "expense_category_id",
        column_name: "Expense Category",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Expense Category</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.expense_category_id}>
                    <Text className="max-w-[200px] truncate">{row.original.expense_category_id}</Text>
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
                <abbr className="no-underline" title={row.original.details}>
                    <Text className="max-w-[150px] truncate">{row.original.details}</Text>
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
                <abbr className="no-underline" title={row.original.receipt_id}>
                    <Text className="max-w-[150px] truncate">{row.original.receipt_id}</Text>
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
                <abbr className="no-underline" title={row.original.purchase_date}>
                    <Text className="max-w-[150px] truncate">{row.original.purchase_date}</Text>
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
                <abbr className="no-underline" title={row.original.amount}>
                    <Text className="max-w-[150px] truncate">{row.original.amount}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "is_reimbursable",
        column_name: "Reimbursable",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Reimbursable</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.is_reimbursable ? 'Yes' : 'No'}>
                    <Text className="max-w-[150px] truncate">{row.original.is_reimbursable ? 'Yes' : 'No'}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "reimburse_person_user_id",
        column_name: "Name of Person to Reimburse",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Name of Person to Reimburse</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.reimburse_person_user_id}>
                    <Text className="max-w-[150px] truncate">{row.original.reimburse_person_user_id}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "payment_method_id",
        column_name: "Payment Method",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Payment Method</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.payment_method_id}>
                    <Text className="max-w-[150px] truncate">{row.original.payment_method_id}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "vat_condition_id",
        column_name: "VAT Condition",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">VAT Condition</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.vat_condition_id}>
                    <Text className="max-w-[150px] truncate">{row.original.vat_condition_id}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "vendor_tax_id",
        column_name: "VAT Tax ID",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">VAT Tax ID</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.vendor_tax_id}>
                    <Text className="max-w-[150px] truncate">{row.original.vendor_tax_id}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "vendor_name",
        column_name: "Vendor Name",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Vendor Name</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.vendor_name}>
                    <Text className="max-w-[150px] truncate">{row.original.vendor_name}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "vat_rate_id",
        column_name: "VAT Rate",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">VAT Rate</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.vat_rate_id}>
                    <Text className="max-w-[150px] truncate">{row.original.vat_rate_id}</Text>
                </abbr>
            );
        },
    },
    {
        accessorKey: "expense_reciept_url",
        column_name: "Receipt Image",
        enableHiding: false,
        header: () => {
            return <TableHeader className="min-w-[150px]">Receipt Image</TableHeader>;
        },
        cell: ({ row }) => {
            return (
                <abbr className="no-underline" title={row.original.expense_reciept_url}>
                    <Text className="max-w-[150px] truncate">{row.original.expense_reciept_url}</Text>
                </abbr>
            );
        },
    },
]
