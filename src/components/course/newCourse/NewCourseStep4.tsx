import { DataTable } from "../../DataTable";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "src/ui/checkbox";
import { supabaseClient } from "src/utility";
import { useGetIdentity, useList, useOne } from "@refinedev/core";
import {
  NATIONAL_ADMIN,
  REGULAR,
  SUPER_ADMIN,
} from "src/constants/OptionValueOrder";
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
import { useTranslation } from "next-i18next";
import { translatedText } from "src/common/translations";
import useGetCountryCode from "src/utility/useGetCountryCode";
import { DateField } from "src/ui/DateField";
import { Text } from "src/ui/TextTags";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { FEE_LEVEL } from "src/constants/OptionLabels";
import _ from "lodash";
import { staticDataStore } from "src/zustandStore/StaticDataStore";

// Define CourseTable component

export default function CourseTable() {
  const { t } = useTranslation("common");
  const { staticData } = staticDataStore()

  const { watch } = useFormContext();

  const formData = watch();

  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: formData?.program_type_id,
  });

  
  const organizationsData = staticData?.organizationsData
  const organization = organizationsData?.find(organization=>organization?.id === formData?.organization_id)

  return (
    <>
      {formData?.feeLevels == undefined? (
        <section className="flex flex-row w-full h-[400px] justify-center items-center">
          <div className="loader"></div>
        </section>
      ) : (
        <section>
          {
            //If Fee is not found based on users selection then need to show this
            formData?.feeLevels?.length == 0 ||
            formData?.feeLevels?.[0]?.program_fee_level_settings?.length ==
              0 ? (
              <div className="w-[1016px] h-[280px] flex items-center justify-center border border-1 rounded-xl">
                {t(
                  "there_is_no_price_set_for_current_settings_select_course_type_and_city_center"
                )}
              </div>
            ) : (
              <CourseFeeTable
                courseFeeSettings={formData?.feeLevels}
                organizationData={organization}
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

function CourseFeeTable({ courseFeeSettings, organizationData }: any) {
  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);

  const { data: loginUserData }: any = useGetIdentity();

  const { staticData } = staticDataStore() 
  const countryConfigData =   staticData?.countryConfigData

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
          ? translatedText(val?.custom_fee_label)
          : translatedText(val?.fee_level_id?.name),
        is_enable: val?.is_enable,
        order: val?.fee_level_id?.order,
        subTotal: (val?.total - val?.total * taxRate)?.toFixed(2),
        tax: (val?.total * taxRate)?.toFixed(2),
        total: parseFloat(val?.total)?.toFixed(2),
        is_custom_fee: val?.is_custom_fee,
        custom_fee_label: val?.custom_fee_label,
      };

      //Need to insert early bird fee if early bird fee is enabled in settings
      if (courseFeeSettings?.[0]?.is_early_bird_fee_enabled) {
        modifiedFeeLevels = {
          ...modifiedFeeLevels,
          earlyBirdSubTotal: (
            val?.early_bird_total -
            val?.early_bird_total * taxRate
          )?.toFixed(2),
          earlyBirdTax: (val?.early_bird_total * taxRate)?.toFixed(2),
          earlyBirdTotal: parseFloat(val?.early_bird_total || "")?.toFixed(2),
        };
      }
      return modifiedFeeLevels;
    });

  const { fields: feeLevels, replace } = useFieldArray({
    name: "program_fee_level_settings",
  });
 
  // Sorted the data for ordering fee_levels_ids in this order: regular, student, repeater, senior citizen and remaining custom fees (MVP:1502)
const sortCourseFeeData= sortFeeLevels(courseFeeData);

  useEffect(() => {
    //Initializing setting data into form if fee is editable.Appending only if we have no data present in field
    if (isFeeEditable && feeLevels?.length == 0) {
      const feeData = sortCourseFeeData?.map((fee) => {
        return {
          // By default all checkbox will be false
          is_enable: fee?.is_enable,
          total: fee?.total,
          early_bird_total: fee?.earlyBirdTotal || 0,
          fee_level_id: fee?.feeLevelId,
          is_custom_fee: fee?.is_custom_fee,
          custom_fee_label: fee?.custom_fee_label,
          order: fee?.order,
        };
      });
      console.log(feeData, "feeData");
      replace(feeData);
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
      header: t("fee_level"),
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.subTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.normal_fee")} (${
        countryConfigData?.default_currency_code
      })`,
    },
    //No need to show tax column if tax is not enabled for selected organization
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.tax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.vat reg")} (${
        countryConfigData?.default_currency_code
      })`,
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.total}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.fee")} (${
        countryConfigData?.default_currency_code
      })`,
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
      header: t("fee_level"),
    },
    {
      cell: ({ row }) => {
        const {
          field: { value: total },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][total]`,
        });

        const normalFee = total - total * taxRate;

        return <div className="">{normalFee?.toFixed(2)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.normal_fee")} (${
        countryConfigData?.default_currency_code
      })`,
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        const {
          field: { value: total },
        } = useController({
          name: `program_fee_level_settings[${row?.index}][total]`,
        });

        const tax = total * taxRate;
        return <div className="">{tax?.toFixed(2)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.vat reg")} (${
        countryConfigData?.default_currency_code
      })`,
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
                const formattedValue = parseFloat(total).toFixed(2);
                setTotal(formattedValue);
                onChange(formattedValue);
              }}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.fee")} (${
        countryConfigData?.default_currency_code
      })`,
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
      header: `${t("course.new_course:fees_tab.early_bird")} (${
        countryConfigData?.default_currency_code
      })`,
    },
    organizationData?.tax_enabled && {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTax}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("new_strings:vat_reg")} (${
        countryConfigData?.default_currency_code
      })`,
    },
    {
      cell: ({ row }) => {
        return <div className="">{row?.original?.earlyBirdTotal}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.total early")} (${
        countryConfigData?.default_currency_code
      })`,
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

        return <div className="">{earlyBirdSubTotal?.toFixed(2)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.early_bird")} (${
        countryConfigData?.default_currency_code
      })`,
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
        return <div className="">{tax?.toFixed(2)}</div>;
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.vat reg")} (${
        countryConfigData?.default_currency_code
      })`,
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
          <div className="w-[75px] text-sm">
            <Input
              value={earlyBirdTotal}
              onChange={(val) => {
                setEarlyBirdTotal(val.target.value);
              }}
              error={error ? true : false}
              onBlur={() => {
                const formattedValue = parseFloat(earlyBirdTotal).toFixed(2);
                setEarlyBirdTotal(formattedValue);
                onChange(formattedValue);
              }}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      header: `${t("course.new_course:fees_tab.total early")} (${
        countryConfigData?.default_currency_code
      })`,
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
        header: () => <div>{t("course.new_course:fees_tab.enable_fees")}</div>,
        cell: ({ row }) => {
          const {
            field: { value, onChange },
          } = useController({
            name: `program_fee_level_settings[${row?.index}][is_enable]`,
          });

          /**
           * @constant regularFeeLevelId
           * REQUIRMENT we need to disable the check box of regular fee type
           * @description this constant stores the regular fee level id using the getOptionValueObjectByOptionOrder function
           */
          const regularFeeLevelId = getOptionValueObjectByOptionOrder(
            FEE_LEVEL,
            REGULAR
          )?.id;

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
                row?.original.feeLevelId == regularFeeLevelId &&
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

  feeColumns = feeColumns.filter(Boolean);

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
      courseFeeSettings?.[0]?.is_early_bird_fee_enabled &&
      //Early Bird Cut off Editable in settings
      courseFeeSettings?.[0]?.is_early_bird_cut_off_editable
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
          {courseFeeSettings?.[0]?.is_early_bird_fee_enabled &&
            isFeeEditable && (
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
        {isFeeEditable ? (
          feeLevels?.length > 0 && (
            <DataTable columns={feeColumns} data={sortCourseFeeData} />
          )
        ) : (
          <DataTable columns={feeColumns} data={sortCourseFeeData} />
        )}
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
  order: number;
  earlyBirdSubTotal: number;
  earlyBirdTax: number;
  earlyBirdTotal: number;
  feeLevelId: number;
  feeLevelLabel: string;
  is_enable: boolean;
  subTotal: number;
  tax: number;
  total: number;
  is_custom_fee: boolean;
  custom_fee_label: object;
};
