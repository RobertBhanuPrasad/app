import { create } from "zustand";

interface OptionLabelValueStore {
  optionLabelValue?: Enums;
  setOptionLabelValue: (by: Enums) => void;
}

export const optionLabelValueStore = create<OptionLabelValueStore>((set) => ({
  optionLabelValue: undefined,
  setOptionLabelValue: (data: Enums) => {
    set(() => ({
      optionLabelValue: data,
    }));
  },
}));

enum UserType {
  TEACHER = "TEACHER",
  ASSISTANT_TEACHER = "ASSISTANT_TEACHER",
  PROGRAM_ORGANIZER = "PROGRAM_ORGANIZER"
}

enum ProgramLanguageType {
  TRANSLATE = "TRANSLATE",
  TEACH = "TEACH"
}

enum HourFormat {
  HOURS_12 = "HOURS_12",
  HOURS_24 = "HOURS_24"
}

enum ParticipantPaymentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
  NOT_RECEIVED = "NOT_RECEIVED"
}

enum ProgramFeeLevel {
  REGULAR = "REGULAR",
  STUDENT = "STUDENT",
  REPEATER = "REPEATER",
  SENIOR_CITIZEN = "SENIOR_CITIZEN"
}

enum ParticipantPaymentType {
  SALE = "SALE",
  REFUND = "REFUND",
  PARTIAL_REFUND = "PARTIAL_REFUND"
}

enum ParticipantAttendanceStatus {
  PENDING = "PENDING",
  DROPOUT = "DROPOUT",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

enum ProgramStatus {
  FULL = "FULL",
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  DECLINED = "DECLINED",
  PENDING_REVIEW = "PENDING_REVIEW"
}

enum ProgramManageType {
  I_AM_TEACHING = "I_AM_TEACHING",
  I_AM_CO_TEACHING = "I_AM_CO_TEACHING",
  I_AM_ORGANIZING = "I_AM_ORGANIZING"
}

enum ProgramVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}

enum ProgramAccountingStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  REJECTED = "REJECTED",
  PENDING_REVIEW = "PENDING_REVIEW",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED"
}

enum PaymentMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

enum ProgramScheduleType {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING"
}

enum ProgramCertificationLevel {
  CERTIFIED = "CERTIFIED",
  ASSIST = "ASSIST",
  CO_TEACH = "CO_TEACH",
  SUSPENDED = "SUSPENDED"
}

enum ProgramLevel {
  ENTRY_LEVEL = "ENTRY_LEVEL",
  GRADUATE = "GRADUATE",
  FOLLOWUP = "FOLLOWUP"
}

enum ProgramCategory {
  COURSE = "COURSE",
  FOLLOWUP = "FOLLOWUP",
  WORKSHOP = "WORKSHOP",
  CAMPAIGN = "CAMPAIGN"
}

interface Enums {
  user_type: typeof UserType;
  program_language_type: typeof ProgramLanguageType;
  hour_format: typeof HourFormat;
  participant_payment_status: typeof ParticipantPaymentStatus;
  program_fee_level: typeof ProgramFeeLevel;
  participant_payment_type: typeof ParticipantPaymentType;
  participant_attendance_status: typeof ParticipantAttendanceStatus;
  program_status: typeof ProgramStatus;
  program_manage_type: typeof ProgramManageType;
  program_visibility: typeof ProgramVisibility;
  program_accounting_status: typeof ProgramAccountingStatus;
  payment_mode: typeof PaymentMode;
  program_schedule_type: typeof ProgramScheduleType;
  program_certification_level: typeof ProgramCertificationLevel;
  program_level: typeof ProgramLevel;
  program_category: typeof ProgramCategory;
}

