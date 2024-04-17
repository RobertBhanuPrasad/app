import Add from "@public/assets/Add";
import Delete from "@public/assets/Delete";
import Exclamation from "@public/assets/Exclamation";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "src/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "src/ui/dialog";
import { Input } from "src/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { useList, useOne, useSelect } from "@refinedev/core";
import { Header } from "src/ui/TextTags";
import { TableHeader } from "src/ui/TextTags";
import { DateField } from "src/ui/DateField";
import {
  RadioGroup,
  RadioGroupCircleItem,
  RadioGroupItem,
} from "src/ui/radio-group";
import { Label } from "src/ui/label";
import classNames from "classnames";
import { supabaseClient } from "src/utility";
import _ from "lodash";
import React from "react";
import { useRouter } from "next/router";
export const ExpenseDetails = () => {
  const { fields, append, remove } = useFieldArray({
    name: "program_expenses",
  });
  const { watch } = useFormContext();

  // formData is a constant we can store the form data which is getting from the watch() from useFormContext
  const formData = watch();

  useEffect(() => {
    // If there is no data for the program_expenses in form then we will append fields with undefined
    if (!formData?.program_expenses || formData?.program_expenses.length <= 0) {
      append(undefined);
    }
  }, []);

  // query is the destructured query data in the useRouter
  const { query } = useRouter();

  // The programData is the data from the program table from the id we have from the router
  const { data: programData } = useOne({
    resource: "program",
    id: query?.id as string,
  });

  // settingsData is the will get from the course_accounting_config table based on the organization from the programData
  const { data: settingsData } = useList({
    resource: "course_accounting_config",
    config: {
      filters: [
        {
          field: "organization_id",
          operator: "eq",
          value: programData?.data?.organization_id,
        },
      ],
    },
  });

  //These are the columns to display in the Expense Details part
  const columns = [
    {
      field_name: "Expense_category",
      component: <ExpenseCategory index={0} />,
      className: "min-w-[250px] px-[12px]",
    },
    {
      field_name: "Details",
      component: <Details index={0} />,
      className: "min-w-[250px] px-[12px]",
    },
    {
      field_name: "Receipt_Id",
      component: <ReceiptId index={0} />,
      className: "min-w-[130px] max-w-[130px] px-[12px]",
    },
    {
      field_name: "Purchase_date",
      component: <PurchaseDate index={0} />,
      className: "min-w-[180px] px-[12px]",
    },
    {
      field_name: "Amount",
      component: <Amount index={0} />,
      className: "min-w-[130px] max-w-[130px] px-[12px]",
    },
    {
      field_name: "Reimbursable",
      component: <IsReimbursable index={0} />,
      className: "min-w-[120px] px-[12px]",
    },
    {
      field_name: "Payment_method",
      component: "-",
      className: "min-w-[220px] px-[12px]",
    },
    {
      field_name: "Vat_condition",
      component: "-",
      className: "min-w-[220px] px-[12px]",
    },
    {
      field_name: "Vendor_tax_id",
      component: <VendorTaxId index={0} />,
      className: "min-w-[220px] px-[12px]",
    },
    {
      field_name: "Vendor_name",
      component: <VendorName index={0} />,
      className: "min-w-[220px] px-[12px]",
    },
    {
      field_name: "Vat_rate",
      component: "-",
      className: "min-w-[220px] px-[12px]",
    },
    {
      field_name: "Name_of_person_to_reimburse",
      component: <NameOfPersonToReimburse index={0} />,
      className: "min-w-[250px] px-[12px]",
    },
    {
      field_name: "Receipt_image",
      component: "upload",
      className: "min-w-[130px] px-[12px]",
    },
  ];

  // expense_details_fields_list is the list coming from the course_accounting_config table
  const expense_details_fields_list =
    settingsData?.data?.[0]?.expense_details_fields_list;

  // filteredColumns are the filtered columns 
  // we need to filter the colums because as per the requirement we need to display the columns which are coming from the course_accounting_config table based on the settings
  // we will filter based on the field_name coming from the api and our columns field name
  const filteredColumns = expense_details_fields_list?.map((item: any) => {
    const column: any = _.find(columns, { field_name: item.field_name }) || {};
    return {
      ...item,
      componentName: (index: number) => {
        if (typeof column.component === "string") {
          return column.component; // If component is a string, return it directly
        } else {
          // If component is a React element, clone it and pass index as a prop
          return React.cloneElement(column.component, { index });
        }
      },
      className: column.className || "",
    };
  });

  // the toatal program expenses in the form
  const program_expenses = formData.program_expenses || [];

  return (
    <div>
      <Header className="py-4" children={"Expense Details"} />
      <div className="rounded-[12px] border border-[#D6D7D8] overflow-x-auto w-fit">
        <div className="flex h-[48px] w-fit bg-[#7677F41A]">
          <TableHeader className="min-w-[50px] px-[12px]">#</TableHeader>
          {filteredColumns?.map((field: any) => (
            <TableHeader className={field?.className}>
              {field?.field_label}
            </TableHeader>
          ))}
          <TableHeader className="min-w-[220px] px-[12px]">Actions</TableHeader>
        </div>

        <div className="space-y-[12px] my-[12px]">
          {fields.map((field: any, index: number) => (
            <div key={field.id} className="flex items-center w-full h-auto  ">
              <div className="min-w-[50px] px-[12px]">{index + 1}</div>

              {filteredColumns?.map((field: any) => (
                <div className={field?.className}>
                  {field?.componentName(index)}
                </div>
              ))}

              <div className="w-[180px] px-[12px]">
                <Action index={index} remove={remove} append={append} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * @function ExpenseCategory
 * @description This function is used to take the expense category and store in the form data
 * @param index
 * @returns
 */
const ExpenseCategory = ({ index }: { index: number }) => {

  // query is the destructured query data in the useRouter
  const { query } = useRouter();

  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.expense_category`,
  });

  // this is to update the page size on scrolling the options in the dropdown
  const [pageSize, setPageSize] = useState(10);

  // data is the descructed data from the program table
  const { data } = useOne({
    resource: "program",
    id: query?.id as string,
  });

  // options will get from the program_expense_category_master actually are the records in the table
  // will get in the options format by the useSelect hook
  // we get that based on the program organizer_id
  // we can give the search also for the useSelect
  // const { options, onSearch } = useSelect({
  //   resource: "program_expense_category_master",
  //   optionLabel: "name",
  //   optionValue: "id",
  //   pagination: {
  //     pageSize: pageSize,
  //     mode: "server",
  //   },
  //   filters: [
  //     {
  //       field: "organization_id",
  //       operator: "eq",
  //       value: data?.data?.organization_id,
  //     },
  //   ],
  //   onSearch: (value) => [
  //     {
  //       field: "name",
  //       operator: "contains",
  //       value,
  //     },
  //   ],
  // });

  // TODO need to change the options after finalising from which tabel we need to get the expense category dropdown options
  const options: any[] = []

  /**
   * @function handleOnBottomReached
   * @description this function is used to increase the page size when we scroll the options in the dropdown 
   */
  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };
  return (
    <Select
      value={value}
      onValueChange={(val: any) => {
        onChange(val);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {/* <Input onChange={(val) => onSearch(val.target.value)} /> */}
        <SelectItems onBottomReached={handleOnBottomReached}>
          {options.map((option: any, index: number) => (
            <>
              <SelectItem
                key={option.value}
                value={option.value}
                className="h-[44px]"
              >
                {option.label}
              </SelectItem>
              {index < options?.length - 1 && (
                <hr className="border-[#D6D7D8]" />
              )}
            </>
          ))}
        </SelectItems>
      </SelectContent>
    </Select>
  );
};

/**
 * @function Details
 * @description This function is used to take the details of the expense and store in the form data
 * @param index
 * @returns
 */
const Details = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.details`,
  });
  return (
    <div>
      <Input
        value={value as string}
        onChange={onChange}
        error={error ? true : false}
      />
    </div>
  );
};

/**
 * @function ReceiptId
 * @description This function is used to take the ReceiptId of expense and store in the form data
 * @param index
 * @returns
 */
const ReceiptId = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.recipt_id`,
  });
  return (
    <div>
      <Input value={value as number} onChange={onChange} error={error ? true : false} />
    </div>
  );
};

/**
 * @function Amount
 * @description This function is used to take the Amount of expense and store in the form data
 * @param index
 * @returns
 */
const Amount = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.amount`,
  });
  return (
    <div>
      <Input
        value={value as number}
        onChange={onChange}
        error={error ? true : false}
      />
    </div>
  );
};

