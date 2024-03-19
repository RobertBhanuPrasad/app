import { DataTable } from "../../DataTable";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "src/ui/checkbox";
import { supabaseClient } from "src/utility";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useGetIdentity } from "@refinedev/core";
import { NATIONAL_ADMIN, SUPER_ADMIN } from "src/constants/OptionValueOrder";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "src/ui/input";

// Define CourseTable component

export default function CourseTable() {
  const [courseFeeSettings, setCourseFeeSettings] = useState();

  const fetchFeeData = async () => {
    const { data, error } = await supabaseClient.functions.invoke(
      "course-fee",
      {
        method: "POST",
        body: {
          state_id: "1",
          city_id: "1",
          center_id: "1",
          start_date: "2024-03-18T07:00:00-00:00",
          program_type_id: "1",
        },
      }
    );

    setCourseFeeSettings(data);
  };

  useEffect(() => {
    fetchFeeData();
  }, []);

  if (courseFeeSettings == undefined) {
    return <LoadingIcon />;
  }
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="font-semibold text-base text-[#333333]">Fee</div>
      <CourseFeeTable courseFeeSettings={courseFeeSettings} />;
    </div>
  );
}
function CourseFeeTable({ courseFeeSettings }: any) {
  if (courseFeeSettings?.length == 0) {
    return (
      <div className="w-[1016px] h-[280px] flex items-center justify-center border border-1 rounded-xl">
        There is no price set for current settings. Select course type and
        city/center.
      </div>
    );
  }

  const { data: loginUserData }: any = useGetIdentity();

  const { watch } = useFormContext();

  const user_roles: any[] = loginUserData?.userData?.user_roles;

  //Checking Weather a user is Super Admin or Not
  let isUserNationAdminOrSuperAdmin = false;

  if (
    user_roles.some(
      (role) =>
        role.role_id.order === NATIONAL_ADMIN ||
        role.role_id.order === SUPER_ADMIN
    )
  ) {
    isUserNationAdminOrSuperAdmin = true;
  }

  //Checking Weather a fee is editable or not
  const isFeeEditable =
    isUserNationAdminOrSuperAdmin ||
    courseFeeSettings?.[0]?.is_program_fee_editable;

  const {
    field: {
      value: showEarlyBirdColumns = false,
      onChange: setShowEarlyBirdColumns,
    },
  } = useController({ name: "showEarlyBirdColumns" });

  // Data for the table
  const courseFeeData: FeeLevelType[] =
    courseFeeSettings?.[0]?.program_fee_level_settings?.map((val: any) => {
      return {
        earlyBirdSubTotal: val?.early_bird_sub_total,
        earlyBirdTax: val?.early_brid_tax,
        earlyBirdTotal: val?.early_brid_total,
        feeLevelId: val?.fee_level_id?.id,
        feeLevelLabel: val?.is_custom_fee
          ? val?.custom_fee_label
          : val?.fee_level_id?.value,
        isEnable: val?.is_enable,
        subtotal: val?.sub_total,
        tax: val?.tax,
        total: val?.total,
      };
    });

  const { fields, append } = useFieldArray({ name: "feeLevels" });

  useEffect(() => {
    //Initializing setting data into form if fee is editable
    if (isFeeEditable) {
      courseFeeData.map((val) => append(val));
    }
  }, []);

  //Not rendering components until data is loaded in form
  if (isFeeEditable == true && fields?.length == 0) {
    return <LoadingIcon />;
  }

  const formData = watch();

  const organizationData = formData?.organizationDetails;

  const feeLevels = formData?.feeLevels;

  //Normal Fee Columns
  let defaultColumns: ColumnDef<FeeLevelType>[] = [
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.feeLevelLabel}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Fee Level",
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.subtotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Normal Fee",
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.tax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Vat Fee",
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.total}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Total Fee",
    },
  ];

  //Editable Fee Columns
  let editableColumns: ColumnDef<FeeLevelType>[] = [
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.feeLevelLabel}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Fee Level",
    },
    {
      cell: ({ row }) => {
        const taxEnable = organizationData?.tax_enabled;
        const taxRate = organizationData?.tax_rate;

        const {
          field: { value: feeLevel },
        } = useController({ name: `feeLevels[${row?.index}]` });

        if (taxEnable) {
          return <div>{feeLevel?.total}</div>;
        }

        //Calculation of Normal Fee based on tax rate
        const normalFee = feeLevel?.total - (feeLevel?.total * taxRate) / 100;
        return <div className="">{100}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Normal Fee",
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        const taxEnable = organizationData?.tax_enabled;
        const taxRate = organizationData?.tax_rate;

        const {
          field: { value: feeLevel },
        } = useController({ name: `feeLevels[${row?.index}]` });

        //Calculation of Normal Fee based on tax rate
        const taxFee = (feeLevel?.total * taxRate) / 100;
        return <div className="">{11}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Vat Fee",
    },
    {
      cell: ({ row }) => {
        const {
          field: { value, onChange },
        } = useController({ name: `feeLevels[${row?.index}][total]` });

        return (
          <div className="w-[150px]">
            <Input
              value={value}
              onChange={(val) => onChange(parseFloat(val.target.value || "0"))}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      header: "Total Fee",
    },
  ];

  //Early bird Normal Fee
  const otherDefaultColumns: ColumnDef<FeeLevelType>[] = [
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdSubTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Early Normal Fee",
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Early Vat Fee",
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Early Total Fee",
    },
  ];

  //Early bird Editable Fee
  const otherEditableColumns: ColumnDef<FeeLevelType>[] = [
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdSubTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Early Normal Fee",
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Early Vat Fee",
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: "Early Total Fee",
    },
  ];

  let feeColumns: ColumnDef<FeeLevelType>[] = [];

  if (isFeeEditable == false) {
    if (showEarlyBirdColumns) {
      feeColumns = [...defaultColumns, ...otherDefaultColumns];
    }
    feeColumns = defaultColumns;
  } else if (feeLevels?.length != 0) {
    if (showEarlyBirdColumns) {
      feeColumns = [...editableColumns, ...otherEditableColumns];
    }
    feeColumns = editableColumns;
  }

  //When user clicks on enable early bird fee then need to show fee of early bird

  if (isFeeEditable) {
    feeColumns = [
      {
        id: "select",
        header: () => <div>Enable fees</div>,
        cell: ({ row }) => (
          <Checkbox
            className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...feeColumns,
    ];
  }

  feeColumns = feeColumns.filter(Boolean);

  return (
    <div className="flex flex-col justify-center">
      {/* Enable Early Bird fee if it is enabled in settings */}
      {courseFeeSettings?.[0]?.is_early_bird_fee_enabled && (
        <div className="flex justify-end items-center gap-2 py-4">
          <Checkbox
            checked={showEarlyBirdColumns}
            onCheckedChange={(val) =>
              setShowEarlyBirdColumns((prev: boolean) => !prev)
            }
            className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
          />
          <div>Enable early bird fees?</div>
        </div>
      )}
      {/* Rendering DataTable component */}
      <div className="w-[1016px] h-60">
        {isFeeEditable ? (
          feeLevels?.length > 0 && (
            <DataTable columns={feeColumns} data={courseFeeData} />
          )
        ) : (
          <DataTable columns={feeColumns} data={courseFeeData} />
        )}
      </div>
    </div>
  );
}

// Property to prevent layout being removed during page transitions
CourseTable.noLayout = false;

//Type for FeeLevels
type FeeLevelType = {
  earlyBirdSubTotal: number;
  earlyBirdTax: number;
  earlyBirdTotal: number;
  feeLevelId: number;
  feeLevelLabel: string;
  isEnable: boolean;
  subtotal: number;
  tax: number;
  total: number;
};
