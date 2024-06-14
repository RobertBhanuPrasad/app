import _ from "lodash";
import { useTranslation } from "next-i18next";
import { USER_ROLE } from "src/constants/OptionLabels";
import {
  FINANCE_ADMIN,
  NATIONAL_ADMIN,
  PROGRAM_ORGANIZER,
  SUPER_ADMIN,
  TEACHER,
} from "src/constants/OptionValueOrder";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

export const getActionMenuItems = (loggedInUserRoles: any) => {
  const { t } = useTranslation(["common", "new_strings", "course.view_course"]);

  const teacherRoleId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    TEACHER
  )?.id;

  const programOrganizerRoleId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    PROGRAM_ORGANIZER
  )?.id;

  const superAdminRoleId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    SUPER_ADMIN
  )?.id;

  const nationalAdminRoleId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    NATIONAL_ADMIN
  )?.id;

  const financeAdminRoleId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    FINANCE_ADMIN
  )?.id;

  const loggedInUserRoleIds = loggedInUserRoles?.map(
    (record: any) => record?.role_id?.id
  );

  if (_.includes(loggedInUserRoleIds, superAdminRoleId)) {
    return [
      {
        option: t("course.view_course:participants_tab.view_participant"),
        order: 1,
      },
      { option: t("new_strings:edit_participant"), order: 2 },
    //   { option: t("new_strings:transfer"), order: 3 },
      { option: t("new_strings:send_email"), order: 4 },
    //   {
    //     option: t(
    //       "new_strings:perform_sale_with_cash_check_offline_credit_card_payment"
    //     ),
    //     order: 5,
    //   },
      {
        option: t("new_strings:send_registration_confirmation_email"),
        order: 6,
      },
    //   { option: t("new_strings:upload_offline_payment_receipt"), order: 7 },
      {
        option: t("course.participants:edit_participant.participants_information_tab.download_receipt"),
        order: 8,
      },
      { option: t("new_strings:transaction_activity"), order: 9 },
    ];
  } else if (_.includes(loggedInUserRoleIds, nationalAdminRoleId)) {
    return [
      {
        option: t("course.view_course:participants_tab.view_participant"),
        order: 1,
      },
      { option: t("new_strings:edit_participant"), order: 2 },
    //   { option: t("new_strings:transfer"), order: 3 },
      { option: t("new_strings:send_email"), order: 4 },
    //   {
    //     option: t(
    //       "new_strings:perform_sale_with_cash_check_offline_credit_card_payment"
    //     ),
    //     order: 5,
    //   },
      {
        option: t("new_strings:send_registration_confirmation_email"),
        order: 6,
      },
    //   { option: t("new_strings:upload_offline_payment_receipt"), order: 7 },
      {
        option: t("course.participants:edit_participant.participants_information_tab.download_receipt"),
        order: 8,
      },
      { option: t("new_strings:transaction_activity"), order: 9 },
    ];
  } else if (_.includes(loggedInUserRoleIds, teacherRoleId)) {
    return [
      {
        option: t("course.view_course:participants_tab.view_participant"),
        order: 1,
      },
      { option: t("new_strings:edit_participant"), order: 2 },
    //   { option: t("new_strings:transfer"), order: 3 },
      { option: t("new_strings:send_email"), order: 4 },
    //   {
    //     option: t(
    //       "new_strings:perform_sale_with_cash_check_offline_credit_card_payment"
    //     ),
    //     order: 5,
    //   },
      {
        option: t("new_strings:send_registration_confirmation_email"),
        order: 6,
      },
    //   { option: t("new_strings:upload_offline_payment_receipt"), order: 7 },
      {
        option: t("course.participants:edit_participant.participants_information_tab.download_receipt"),
        order: 8,
      },
      { option: t("new_strings:transaction_activity"), order: 9 },
    ];
  } else if (_.includes(loggedInUserRoleIds, programOrganizerRoleId)) {
    return [
      {
        option: t("course.view_course:participants_tab.view_participant"),
        order: 1,
      },
      { option: t("new_strings:edit_participant"), order: 2 },
    //   { option: t("new_strings:transfer"), order: 3 },
      { option: t("new_strings:send_email"), order: 4 },
    //   {
    //     option: t(
    //       "new_strings:perform_sale_with_cash_check_offline_credit_card_payment"
    //     ),
    //     order: 5,
    //   },
      {
        option: t("new_strings:send_registration_confirmation_email"),
        order: 6,
      },
    //   { option: t("new_strings:upload_offline_payment_receipt"), order: 7 },
      {
        option: t("course.participants:edit_participant.participants_information_tab.download_receipt"),
        order: 8,
      },
      { option: t("new_strings:transaction_activity"), order: 9 },
    ];
  }
};