/**
 * @function PaymentMethod
 * @description This function is used to take the Payment Method of expense and store in the form data
 * @param index
 * @returns
 */
// const PaymentMethod = ({ index }: { index: number }) => {
//   const {
//     field: { value, onChange },
//     fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
//   } = useController<CourseAccountingFormFieldTypes>({
//     name: `program_expenses.${index}.payment_method`,
//   });

//   const { data } = useList<any>({
//     resource: "option_labels",
//     filters: [
//       {
//         field: "name",
//         operator: "eq",
//         value: "Payment Method",
//       },
//     ],
//   });

//   const { options } = useSelect({
//     resource: "option_values",
//     optionLabel: "value",
//     optionValue: "id",
//     filters: [
//       {
//         field: "option_label_id",
//         operator: "eq",
//         value: data?.data[0]?.id,
//       },
//     ],
//   });

//   return (
//     <div className="">
//       <Select
//         value={value}
//         onValueChange={(val: any) => {
//           onChange(val);
//         }}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItems>
//             {options.map((option: any, index: number) => (
//               <>
//                 <SelectItem
//                   key={option.value}
//                   value={option.value}
//                   className="h-[44px]"
//                 >
//                   {option.label}
//                 </SelectItem>
//                 {index < options?.length - 1 && (
//                   <hr className="border-[#D6D7D8]" />
//                 )}
//               </>
//             ))}
//           </SelectItems>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

