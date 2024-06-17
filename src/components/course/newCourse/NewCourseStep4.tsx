import { DataTable } from "../../DataTable";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "src/ui/checkbox";
import { useGetIdentity, useList } from "@refinedev/core";
import { NATIONAL_ADMIN, SUPER_ADMIN } from "src/constants/OptionValueOrder";
import {
  useController,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { Input } from "src/ui/input";
import { NewCourseStep4FormNames } from "src/constants/CourseConstants";
import { useTranslation } from "next-i18next";
import { translatedText } from "src/common/translations";
import { DateField } from "src/ui/DateField";
import { Text } from "src/ui/TextTags";
import _ from "lodash";
import { optionLabelValueStore } from "src/zustandStore/OptionLabelValueStore";
import { calculateSubTotalFee, calculateTax } from "pages/courses/add";

// Define CourseTable component

export default function CourseTable() {
  const { t } = useTranslation("common");

  const { watch } = useFormContext();

  const formData = watch();

  return (
    <>
      {formData?.product_fee_settings == undefined ? (
        <section className="flex flex-row w-full h-[400px] justify-center items-center">
          <div className="loader"></div>
        </section>
      ) : (
        <section>
          {
            //If Fee is not found based on users selection then need to show this
            Object.keys(formData?.product_fee_settings)?.length == 0 ||
            formData?.product_fee_settings?.product_fee_level_settings
              ?.length == 0 ? (
              <div className="w-[1016px] h-[280px] flex items-center justify-center border border-1 rounded-xl">
                {t(
                  "there_is_no_price_set_for_current_settings_select_course_type_and_city_center"
                )}
              </div>
            ) : (
              <CourseFeeTable
                courseFeeSettings={formData?.product_fee_settings}
              />
            )
          }
        </section>
      )}
    </>
  );
}
export const sortFeeLevels = (feeLevels: any) => {
  // Sort fee levels: regular, student, repeater, senior citizen, and custom fees
  return _.sortBy(feeLevels, ['is_custom_fee', 'order']);
};

function CourseFeeTable({ courseFeeSettings }: any) {
  const { t } = useTranslation(["common", "course.new_course", "new_strings","enum"]);

  const { data: loginUserData }: any = useGetIdentity();

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });

  const { watch } = useFormContext();

  const formData = watch();

  const organizationData = {
    tax_enabled: true,
    tax_rate: 25,
  };

  //If organization as tax enabled then we need consider tax else tax will be zero
  const taxRate = organizationData?.tax_enabled
    ? organizationData?.tax_rate
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
    isUserNationAdminOrSuperAdmin || courseFeeSettings?.is_program_fee_editable
      ? true
      : false;

  const {
    field: { value: showEarlyBirdColumns, onChange: setShowEarlyBirdColumns },
  } = useController({ name: NewCourseStep4FormNames?.is_early_bird_enabled });

  // Data for the table
  const courseFeeData: FeeLevelType[] = formData?.program_fee;

  //Columns to display in fee table
  //Fee Columns
  //Fee Level Column
  const feeLevelColumn: ColumnDef<FeeLevelType> = {
    cell: ({ row }) => {
      let feeLabel;
      if (row?.original.is_custom_fee) {
        feeLabel = translatedText(row?.original?.custom_fee_label);
      } else {
        feeLabel = t(`enum:${row?.original?.fee_level}`);
      }
      return <div className="">{feeLabel}</div>;
    },
    enableSorting: false,
    enableHiding: false,
    header: t("fee_level"),
    accessorKey: "fee_level",
  };

  //Sub total Column
  const feeSubTotalColumn: ColumnDef<FeeLevelType> = {
    accessorKey: "sub_total",
    header: `${t("course.new_course:fees_tab.normal_fee")} (${
      countryConfigData?.data?.[0]?.default_currency_code
    })`,
    cell: ({ row }) => {
      return <div className="">{row?.original?.sub_total}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  };

  //Tax Column
  const feeTaxColumn: ColumnDef<FeeLevelType> = {
    accessorKey: "tax",
    header: `${t("course.new_course:fees_tab.vat reg")} (${
      countryConfigData?.data?.[0]?.default_currency_code
    })`,
    cell: ({ row }) => {
      return <div className="">{row?.original?.tax}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  };

  //Total column
  const feeTotalColumn: ColumnDef<FeeLevelType> = {
    accessorKey: "total",
    header: `${t("course.new_course:fees_tab.fee")} (${
      countryConfigData?.data?.[0]?.default_currency_code
    })`,
    cell: ({ row }) => {
      const {
        field: { value, onChange },
        fieldState: { error },
      } = useController({
        name: `program_fee[${row?.index}][total]`,
      });

      const { setValue } = useFormContext();

      const [total, setTotal] = useState(value);

      //If fee is editable need to display input with prefilled amount. user cam able to edit fee.
      if (isFeeEditable) {
        return (
          <div className="w-[75px]">
            <Input
              value={total}
              onChange={(val) => {
                setTotal(preProcessAmount(val.target.value));
              }}
              error={error ? true : false}
              onBlur={() => {
                //If user enters nothing zero is store
                const formattedValue = total
                  ? parseFloat(parseFloat(total).toFixed(2))
                  : 0;

                setTotal(formattedValue);
                onChange(formattedValue);
                //Updating sub total with new total entered by user.
                setValue(
                  `program_fee[${row?.index}][sub_total]`,
                  calculateSubTotalFee(formattedValue, taxRate)
                );
                //Updating tax with new total entered by user.
                setValue(
                  `program_fee[${row?.index}][tax]`,
                  calculateTax(formattedValue, taxRate)
                );
              }}
              onFocus={() => {
                //If amount is zero then removing ever thing in input and letting user to enter new value
                if (total == 0) {
                  setTotal("");
                }
              }}
            />
          </div>
        );
      } else {
        return <div className="">{row?.original?.total}</div>;
      }
    },
    enableSorting: false,
    enableHiding: false,
  };

  //Early bird Fee Columns
  //Early bird Sub total
  const earlyBirdFeeSubTotalColumn: ColumnDef<FeeLevelType> = {
    accessorKey: "early_bird_sub_total",
    header: `${t("course.new_course:fees_tab.early_bird")} (${
      countryConfigData?.data?.[0]?.default_currency_code
    })`,
    cell: ({ row }) => {
      return <div className="">{row?.original?.early_bird_sub_total}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  };

  //Early bird Tax
  const earlyBirdFeeTaxColumn: ColumnDef<FeeLevelType> = {
    accessorKey: "early_bird_tax",
    header: `${t("course.new_course:fees_tab.vat reg")} (${
      countryConfigData?.data?.[0]?.default_currency_code
    })`,
    cell: ({ row }) => {
      return <div className="">{row?.original?.early_bird_tax}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  };

  //Early bird total
  const earlyBirdFeeTotalColumn: ColumnDef<FeeLevelType> = {
    accessorKey: "early_bird_total",
    header: `${t("course.new_course:fees_tab.total early")} (${
      countryConfigData?.data?.[0]?.default_currency_code
    })`,
    cell: ({ row }) => {
      const {
        field: { value, onChange },
        fieldState: { error },
      } = useController({
        name: `program_fee[${row?.index}][early_bird_total]`,
      });

      const [earlyBirdTotal, setEarlyBirdTotal] = useState(value);
      const { setValue } = useFormContext();
      if (isFeeEditable) {
        return (
          <div className="w-[75px] text-sm">
            <Input
              value={earlyBirdTotal}
              onChange={(val) => {
                setEarlyBirdTotal(preProcessAmount(val.target.value));
              }}
              error={error ? true : false}
              onBlur={() => {
                const formattedValue = earlyBirdTotal
                  ? parseFloat(parseFloat(earlyBirdTotal).toFixed(2))
                  : 0;
                setEarlyBirdTotal(formattedValue);
                onChange(formattedValue);
                //Updating sub total with new total entered by user.
                setValue(
                  `program_fee[${row?.index}][early_bird_sub_total]`,
                  calculateSubTotalFee(formattedValue, taxRate)
                );
                //Updating tax with new total entered by user.
                setValue(
                  `program_fee[${row?.index}][early_bird_tax]`,
                  calculateTax(formattedValue, taxRate)
                );
              }}
              onFocus={() => {
                //If amount is zero then removing ever thing in input and letting user to enter new value
                if (earlyBirdTotal == 0) {
                  setEarlyBirdTotal("");
                }
              }}
            />
          </div>
        );
      } else {
        return <div>{row?.original?.early_bird_total}</div>;
      }
    },
    enableSorting: false,
    enableHiding: false,
  };

  //Grouping the columns based on requirement
  let feeColumns: ColumnDef<FeeLevelType>[] = [
    feeLevelColumn,
    feeSubTotalColumn,
  ];
  //If tax is enabled need to add tax column
  if (organizationData?.tax_enabled) {
    feeColumns = [...feeColumns, feeTaxColumn];
  }
  feeColumns = [...feeColumns, feeTotalColumn];

  //If Early bird is enabled need to display early bird fee columns
  if (showEarlyBirdColumns) {
    feeColumns = [...feeColumns, earlyBirdFeeSubTotalColumn];
    if (organizationData?.tax_enabled) {
      feeColumns = [...feeColumns, earlyBirdFeeTaxColumn];
    }
    feeColumns = [...feeColumns, earlyBirdFeeTotalColumn];
  }

  //When user clicks on enable early bird fee then need to show fee of early bird
  if (isFeeEditable) {
    feeColumns = [
      {
        id: "select",
        header: () => <div>{t("course.new_course:fees_tab.enable_fees")}</div>,
        cell: ({ row }) => {
          const {
            field: { value, onChange },
          } = useController({
            name: `program_fee[${row?.index}][is_enable]`,
          });

          const { optionLabelValue } = optionLabelValueStore();
          /**
           * @constant regularFeeLevel
           * REQUIRMENT we need to disable the check box of regular fee type
           */
          const regularFeeLevel = optionLabelValue?.program_fee_level.REGULAR;

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
              // REQUIRMENT we need to disable the checkbox when the fee level id regular and not for custom fee
              disabled={
                row?.original.fee_level == regularFeeLevel &&
                row?.original?.is_custom_fee == false
                  ? true
                  : false
              }
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      ...feeColumns,
    ];
  }

  //Form variable to store the early_bird_cut_off_period
  const {
    field: { value: earlyBirdCutOff, onChange: setEarlyBirdCutOff },
  } = useController({ name: "early_bird_cut_off_period" });

  //Finding course start date
  let sortedSchedules = formData.schedules.sort((a: any, b: any) => {
    let aDate = new Date(a.date);
    aDate.setHours(a?.startHour, a?.startMinute);

    let bDate = new Date(b.date);
    bDate.setHours(b?.startHour, b?.startMinute);

    return aDate.getTime() - bDate.getTime();
  });

  const courseStartDate = sortedSchedules?.[0]?.date;

  const earlyBirdStartDate = new Date(courseStartDate);
  //calculate of early bird start date
  earlyBirdStartDate.setDate(earlyBirdStartDate.getDate() - earlyBirdCutOff);

  const [selectedDate, setSelectedData] = useState(earlyBirdStartDate);

  /**
   * @function handleDisableEarlyBirdCutOff is used to determine whether early bird calender is disabled or not.
   * @returns bool. If true early bird calender is not clickable (non editable). If true early bird calender is clickable (editable)
   */
  const handleDisableEarlyBirdCutOff = () => {
    //Requirment: If National Admin or Super admin is creating a course Then Early bird cutoff fee is editable.
    if (isUserNationAdminOrSuperAdmin) return false;

    //Requirement: Early bird cutoff is editable if
    if (
      //Early Bird column is enabled by users
      showEarlyBirdColumns &&
      //Early Bird Fee Enabled in settings
      courseFeeSettings?.is_early_bird_fee_enabled &&
      //Early Bird Cut off Editable in settings
      courseFeeSettings?.is_early_bird_cut_off_editable
    )
      return false;
    //In rest all cases false
    return true;
  };

  return (
    <div className="flex flex-col justify-center gap-2.5">
      {/* Enable Early Bird fee if it is enabled in settings and Fee should be editable */}
      <div className="flex items-center gap-2 py-2">
        <div className="flex items-center w-full justify-between">
          <div className="font-semibold text-base text-[#333333]">
            {t("fees")}
          </div>
          {courseFeeSettings?.is_early_bird_fee_enabled && isFeeEditable && (
            <div className="flex justify-between items-center gap-[8px] py-4">
              <Checkbox
                checked={showEarlyBirdColumns}
                onCheckedChange={(val) => {
                  setShowEarlyBirdColumns(val);
                }}
                className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
              />
              <div className="font-normal">
                {t("course.new_course:fees_tab.enable_early")}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Rendering DataTable component */}
      <div className="h-auto overflow-x-scroll rounded-2xl border">
        <DataTable columns={feeColumns} data={courseFeeData} />
      </div>

      <div>
        {
          // Need to show early bird calender if early bird fee is enabled
          showEarlyBirdColumns && (
            <div className="w-80 mt-9">
              <div className="flex justify-between">
                <div className="flex flex-row gap-1 items-center">
                  <Text className="text-xs font-normal text-[#333333]">
                    {t("new_strings:Early_bird_cutoff_period")}
                  </Text>{" "}
                  <Text className="text-[#7677F4]">*</Text>
                </div>
                <div className="font-normal italic text-base text-sm text-[#7677F4]">
                  {earlyBirdCutOff} {t("course.new_course:fees_tab.days_left")}
                </div>
              </div>
              <DateField
                value={selectedDate as Date}
                onChange={(date: any) => {
                  setSelectedData(date);
                  const differenceInMilliseconds: number =
                    courseStartDate.getTime() - date.getTime();

                  // Convert milliseconds to days
                  const oneDayInMilliseconds: number = 1000 * 60 * 60 * 24;

                  const differenceInDays: number = Math.floor(
                    differenceInMilliseconds / oneDayInMilliseconds
                  );

                  setEarlyBirdCutOff(differenceInDays);
                }}
                placeholder=" "
                className="!w-80"
                disabled={handleDisableEarlyBirdCutOff()}
                disableDate={courseStartDate}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}

// Property to prevent layout being removed during page transitions
CourseTable.noLayout = false;

//Type for FeeLevels
type FeeLevelType = {
  early_bird_sub_total: number;
  early_bird_tax: number;
  early_bird_total: number;
  fee_level: string;
  is_enable: boolean;
  sub_total: number;
  tax: number;
  total: number;
  is_custom_fee: boolean;
  custom_fee_label: object;
};

/**
 * @function preProcessAmount is used to remove all characters present in amount. It accept only number and . (dot)
 * @param val amount in the form of string
 * @returns amount consisting of only number.
 */
export const preProcessAmount = (val: string) => {
  const regex = /[^0-9.]+/g;
  return val.replace(regex, "");
};
