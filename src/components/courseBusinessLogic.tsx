import { AnyPtrRecord } from "dns";
import _ from "lodash";
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
  VIEW_COURSE_ACCOUNTING_FORM_TAB,
} from "src/constants/CourseConstants";
import {
  COURSE_ACCOUNTING_STATUS,
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
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
PARTICIPANT_FAILED_PAYMENT_STATUS,
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PENDING_ATTENDANCE_STATUS,
  PENDING_REVIEW,
  PROGRAM_ORGANIZER,
  REJECTED,
  SUPER_ADMIN,
  TEACHER
} from 'src/constants/OptionValueOrder'
import { getOptionValueObjectByOptionOrder } from 'src/utility/GetOptionValuesByOptionLabel'
import { useTranslation } from 'next-i18next';
/**
 * Is course approved
 */
export const isApproved = (isApprovalRequired: any, courseStatusId: any, roleId: any) => {
  const coursePendingReviewStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, PENDING_REVIEW)?.id
  const superAdminRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, SUPER_ADMIN)?.id

  const nationalAdminRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, NATIONAL_ADMIN)?.id

  if (
    isApprovalRequired &&
    courseStatusId == coursePendingReviewStatusId &&
    (roleId === superAdminRoleId || roleId === nationalAdminRoleId)
  )
    return true
  else {
    return false
  }
}

/**
 * Function to determine options available based on course status, accounting status, and user role.
 *  It utilizes predefined IDs for course status, accounting status,
 * and user roles to fetch the necessary data.
 *
 * @param {any} courseStatusId - The ID representing the course status.
 * @param {any} courseAccountingStatusId - The ID representing the accounting status of the course.
 * @param {any} roleId - The ID representing the role of the user.
 * @returns {Array} Array of options available based on the provided conditions and user roles.
 */