/**
 * @function VatCondition
 * @description This function is used to take the Vat Condition of expense and store in the form data
 * @param index
 * @returns
 */
// const VatCondition = ({ index }: { index: number }) => {
//   const {
//     field: { value, onChange },
//     fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
//   } = useController<CourseAccountingFormFieldTypes>({
//     name: `program_expenses.${index}.vat_condition`,
//   });
//   const options = [];
//   return (
//     <div className="">
//       <Select
//         value={value}
//         onValueChange={(val: any) => {
//           onChange(val);
//         }}
//       >
//         <SelectTrigger className="">
//           <SelectValue placeholder="Select" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItems>
//             {options.map((option: any, index: number) => (
//               <>
//                 <SelectItem
//                   key={option.value}
//                   value={option.value}
//                   className="h-[44px]"
//                 >
//                   {option.label}
//                 </SelectItem>
//                 {index < options?.length - 1 && (
//                   <hr className="border-[#D6D7D8]" />
//                 )}
//               </>
//             ))}
//           </SelectItems>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

/**
 * @function VendorTaxId
 * @description This function is used to take the Vendor Tax Id of expense and store in the form data
 * @param index
 * @returns
 */
const VendorTaxId = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.vat_tax_id`,
  });
  return (
    <div className="">
      <Input
        value={value as number}
        onChange={onChange}
        error={error ? true : false}
      />
    </div>
  );
};

/**
 * @function VendorName
 * @description This function is used to take the Vendor Name of expense and store in the form data
 * @param index
 * @returns
 */
const VendorName = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.vendor_name`,
  });
  return (
    <div className="">
      <Input
        value={value as string}
        onChange={onChange}
        error={error ? true : false}
      />
    </div>
  );
};

/**
 * @function VatRate
 * @description This function is used to take the Vat Rate of expense and store in the form data
 * @param index
 * @returns
 */
