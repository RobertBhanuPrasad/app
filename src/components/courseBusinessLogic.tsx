import {
  COURSE_ACCOUNTING_STATUS,
  PROGRAM_STATUS,
  USER_ROLE,
} from "src/constants/OptionLabels";
import {
  ACCOUNTING_CANCELED,
  ACCOUNTING_PENDING_REVIEW,
  ACTIVE,
  CANCELED,
  CLOSED,
  COMPLETED,
  DECLINED,
  FINANCE_ADMIN,
  FULL,
  NATIONAL_ADMIN,
  NOT_SUBMITTED,
  PENDING_REVIEW,
  PROGRAM_ORGANIZER,
  REJECTED,
  SUPER_ADMIN,
  TEACHER,
} from "src/constants/OptionValueOrder";
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
} from "src/constants/Tabs";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

/**
 * Function to determine options available based on course status, accounting status, and user role.
 *  It utilizes predefined IDs for course status, accounting status,
 * and user roles to fetch the necessary data.
 *
 * @param {any} courseStatusId - The ID representing the course status.
 * @param {any} courseAccountingStatusId - The ID representing the accounting status of the course.
 * @param {any} role_id - The ID representing the role of the user.
 * @returns {Array} Array of options available based on the provided conditions and user roles.
 */

export const DisplayOptions = (
  courseStatusId: any,
  courseAccountingStatusId: any,
  role_id: any
) => {
  // Getting all the course status ID's
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    ACTIVE
  )?.id;
  const courseCanceledStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    CANCELED
  )?.id;

  const courseFullStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    FULL
  )?.id;

  const courseCompletedStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    COMPLETED
  )?.id;

  const courseDeclinedStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    DECLINED
  )?.id;

  const coursePendingReviewStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    PENDING_REVIEW
  )?.id;

  //Getting course accounting status id
  const accountingNotSubmittedStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    NOT_SUBMITTED
  )?.id;

  const accountingRejectedStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    REJECTED
  )?.id;

  const accountingClosedStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    CLOSED
  )?.id;

  const accountingPendingStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    ACCOUNTING_PENDING_REVIEW
  )?.id;

  const accountingCanceledStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    ACCOUNTING_CANCELED
  )?.id;

  const teacherRoleId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    TEACHER
  )?.id;

  //Getting role_id id
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

  // If course status is Active
  if (courseStatusId === courseActiveStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "Submit/Edit Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (role_id === teacherRoleId || role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Copy Course",
        "Cancel Course",
        "Submit/Edit Course Accounting Form",
      ];
    } else {
      console.log("No options available for the given conditions.");
    }
  }
  //if course status is completed
  else if (courseStatusId === courseCompletedStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "Submit/Edit Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "View Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (role_id === teacherRoleId || role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Copy Course",
        "Cancel Course",
        "View Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "Edit Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (role_id === teacherRoleId || role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "Edit Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId)
    ) {
      return [
        "View Participants",
        "Edit Course",
        "Copy Course",
        "View Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (role_id === teacherRoleId || role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Copy Course",
        "View Course Accounting Form",
      ];
    } else {
      console.log("No options available for the given conditions.");
    }
  }
  //if course status is full
  else if (courseStatusId === courseFullStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "Submit/Edit Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Edit Course",
        "Copy Course",
        "Cancel Course",
        "View Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (role_id === teacherRoleId || role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Copy Course",
        "Cancel Course",
        "View Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Register Participant",
        "Copy Course",
        "Cancel Course",
        "Edit Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Edit Course",
        "Copy Course",
        "View Course Accounting Form",
      ];
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (role_id === teacherRoleId || role_id === programOrganizerRoleId)
    ) {
      return [
        "View Participants",
        "Copy Course",
        "View Course Accounting Form",
      ];
    } else {
      console.log("No options available for the given conditions.");
    }
  }
  //if course status is cancelled
  else if (courseStatusId === courseCanceledStatusId) {
    if (
      (courseAccountingStatusId === accountingNotSubmittedStatusId ||
        courseAccountingStatusId === accountingClosedStatusId ||
        courseAccountingStatusId === accountingCanceledStatusId) &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return ["View Participants", "undo cancellation"];
    } else {
      console.log("No options available for the given conditions.");
    }
  }
  //if course status is pending review
  else if (courseStatusId === coursePendingReviewStatusId) {
    if (
      (courseAccountingStatusId === accountingNotSubmittedStatusId ||
        courseAccountingStatusId == accountingPendingStatusId) &&
      (role_id === superAdminRoleId || role_id === nationalAdminRoleId)
    ) {
      return [
        "Edit course",
        "Approve course",
        "Decline course",
        "Cancel course",
        "Delete course",
      ];
    } else if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return ["Cancel course"];
    } else if (
      courseAccountingStatusId == accountingPendingStatusId &&
      role_id === financeAdminRoleId
    ) {
      return ["Edit course", "Cancel course"];
    } else {
      console.log("No options available for the given conditions.");
    }
  }
  //If course status is declined
  else if (courseStatusId === courseDeclinedStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (role_id === superAdminRoleId ||
        role_id === nationalAdminRoleId ||
        role_id === financeAdminRoleId ||
        role_id === teacherRoleId ||
        role_id === programOrganizerRoleId)
    ) {
      return ["Edit course", "Cancel course"];
    } else {
      console.log("No options available for the given conditions.");
    }
  } else {
    console.log("Course is not active.");
  }
};

export const handleTabsBasedOnStatus = (courseStatusId: any, tabIndex: any) => {
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    ACTIVE
  )?.id;
  const courseCanceledStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    CANCELED
  )?.id;

  const courseFullStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    FULL
  )?.id;

  const courseCompletedStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    COMPLETED
  )?.id;

  const courseDeclinedStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    DECLINED
  )?.id;

  const coursePendingReviewStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    PENDING_REVIEW
  )?.id;
  //Course status id is Active then course details tab,participant tab,revenue summary tab, course accounting tabs are enabled
  if (courseStatusId == courseActiveStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false;
    if (PARTICIPANTS_TAB == tabIndex) return false;
    if (REVENUE_SUMMARY_TAB == tabIndex) return false;
    if (COURSE_ACCOUNTING_FORM_TAB == tabIndex) return false;
    else return true;
    //Course status id is Pending then course details tab is enabled
  } else if (courseStatusId == coursePendingReviewStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false;
    else return true;
    //Course status id is Cancel then course details tab,participant tab,revenue summary tab are enabled
  } else if (courseStatusId == courseCanceledStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false;
    if (PARTICIPANTS_TAB == tabIndex) return false;
    if (REVENUE_SUMMARY_TAB == tabIndex) return false;
    else return true;
    //Course status id is Declined then course details tab is enabled
  } else if (courseStatusId == courseDeclinedStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false;
    else return true;
    //Course status id is Completed then course details tab,participant tab,revenue summary tab, course accounting tabs are enabled
  } else if (courseStatusId == courseCompletedStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false;
    if (PARTICIPANTS_TAB == tabIndex) return false;
    if (REVENUE_SUMMARY_TAB == tabIndex) return false;
    if (COURSE_ACCOUNTING_FORM_TAB == tabIndex) return false;
    else return true;
    //Course status id is Completed then course details tab,participant tab,revenue summary tab, course accounting tabs are enabled
  } else if (courseStatusId == courseFullStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false;
    if (PARTICIPANTS_TAB == tabIndex) return false;
    if (REVENUE_SUMMARY_TAB == tabIndex) return false;
    if (COURSE_ACCOUNTING_FORM_TAB == tabIndex) return false;
    else return true;
  }
};