export const DisplayOptions = (courseStatusId: any, courseAccountingStatusId: any, roleId: any) => {
  const {t} = useTranslation()
  // Getting all the course status ID's
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, ACTIVE)?.id
  const courseCanceledStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, CANCELED)?.id

  const courseFullStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, FULL)?.id

  const courseCompletedStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, COMPLETED)?.id

  const courseDeclinedStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, DECLINED)?.id

  const coursePendingReviewStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, PENDING_REVIEW)?.id

  //Getting course accounting status id
  const accountingNotSubmittedStatusId = getOptionValueObjectByOptionOrder(COURSE_ACCOUNTING_STATUS, NOT_SUBMITTED)?.id

  const accountingRejectedStatusId = getOptionValueObjectByOptionOrder(COURSE_ACCOUNTING_STATUS, REJECTED)?.id

  const accountingClosedStatusId = getOptionValueObjectByOptionOrder(COURSE_ACCOUNTING_STATUS, CLOSED)?.id

  const accountingPendingStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    ACCOUNTING_PENDING_REVIEW
  )?.id

  const accountingCanceledStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    ACCOUNTING_CANCELED
  )?.id

  const teacherRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, TEACHER)?.id

  //Getting roleId id
  const programOrganizerRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, PROGRAM_ORGANIZER)?.id

  const superAdminRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, SUPER_ADMIN)?.id

  const nationalAdminRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, NATIONAL_ADMIN)?.id

  const financeAdminRoleId = getOptionValueObjectByOptionOrder(USER_ROLE, FINANCE_ADMIN)?.id

  // If course status is Active
  if (courseStatusId === courseActiveStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === teacherRoleId ||
        roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('course.find_course:submit_course_accounting_form'),
          value: 6
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('course.find_course:submit_course_accounting_form'),
          value: 6
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else {
      console.log('No options available for the given conditions.')
    }
  }
  //if course status is completed
  else if (courseStatusId === courseCompletedStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === teacherRoleId ||
        roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('course.find_course:submit_course_accounting_form'),
          value: 6
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (roleId === superAdminRoleId || roleId === nationalAdminRoleId || roleId === financeAdminRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (roleId === superAdminRoleId || roleId === nationalAdminRoleId || roleId === financeAdminRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (roleId === superAdminRoleId || roleId === nationalAdminRoleId || roleId === financeAdminRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
    } else {
      console.log('No options available for the given conditions.')
    }
  }
  //if course status is full
  else if (courseStatusId === courseFullStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === teacherRoleId ||
        roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('course.find_course:submit_course_accounting_form'),
          value: 6
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
    } else if (
      courseAccountingStatusId === accountingPendingStatusId &&
      (roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
    } else if (
      courseAccountingStatusId === accountingRejectedStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === teacherRoleId ||
        roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label:  t('register_participant'),
          value: 2
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('cancel_course'),
          value: 5
        },
        {
          label: t('new_strings:edit_course_accounting_form'),
          value: 8
        }
      ]
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('edit_course'),
          value: 3
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        },
      ]
    } else if (
      courseAccountingStatusId === accountingClosedStatusId &&
      (roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        },
        {
          label: t('copy_course'),
          value: 4
        },
        {
          label: t('new_strings:view_course_accounting_form'),
          value: 7
        }
      ]
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
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === teacherRoleId ||
        roleId === programOrganizerRoleId)
    ) {

      return [
        {
          label: t('view_participants'),
          value: 1
        }
      ]
    } else {
      console.log('No options available for the given conditions.')
    }
  }
  //if course status is pending review
  else if (courseStatusId === coursePendingReviewStatusId) {
    if (
      (courseAccountingStatusId === accountingNotSubmittedStatusId ||
        courseAccountingStatusId == accountingPendingStatusId) &&
      (roleId === superAdminRoleId || roleId === nationalAdminRoleId)
    ) {
      return [
        {
          label: 'Edit course',
          value: 3
        },
        {
          label: 'Cancel course',
          value: 5
        }
      ]
    } else if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (roleId === financeAdminRoleId || roleId === teacherRoleId || roleId === programOrganizerRoleId)
    ) {
      return [
        {
          label: 'Cancel course',
          value: 5
        }
      ]
    } else if (courseAccountingStatusId == accountingPendingStatusId && roleId === financeAdminRoleId) {
      return [
        {
          label: 'Edit course',
          value: 3
        },
        {
          label: 'Cancel course',
          value: 5
        }
      ]
    } else {
      console.log('No options available for the given conditions.')
    }
  }
  //If course status is declined
  else if (courseStatusId === courseDeclinedStatusId) {
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId &&
      (roleId === superAdminRoleId ||
        roleId === nationalAdminRoleId ||
        roleId === financeAdminRoleId ||
        roleId === teacherRoleId ||
        roleId === programOrganizerRoleId)
    ) {
      return [
        {
          label: 'Edit course',
          value: 3
        },
        {
          label: 'Cancel course',
          value: 5
        }
      ]
    } else {
      console.log('No options available for the given conditions.')
    }
  } else {
    console.log('Course is not active.')
  }
}

