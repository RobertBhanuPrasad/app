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
import { useList, useSelect } from "@refinedev/core";
import {  Header} from "src/ui/TextTags";
import { TableHeader } from "src/ui/TextTags";
export const ExpenseDetails = () => {
  const { fields, append, remove } = useFieldArray({
    name: "expenses",
  });
  const { watch } = useFormContext();

  const formData = watch();
  useEffect(() => {
    if (!formData?.expenses || formData?.expenses.length <= 0) {
      append(undefined);
    }
  }, []);

  const expenses = formData.expenses || [];

  return (
    <div>
      <Header className="py-4" children={"Expense Details"} />
      <div className="rounded-[12px] border border-[#D6D7D8] w-full overflow-hidden overflow-x-auto scrollbar">
        <div className="flex h-[48px] w-full ">
          <div className="p-2 w-[50px] bg-[#7677F41A]">#</div>
          <TableHeader className="p-2 min-w-[180px]">Expense Category</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Details</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Receipt Id</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Amount</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Payment Method</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Vat Condition</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Vendor Tax Id</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Vendor Name</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Vat Rate</TableHeader>
          <TableHeader className="p-2 min-w-[180px]">Actions</TableHeader>
        </div>

        {fields.map((field: any, index: number) => (
          <div key={field.id} className="flex items-center w-full h-auto ">
            <div className="w-[50px] p-2">{index + 1}</div>
            <div className="min-w-[180px] p-2">
              <ExpenseCategory index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <Details index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <ReceiptId index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <Amount index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <PaymentMethod index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <VatCondition index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <VendorTaxId index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <VendorName index={index} />
            </div>
            <div className="min-w-[180px] p-2">
              <VatRate index={index} />
            </div>
            <div className="min-w-[180px] p-2 ">
              <Action index={index} remove={remove} append={append} />
            </div>

            {index < expenses?.length - 1 && (
              <hr className="border-[#D6D7D8]" />
            )}
          </div>
        ))}
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
const ExpenseCategory = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `expense_category${index}`,
  });

  const options = [
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
  ];

  return (
    <div className="">
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
          <SelectItems>
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
    </div>
  );
};

/**
 * @function Details
 * @description This function is used to take the details of the expense and store in the form data
 * @param index
 * @returns
 */
const Details = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `details${index}`,
  });
  return (
    <div className="">
      <Input value={value} onChange={onChange} error={error ? true : false} />
    </div>
  );
};

/**
 * @function ReceiptId
 * @description This function is used to take the ReceiptId of expense and store in the form data
 * @param index
 * @returns
 */
const ReceiptId = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `receipt_id${index}`,
  });
  return (
    <div className="">
      <Input value={value} onChange={onChange} error={error ? true : false} />
    </div>
  );
};

/**
 * @function Amount
 * @description This function is used to take the Amount of expense and store in the form data
 * @param index
 * @returns
 */
const Amount = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `amount${index}`,
  });
  return (
    <div className="">
      <Input value={value} onChange={onChange} error={error ? true : false} />
    </div>
  );
};

/**
 * @function PaymentMethod
 * @description This function is used to take the Payment Method of expense and store in the form data
 * @param index
 * @returns
 */
const PaymentMethod = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `payment_method${index}`,
  });

  const { data } = useList<any>({
    resource: "option_labels",
    filters: [
      {
        field: "name",
        operator: "eq",
        value: "Payment Method",
      },
    ],
  });

  const { options } = useSelect({
    resource: "option_values",
    optionLabel: "value",
    optionValue: "id",
    filters: [
      {
        field: "option_label_id",
        operator: "eq",
        value: data?.data[0]?.id,
      },
    ],
  });

  return (
    <div className="">
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
          <SelectItems>
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
    </div>
  );
};

/**
 * @function VatCondition
 * @description This function is used to take the Vat Condition of expense and store in the form data
 * @param index
 * @returns
 */
const VatCondition = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `vat_condition${index}`,
  });
  const options = [
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
  ];
  return (
    <div className="">
      <Select
        value={value}
        onValueChange={(val: any) => {
          onChange(val);
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
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
    </div>
  );
};

/**
 * @function VendorTaxId
 * @description This function is used to take the Vendor Tax Id of expense and store in the form data
 * @param index
 * @returns
 */
const VendorTaxId = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `vendor_tax_id${index}`,
  });
  return (
    <div className="">
      <Input value={value} onChange={onChange} error={error ? true : false} />
    </div>
  );
};

/**
 * @function VendorName
 * @description This function is used to take the Vendor Name of expense and store in the form data
 * @param index
 * @returns
 */
const VendorName = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `vendor_name`,
  });
  return (
    <div className="">
      <Input value={value} onChange={onChange} error={error ? true : false} />
    </div>
  );
};

/**
 * @function VatRate
 * @description This function is used to take the Vat Rate of expense and store in the form data
 * @param index
 * @returns
 */
const VatRate = (index: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `vat_rate${index}`,
  });
  const options = [
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
    {
      value: "creditcard",
      label: "Creditcard",
    },
  ];
  return (
    <div className="">
      <Select
        value={value}
        onValueChange={(val: any) => {
          onChange(val);
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItems>
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
    </div>
  );
};

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
  const formData = watch().expenses || [];
  const isLastRow = index === formData?.length - 1;
  const isFirstRow = index === 0;

  const [deleteExpenseModalOpen, setDeleteExpenseModalOpen] = useState(false);

  /**
   * @function handleAddRow
   * @description This function is used to add a row
   */
  const handleAddRow = () => {
    append({
      details: "",
      receipt_id: "",
      amount: "",
      payment_method: "",
      vat_condition: "",
      vendor_tax_id: "",
      vendor_name: "",
      vat_rate: "",
    });
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