// const VatRate = ({ index }: { index: number }) => {
//   const {
//     field: { value, onChange },
//     fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
//   } = useController<CourseAccountingFormFieldTypes>({
//     name: `program_expenses.${index}.vat_rate`,
//   });
//   const options = [ ];
//   return (
//     <div className="">
//       <Select
//         value={value}
//         onValueChange={(val: any) => {
//           onChange(val);
//         }}
//       >
//         <SelectTrigger className="">
//           <SelectValue placeholder="Select" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItems>
//             {options.map((option: any, index: number) => (
//               <>
//                 <SelectItem
//                   key={option.value}
//                   value={option.value}
//                   className="h-[44px]"
//                 >
//                   {option.label}
//                 </SelectItem>
//                 {index < options?.length - 1 && (
//                   <hr className="border-[#D6D7D8]" />
//                 )}
//               </>
//             ))}
//           </SelectItems>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

/**
 * @function Action
 * @description This function is used to add and delete the row in expense table action and
 * here we  * will be opening the pop-up and after clicking yes in the pop-up only we need to delete all this fuctionality is in the function
 * @param index
 * @param append
 * @param remove
 * @returns
 */
const Action = ({
  index,
  append,
  remove,
}: {
  index: number;
  append: any;
  remove: any;
}) => {
  const { watch } = useFormContext();
  const formData = watch().program_expenses || [];
  const isLastRow = index === formData?.length - 1;
  const isFirstRow = index === 0;

  const [deleteExpenseModalOpen, setDeleteExpenseModalOpen] = useState(false);

  /**
   * @function handleAddRow
   * @description This function is used to add a row
   */
  const handleAddRow = () => {
    append({});
  };

  /**
   * @function handleDeleteRow
   * @description this function is used to delete a row
   * @param index
   */
  const handleDeleteRow = (index: number) => {
    remove(index);
  };
  return (
    <div className="w-[150px] flex gap-4 ">
      {/* Button to add a new row */}
      {isLastRow && (
        <div
          onClick={handleAddRow}
          className="flex flex-row gap-1 justify-center items-center cursor-pointer text-[#7677F4]"
        >
          <Add />
          Add
        </div>
      )}
      {/* Button to delete a row */}
      {!isFirstRow && (
        <div
          onClick={() => setDeleteExpenseModalOpen(true)}
          className="flex flex-row gap-1 justify-center items-center text-[#7677F4] cursor-pointer"
        >
          <Delete />
          <div>Delete</div>
        </div>
      )}

      <Dialog
        open={deleteExpenseModalOpen}
        onOpenChange={setDeleteExpenseModalOpen}
      >
        <DialogContent className="flex flex-col h-[248px] w-[425px]">
          <DialogHeader>
            <div className="flex items-center w-full justify-center">
              <Exclamation />
            </div>
            <DialogDescription className="font-bold text-black text-lg items-center text-center">
              Are you sure you want to delete this line item?
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
                    setDeleteExpenseModalOpen(false);
                  }}
                >
                  No
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                  onClick={() => {
                    handleDeleteRow(index);
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * @function PurchaseDate
 * @description this function is used to select the date of the purchase of the expense
 * @param index
 * @returns
 */
const PurchaseDate = ({ index }: { index: number }) => {
  const {
    field: { value = new Date(), onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.purchase_date`,
  });
  return (
    <div>
      <DateField
        value={value as Date}
        onChange={onChange}
        placeholder=" "
        className="!w-[156px]"
      />
    </div>
  );
};

/**
 * @function IsReimbursable
 * @description This function is used to get the radio buttons for the make reimburs or not buttons
 * @param index
 * @returns
 */
const IsReimbursable = ({ index }: { index: number }) => {
  const {
    field: { value = 1, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.reimbursable`,
  });

  return (
    <div className="flex gap-1 flex-col">
      <RadioGroup
        onValueChange={(val: string) => {
          onChange(parseInt(val));
        }}
        value={JSON.stringify(value)}
      >
        <div className="flex flex-row gap-2 ">
          <RadioItem
            value={JSON.stringify(1)}
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px] "
          />
          <RadioItem
            value={JSON.stringify(0)}
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

interface RadioItemProps {
  selectedRadioValue?: string;
  value: string;
  className?: string;
  label: string;
}
/**
 * @function RadioItem
 * @description This function is used for getting the radio button
 */
const RadioItem: React.FC<RadioItemProps> = ({
  selectedRadioValue,
  value,
  label,
  className,
}) => {
  return (
    <>
      <RadioGroupCircleItem
        value={value}
        id={value}
        className={classNames({
          "!bg-[#7677F4]": selectedRadioValue === value,
          "border !border-[#D6D7D8] border-[1.5px] ":
            selectedRadioValue !== value,
        })}
      />
      <Label
        htmlFor={value}
        className={`text-[#333333] font-normal ${
          selectedRadioValue === value ? "text-[#7677F4]" : ""
        }`}
      >
        {label}
      </Label>
    </>
  );
};

/**
 * @function NameOfPersonToReimburse
 * @description This function is used to store the person to whom we are reimbursing the amount in the form
 * REQUIRMENT If we click on the other in the select dropdown then we need to display the input for taking the name of the person who are not in the dropdown
 * @param index 
 * @returns 
 */
const NameOfPersonToReimburse = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.name_of_person_to_reimbursable`,
  });

  const {
    field: {
      value: newPersonToReimburse,
      onChange: newPersonToReimburseOnChange,
    },
    fieldState: { error: newPersonToReimburseError },
    // We give the type here because we will get the name as per the types we have in the form
  } = useController<CourseAccountingFormFieldTypes>({
    name: `program_expenses.${index}.new_person_to_reimburse`,
  });

  const { query } = useRouter();

  const [personToReimburseOptionsData, setPersonToReimburseOptionsData] =
    useState<any>([]);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    /**
     * @function fetchData
     * @description this function is used to fetch all the data from the program_organizers, program_assistant_teachers and program_teachers using the program id
     */
    const fetchData = async () => {
      // We are getting the daa from the supaBaseClient from the program table and program_organizers, program_assistant_teachers, program_teachers all these tables are related to the program
      // so by giving the program id we can get all the data.
      const { data } = await supabaseClient
        .from("program")
        .select(
          "program_organizers(user_id(contact_id(*))),program_assistant_teachers(*,user_id(contact_id(*))),program_teachers(*,user_id(contact_id(*)))"
        )
        .eq("id", parseInt(query?.id as string));

      // from the api call we get the data in the array of objects and in the object we have the three more array of object so flattening of these we are flattening the data we have using the lodash .flatMap function
      const combinedArray = _.flatMap(data?.[0]);

      // We need to unique the objects
      const uniqueData = _.uniqBy(
        combinedArray,
        (item) => item.user_id.contact_id.id
      );

      // setting the flattened data to the
      setPersonToReimburseOptionsData(uniqueData);
    };

    fetchData();
  }, [query?.id]);


  /**
   * @constant filterFinalPersonToReimburseOptionsData
   * @description in this const we filter the data based on the searchValue and we return the filtered data using the .filter 
   * the search filter can be done without considering the case sensitive
   */
  const filterFinalPersonToReimburseOptionsData =
    personToReimburseOptionsData?.filter((item: any) =>
      item?.user_id?.contact_id?.full_name
        ?.toLocaleLowerCase() // for case insensitive search we are converting into toLocaleLowerCase
        ?.includes(searchValue?.toLocaleLowerCase())
    );

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={value}
        onValueChange={(val: any) => {
          onChange(val);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {/* this input is used to take the search value
           */}
          <Input onChange={(val) => setSearchValue(val.target.value)} />
          <SelectItems>
            {filterFinalPersonToReimburseOptionsData.map(
              (option: any, index: number) => (
                <>
                  <SelectItem
                    key={index}
                    value={index + 1}
                    className="h-[44px]"
                  >
                    {option?.user_id?.contact_id?.full_name}
                  </SelectItem>
                  {index < personToReimburseOptionsData?.length && (
                    <hr className="border-[#D6D7D8]" />
                  )}
                </>
              )
            )}
            <SelectItem className="h-[44px]" value={0}>
              Other
            </SelectItem>
          </SelectItems>
        </SelectContent>
      </Select>

      {value == 0 && (
        <Input
          value={newPersonToReimburse as string}
          onChange={newPersonToReimburseOnChange}
          error={error ? true : false}
        />
      )}
    </div>
  );
};