export const handleTabsBasedOnStatus = (courseStatusId: any, tabIndex: any) => {
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, ACTIVE)?.id
  const courseCanceledStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, CANCELED)?.id

  const courseFullStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, FULL)?.id

  const courseCompletedStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, COMPLETED)?.id

  const courseDeclinedStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, DECLINED)?.id

  const coursePendingReviewStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, PENDING_REVIEW)?.id
  //Course status id is Active then course details tab,participant tab,revenue summary tab, course accounting tabs are enabled
  if (courseStatusId == courseActiveStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false
    if (PARTICIPANTS_TAB == tabIndex) return false
    if (REVENUE_SUMMARY_TAB == tabIndex) return false
    if (COURSE_ACCOUNTING_FORM_TAB == tabIndex) return false
    else return true
    //Course status id is Pending then course details tab is enabled
  } else if (courseStatusId == coursePendingReviewStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false
    else return true
    //Course status id is Cancel then course details tab,participant tab,revenue summary tab are enabled
  } else if (courseStatusId == courseCanceledStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false
    if (PARTICIPANTS_TAB == tabIndex) return false
    if (REVENUE_SUMMARY_TAB == tabIndex) return false
    else return true
    //Course status id is Declined then course details tab is enabled
  } else if (courseStatusId == courseDeclinedStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false
    else return true
    //Course status id is Completed then course details tab,participant tab,revenue summary tab, course accounting tabs are enabled
  } else if (courseStatusId == courseCompletedStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false
    if (PARTICIPANTS_TAB == tabIndex) return false
    if (REVENUE_SUMMARY_TAB == tabIndex) return false
    if (COURSE_ACCOUNTING_FORM_TAB == tabIndex) return false
    else return true
    //Course status id is Completed then course details tab,participant tab,revenue summary tab, course accounting tabs are enabled
  } else if (courseStatusId == courseFullStatusId) {
    if (COURSE_DETAILS_TAB == tabIndex) return false
    if (PARTICIPANTS_TAB == tabIndex) return false
    if (REVENUE_SUMMARY_TAB == tabIndex) return false
    if (COURSE_ACCOUNTING_FORM_TAB == tabIndex) return false
    else return true
  }
}

/**
 * Determines the status color based on the provided status ID.
 * @param statusId The status ID to determine the color for.
 * @returns An object containing the color code and styles for the status.
 */
export const getCourseStatusColorBasedOnStatusId = (statusId: number) => {
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, ACTIVE)?.id
  const coursePendingReviewStatusId = getOptionValueObjectByOptionOrder(PROGRAM_STATUS, PENDING_REVIEW)?.id

  // Check if the status ID matches the active status ID
  if (statusId === courseActiveStatusId) {
    // Return color code and styles for active status
    return { colorCode: '#15AF53', styles: 'text-[#15AF53] bg-[#15AF53]/10' }
  }
  // Check if the status ID matches the pending review status ID
  if (statusId === coursePendingReviewStatusId) {
    // Return color code and styles for pending review status
    return { colorCode: '#FFB900', styles: 'text-[#FFB900] bg-[#FFB900]/10' }
  }
  // If status ID does not match any known status, return undefined
  // This may indicate an invalid or unknown status ID
};

export type ActionProps = {
  /**
   * The ID representing attendance status.
   */
  attendenceStatusId: number;

  /**
   * The ID representing transaction status.
   */
  transactionStatusId: number;

  /**
   * Boolean indicating whether the health declaration is checked.
   */
  isHealthDeclarationChecked: boolean;

  /**
   * Boolean indicating whether the PPA consent is checked.
   */
  isPPAConsentChecked: boolean;
};

/**
 * Function to determine actions based on various conditions such as attendance status, transaction status, PPA consent, and health declaration.
 * @param attendenceStatusId The ID of the attendance status.
 * @param transactionStatusId The ID of the transaction status.
 * @param isPPAConsentChecked Boolean indicating whether PPA consent is checked.
 * @param isHealthDeclarationChecked Boolean indicating whether health declaration is checked.
 * @returns Array of actions based on the provided conditions.
 */
export const getActions = ({
  attendenceStatusId,
  transactionStatusId,
  isPPAConsentChecked,
  isHealthDeclarationChecked,
}: ActionProps) => {
  // Get the ID for pending attendance status
  const pendingAttendenceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    PENDING_ATTENDANCE_STATUS
  )?.id;

  // Get the ID for pending transaction status
  const pendingTransactionStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_PENDING_PAYMENT_STATUS
  )?.id;

  // Define conditions and corresponding actions
  const conditions = [
    {
      // If the attendance status is pending then i need an action Update attendance status
      condition: attendenceStatusId === pendingAttendenceStatusId,
      //TODO I need to add cancel attendance status also based on settings data
      action: "Update attendance status",
    },

    // If the transaction status is pending then i need an action Update transaction status
    {
      condition: transactionStatusId === pendingTransactionStatusId,
      action: "Update transaction status",
    },

    // If the PPA consent is unchecked then i need an action Pending PPA consent
    {
      condition: !isPPAConsentChecked,
      action: "Pending PPA consent",
    },

    // If the Health consent is unchecked then i need an action Pending Health consent
    {
      condition: !isHealthDeclarationChecked,
      action: "Pending Health consent",
    },
  ];

  // Filter conditions and map actions
  return _.filter(conditions, "condition").map(({ action }) => action);
};

