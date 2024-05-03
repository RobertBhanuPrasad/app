import { DataTable } from "../../DataTable";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "src/ui/checkbox";
import { supabaseClient } from "src/utility";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useGetIdentity, useList, useOne } from "@refinedev/core";
import { NATIONAL_ADMIN, SUPER_ADMIN } from "src/constants/OptionValueOrder";
import {
  useController,
  useFieldArray,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { Input } from "src/ui/input";
import { NewCourseStep4FormNames } from "src/constants/CourseConstants";
import { DateCalendar } from "src/ui/DateCalendar";
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import { Button } from "src/ui/button";
import CalenderIcon from "@public/assets/CalenderIcon";
import { format } from "date-fns";

// Define CourseTable component

export default function CourseTable() {
  const [courseFeeSettings, setCourseFeeSettings] = useState();

  const { watch } = useFormContext();

  const formData = watch();

  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: formData?.program_type_id,
  });

  let stateId: number, cityId: number, centerId: number;

  //Finding the state_id ,city_id and center_id where course is going on
  if (programTypeData?.data?.is_online_program) {
    stateId = formData?.state_id;
    cityId = formData?.city_id;
    centerId = formData?.center_id;
  } else {
    if (formData.is_existing_venue == "new-venue") {
      stateId = formData?.newVenue?.state_id;
      cityId = formData?.newVenue?.city_id;
      centerId = formData?.newVenue?.center_id;
    } else if (formData?.is_existing_venue == "existing-venue") {
      stateId = formData?.existingVenue?.state_id;
      cityId = formData?.existingVenue?.city_id;
      centerId = formData?.existingVenue?.center_id;
    }
  }

  //Finding course start date
  const courseStartDate = formData?.schedules?.[0]?.date?.toISOString();

  //Form variable to store the early_bird_cut_off_period
  const {
    field: { value: earlyBirdCutOff, onChange: setEarlyBirdCutOff },
  } = useController({ name: "early_bird_cut_off_period" });

  //Form variable to store the is_early_bird_enabled
  const {
    field: { value: showEarlyBirdColumns, onChange: setShowEarlyBirdColumns },
  } = useController({ name: NewCourseStep4FormNames?.is_early_bird_enabled });

  const fetchFeeData = async () => {
    const supabase = supabaseClient();
    //Sending all required params
    const { data, error } = await supabase.functions.invoke("course-fee", {
      method: "POST",
      body: {
        state_id: stateId,
        city_id: cityId,
        center_id: centerId,
        start_date: courseStartDate,
        program_type_id: formData?.program_type_id,
      },
    });
    if (error)
      console.log("error while fetching course fee level settings", error);

    if (earlyBirdCutOff == undefined) {
      setEarlyBirdCutOff(data?.[0]?.early_bird_cut_off_period);
    }

    if (
      showEarlyBirdColumns == undefined &&
      data?.[0]?.is_early_bird_fee_enabled
    ) {
      setShowEarlyBirdColumns(data?.[0]?.is_early_bird_fee_enabled);
    }
    setCourseFeeSettings(data);
  };

  useEffect(() => {
    fetchFeeData();
  }, [formData?.organization]);

  const { data: organizationData, isLoading } = useOne({
    resource: "organizations",
    id: formData?.organization_id,
  });

  if (courseFeeSettings == undefined || isLoading) {
    return <LoadingIcon />;
  }
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="font-semibold text-base text-[#333333]">Fee</div>
      <CourseFeeTable
        courseFeeSettings={courseFeeSettings}
        organizationData={organizationData?.data}
      />
    </div>
  );
}
function CourseFeeTable({ courseFeeSettings, organizationData }: any) {
  //If Fee is not found based on users selection then need to show this
  if (courseFeeSettings?.length == 0) {
    return (
      <div className="w-[1016px] h-[280px] flex items-center justify-center border border-1 rounded-xl">
        There is no price set for current settings. Select course type and
        city/center.
      </div>
    );
  }

  const { data: loginUserData }: any = useGetIdentity();

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });

  const { watch } = useFormContext();

  const formData = watch();

  const { errors } = useFormState();

  //If organization as tax enabled then we need consider tax else tax will be zero
  const taxRate = organizationData?.tax_enabled
    ? organizationData?.tax_rate / 100
    : 0;

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
    courseFeeSettings?.[0]?.is_program_fee_editable
      ? true
      : false;

  const {
    field: { value: showEarlyBirdColumns, onChange: setShowEarlyBirdColumns },
  } = useController({ name: NewCourseStep4FormNames?.is_early_bird_enabled });

  // Data for the table
  const courseFeeData: FeeLevelType[] =
    courseFeeSettings?.[0]?.program_fee_level_settings?.map((val: any) => {
      let modifiedFeeLevels: any = {
        feeLevelId: val?.fee_level_id?.id,
        feeLevelLabel: val?.is_custom_fee
          ? val?.custom_fee_label
          : val?.fee_level_id?.value,
        is_enable: val?.is_enable,
        subTotal: val?.total - val?.total * taxRate,
        tax: val?.total * taxRate,
        total: JSON.stringify(val?.total),
      };

      //Need to insert early bird fee if early bird fee is enabled in settings
      if (courseFeeSettings?.[0]?.is_early_bird_fee_enabled) {
        modifiedFeeLevels = {
          ...modifiedFeeLevels,
          earlyBirdSubTotal:
            val?.early_bird_total - val?.early_bird_total * taxRate,
          earlyBirdTax: val?.early_bird_total * taxRate,
          earlyBirdTotal: JSON.stringify(val?.early_bird_total || ""),
        };
      }
      return modifiedFeeLevels;
    });

  const { fields: feeLevels, append } = useFieldArray({
    name: "program_fee_level_settings",
  });

  useEffect(() => {
    //Initializing setting data into form if fee is editable.Appending only if we have no data present in field
    if (isFeeEditable && feeLevels?.length == 0) {
      const feeData = courseFeeData?.map((fee) => {
        return {
          // By default all checkbox will be false
          is_enable: fee?.is_enable,
          total: fee?.total,
          early_bird_total: fee?.earlyBirdTotal || 0,
          fee_level_id: fee?.feeLevelId,
        };
      });
      append(feeData);
    }
  }, []);

  console.log(errors, "errors");

  //Normal Fee Columns
  let normalFeeColumns: ColumnDef<FeeLevelType>[] = [
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
        return <div className="">{row?.original?.subTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Normal Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    //No need to show tax column if tax is not enabled for selected organization
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.tax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Vat Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.total}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Total Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
  ];

  //Editable Fee Columns
  let editableFeeColumns: ColumnDef<FeeLevelType>[] = [
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
        const {
          field: { value: total },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][total]`,
        });

        const normalFee = total - total * taxRate;

        return <div className="">{normalFee}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Normal Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        const {
          field: { value: total },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][total]`,
        });

        const tax = total * taxRate;
        return <div className="">{tax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Vat Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    {
      cell: ({ row }) => {
        const {
          field: { value, onChange },
          fieldState: { error },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][total]`,
        });

        const [total, setTotal] = useState(value);

        return (
          <div className="w-[75px]">
            <Input
              value={total}
              onChange={(val) => {
                setTotal(val.target.value);
              }}
              error={error ? true : false}
              onBlur={() => {
                onChange(total);
              }}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      header: `Total Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
  ];

  //Early bird Normal Fee
  const earlyBirdFeeColumn: ColumnDef<FeeLevelType>[] = [
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdSubTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Early Normal Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Early Vat Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Early Total Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
  ];

  //Early bird Editable Fee
  const editableEarlyBirdFeeColumn: ColumnDef<FeeLevelType>[] = [
    {
      cell: ({ row }) => {
        const {
          field: { value: earlyBirdTotal },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][early_bird_total]`,
        });

        //Requirement: Early Bird Sub Total is (Early Bird Total - Tax )
        const earlyBirdSubTotal = earlyBirdTotal - earlyBirdTotal * taxRate;

        return <div className="">{earlyBirdSubTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Early Normal Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    //No need to show tax column if tax is not enabled for selected organization
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        const {
          field: { value: earlyBirdTotal },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][early_bird_total]`,
        });

        const tax = earlyBirdTotal * taxRate;
        return <div className="">{tax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `Early Vat Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
    {
      cell: ({ row }) => {
        const {
          field: { value, onChange },
          fieldState: { error },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][early_bird_total]`,
        });

        const [earlyBirdTotal, setEarlyBirdTotal] = useState(value);

        return (
          <div className="w-[75px]">
            <Input
              value={earlyBirdTotal}
              onChange={(val) => {
                setEarlyBirdTotal(val.target.value);
              }}
              error={error ? true : false}
              onBlur={() => {
                onChange(earlyBirdTotal);
              }}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      header: `Early Total Fee(${countryConfigData?.data?.[0]?.default_currency_code})`,
    },
  ];

  let feeColumns: ColumnDef<FeeLevelType>[] = [];

  if (isFeeEditable == false) {
    if (showEarlyBirdColumns) {
      feeColumns = [...normalFeeColumns, ...earlyBirdFeeColumn];
    } else {
      feeColumns = normalFeeColumns;
    }
  } else if (feeLevels?.length != 0) {
    if (showEarlyBirdColumns) {
      feeColumns = [...editableFeeColumns, ...editableEarlyBirdFeeColumn];
    } else {
      feeColumns = editableFeeColumns;
    }
  }

  //When user clicks on enable early bird fee then need to show fee of early bird
  if (isFeeEditable) {
    feeColumns = [
      {
        id: "select",
        header: () => <div>Enable fees</div>,
        cell: ({ row }) => {
          const {
            field: { value, onChange },
          } = useController({
            name: `program_fee_level_settings[${row?.index}][is_enable]`,
          });

          return (
            <Checkbox
              className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
              checked={value}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              onClick={() => {
                onChange(!value);
              }}
              value={value}
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      ...feeColumns,
    ];
  }

  feeColumns = feeColumns.filter(Boolean);

  //Form variable to store the early_bird_cut_off_period
  const {
    field: { value: earlyBirdCutOff, onChange: setEarlyBirdCutOff },
  } = useController({ name: "early_bird_cut_off_period" });

  //Finding course start date
  const courseStartDate = formData?.schedules?.[0]?.date;

  const earlyBirdStartDate = new Date(courseStartDate);
  //calculate of early bird start date
  earlyBirdStartDate.setDate(earlyBirdStartDate.getDate() - earlyBirdCutOff);

  const [selectedDate, setSelectedData] = useState(earlyBirdStartDate);

  return (
    <div className="flex flex-col justify-center">
      {/* Enable Early Bird fee if it is enabled in settings */}
      {courseFeeSettings?.[0]?.is_early_bird_fee_enabled && (
        <div className="flex justify-end items-center gap-2 py-4">
          <Checkbox
            checked={showEarlyBirdColumns}
            onCheckedChange={(val) => {
              setShowEarlyBirdColumns(val);
            }}
            className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
          />
          <div>Enable early bird fees?</div>
        </div>
      )}
      {/* Rendering DataTable component */}
      <div className="w-[1200px] h-auto">
        {isFeeEditable ? (
          feeLevels?.length > 0 && (
            <DataTable columns={feeColumns} data={courseFeeData} />
          )
        ) : (
          <DataTable columns={feeColumns} data={courseFeeData} />
        )}
      </div>

      <div>
        {/* Requirment: Show the early bird calender when 
      1.Super or National Admin is logged in 
      2.Early bird fee enabled in settings
      3.Early bird fee enabled by user
      4.Early bird cut off editable in settings */}
        {isFeeEditable &&
          showEarlyBirdColumns &&
          courseFeeSettings?.[0]?.is_early_bird_fee_enabled &&
          courseFeeSettings?.[0]?.is_early_bird_cut_off_editable && (
            <div className="w-80 mt-9">
              <div className="flex justify-between">
                <div className="font-normal text-base text-sm">
                  Early bird cut-off period
                </div>
                <div className="font-normal italic text-base text-sm text-[#7677F4]">
                  {earlyBirdCutOff} Days left
                </div>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {}}
                      className={`w-full h-[40px] flex flex-row items-center justify-start gap-2 ${
                        errors?.schedules && "border-[#FF6D6D]"
                      }`}
                      variant="outline"
                    >
                      <div>
                        <CalenderIcon color="#999999" />
                      </div>
                      <div>
                        {format(new Date(selectedDate), "dd MMM, yyyy")}
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!w-[810px] !h-[511px] bg-[#FFFFFF]">
                    <DateCalendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date: any) => {
                        setSelectedData(date);
                        const differenceInMilliseconds: number =
                          courseStartDate.getTime() - date.getTime();

                        // Convert milliseconds to days
                        const oneDayInMilliseconds: number =
                          1000 * 60 * 60 * 24;

                        const differenceInDays: number = Math.floor(
                          differenceInMilliseconds / oneDayInMilliseconds
                        );

                        setEarlyBirdCutOff(differenceInDays);
                      }}
                      className="rounded-md"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
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
  is_enable: boolean;
  subTotal: number;
  tax: number;
  total: number;
};