/**
 * Function to determine whether to display course accounting form or view course accounting form.
 * @param {number} courseStatusId - The ID representing the course status.
 * @param {number} courseAccountingStatusId - The ID representing the accounting status of the course.
 * @returns boolean value
 */
export const isViewCourseAccountingTabDisplay = (
  courseStatusId: number,
  courseAccountingStatusId: number
) => {
  // Getting the ID for the active course status
  const courseActiveStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    ACTIVE
  )?.id;

  // Getting the ID for the full course status
  const courseFullStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    FULL
  )?.id;

  // Getting the ID for the completed course status
  const courseCompletedStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    COMPLETED
  )?.id;

  // Getting the ID for the not submitted accounting status
  const accountingNotSubmittedStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    NOT_SUBMITTED
  )?.id;

  // Getting the ID for the rejected accounting status
  const accountingRejectedStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    REJECTED
  )?.id;

  // Getting the ID for the closed accounting status
  const accountingClosedStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    CLOSED
  )?.id;

  // Getting the ID for the pending review accounting status
  const accountingPendingStatusId = getOptionValueObjectByOptionOrder(
    COURSE_ACCOUNTING_STATUS,
    ACCOUNTING_PENDING_REVIEW
  )?.id;

  // Check if the course status is active, completed, or full
  if (
    courseStatusId === courseActiveStatusId ||
    courseStatusId === courseCompletedStatusId ||
    courseStatusId === courseFullStatusId
  ) {
    // If the accounting status is pending review or closed, return true
    if (
      courseAccountingStatusId === accountingPendingStatusId ||
      courseAccountingStatusId === accountingClosedStatusId
    ) {
      return true;
    }
    // If the accounting status is not submitted or rejected, return false
    if (
      courseAccountingStatusId === accountingNotSubmittedStatusId ||
      courseAccountingStatusId === accountingRejectedStatusId
    ) {
      return false;
    }
  }
};

/**
 * Check if the course accounting form is approved based on its status ID and the user's role ID
 * @param {number} courseAccountingStatusId The status ID of the course accounting form
 * @param {number} roleId The role ID of the user
 * @returns {boolean} True if the course accounting form is approved, false otherwise
 */
export const isCourseAccountingFormApprovalNeeded = (
  courseAccountingStatusId: number,
  roleId: number
) => {
  // Get the status ID for the 'Pending Review' status of course accounting
  const courseAccountingPendingReviewStatusId =
    getOptionValueObjectByOptionOrder(
      COURSE_ACCOUNTING_STATUS,
      ACCOUNTING_PENDING_REVIEW
    )?.id;

  //TODO Get the role ID for the 'National Admin' role to compare whether the logged in user is national admin or not

  // Check if the course accounting form is in 'Pending Review' status and the user is a Super Admin or National Admin
  if (courseAccountingPendingReviewStatusId === courseAccountingStatusId) {
    return true; // Return true if the conditions are met
  } else {
    return false; // Return false otherwise
  }
};

/**
 * Requirement: Submit CTA must be displayed (enabled form) only when the Course Status is 'Completed' .
 * @param {number} courseStatusId The status ID of the course
 * if returns true show submut button
 * if returns false don't show submut button
 */
export const isCAFSubmitButtonVisible = (courseStatusId: number) => {
  // Get the status ID for the 'Pending Review' status of course accounting
  const courseCompleteStatusId = getOptionValueObjectByOptionOrder(
    PROGRAM_STATUS,
    COMPLETED
  )?.id;

  // Check if the course status is 'Completed'
  if (courseCompleteStatusId === courseStatusId) {
    return true; // Return true if the conditions are met
  } else {
    return false; // Return false otherwise
  }
};
