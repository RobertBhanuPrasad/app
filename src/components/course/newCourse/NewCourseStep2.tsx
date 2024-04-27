import Globe from "@public/assets/Globe";
import Important from "@public/assets/Important";
import LockIcon from "@public/assets/Lock";
import { CrudFilter, useGetIdentity, useSelect } from "@refinedev/core";
import _ from "lodash";
import { usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useFormContext, useFormState } from "react-hook-form";
import { NewCourseStep2FormNames } from "src/constants/CourseConstants";
import {
  CERTIFICATION_TYPE,
  PROGRAM_CATEGORY,
  PROGRAM_ORGANIZER_TYPE,
  VISIBILITY,
} from "src/constants/OptionLabels";
import {
  ASSIST,
  CERTIFIED,
  COURSE,
  CO_TEACH,
  I_AM_ORGANIZER,
  PRIVATE,
  PUBLIC,
  SUPER_ADMIN,
} from "src/constants/OptionValueOrder";
import countryCodes from "src/data/CountryCodes";
import { Text } from "src/ui/TextTags";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/ui/hover-card";
import { Input } from "src/ui/input";
import { DataItem, MultiSelect } from "src/ui/multi-select";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { Switch } from "src/ui/switch";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { IsEditCourse } from "./EditCourseUtil";

export default function NewCourseStep2() {
  const { watch } = useFormContext();

  const formData = watch();

  const { data: loginUserData }: any = useGetIdentity();

  // Checking weather login user is super admin or not
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  return (
    <div className="pt-2 w-auto ">
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        <div className="w-80 h-20">
          <CourseTypeDropDown />
        </div>
        {/* Course Name drop will come from settings */}
        {/* //TODO: Need to BussinessLayer for this with proper code */}
        {formData?.program_type?.has_alias_name === true && (
          <div className="w-80 h-20">
            <CourseNameDropDown />
          </div>
        )}
        <div className="w-80 h-20">
          <TeachersDropDown />
        </div>
        <div className="w-80 h-20">
          <AssistantTeachersDropDown />
        </div>
        <div className="w-80 h-20">
          <LanguageDropDown />
        </div>
        {/* Allow only for super Admin */}
        {hasSuperAdminRole && (
          <div className="w-80 h-20">
            <DisplayLanguage />
          </div>
        )}
        {formData?.is_language_translation_for_participants == true && (
          <div className="w-80 h-20">
            <LanguageTranslationDropDown />
          </div>
        )}
        {/* Allow only for super Admin */}
        {hasSuperAdminRole && (
          <div className="w-80 h-20 flex items-center">
            <RegistrationGateway />
          </div>
        )}
        <div className="w-80 h-20">
          <MaximumCapacity />
        </div>
        <div className="w-80 h-20">
          <Visibility />
        </div>
        {/* Allow only for super Admin */}
        {hasSuperAdminRole && (
          <div className="w-80 h-20">
            <GeoRestriction />
          </div>
        )}
        {formData?.is_geo_restriction_applicable && (
          <div className="w-80 h-20">
            <AllowedCountriesDropDown />
          </div>
        )}
      </div>
      <div className="flex gap-x-7 text-[14px] font-normal text-[#323232]">
        <div className="w-80 h-10 flex flex-row gap-1 items-center">
          Course Description *
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Course Description text is managed by National Admin. If the
                National Admin has allowed Organizers / Teachers to edit Course
                description then only this field will be editable. If you want
                to change the course description and this field is not editable
                kindly contact your National Admin.
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="w-80 h-10 flex flex-row gap-1 items-center">
          Course Notes *
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Text entered in the 'Course Notes' field will be shown only on
                the Art of Living Website course details page.
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="w-80 h-10 flex flex-row gap-1 items-center">
          Course Description *
          <HoverCard>
            <HoverCardTrigger>
              <Important />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
                Text entered in the 'Email Notes' field will be included in the
                registration confirmation email only irrespective of the
                transaction status (Email notes will not be shown on the Art of
                Living Website)
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}

export const CourseTypeDropDown = () => {
  const { watch, setValue, clearErrors } = useFormContext();

  /**
   * This variable holds the path of the url
   */
  const pathname = usePathname();

  console.log("heyy pathnamee", pathname);

  /**
   * Checking whether the url contains the edit or not
   */
  const isEditCourse = IsEditCourse(pathname);

  const [pageSize, setPageSize] = useState(10);

  const [searchValue, searchOnChange] = useState("");

  const formData = watch();

  const courseCategoryId = getOptionValueObjectByOptionOrder(
    PROGRAM_CATEGORY,
    COURSE
  )?.id;

  //Requirement: Fetch only the course types of organization selected in Step-1
  let filter: Array<CrudFilter> = [
    {
      field: "organization_id",
      operator: "eq",
      value: formData?.organization_id,
    },
    {
      field: "program_category_id",
      operator: "eq",
      value: courseCategoryId,
    },
  ];

  //Need to filter course types based on teacher and assistant teacher
  if (
    formData?.teacher_ids?.length > 0 ||
    formData?.assistant_teacher_ids?.length > 0
  ) {
    let userIds: number[] = [];

    if (formData?.teacher_ids?.length > 0) {
      userIds = [...userIds, ...formData?.teacher_ids];
    }

    if (formData?.assistant_teacher_ids?.length > 0) {
      userIds = [...userIds, ...formData?.assistant_teacher_ids];
    }

    filter.push({
      field: "program_type_teachers.user_id",
      operator: "in",
      value: userIds,
    });
  }

  const {
    field: { value, onChange },
    fieldState: { error: courseTypeError },
  } = useController({
    name: NewCourseStep2FormNames?.program_type_id,
  });

  const selectQuery: any = {
    resource: "program_types",
    meta: {
      select: "*,program_type_teachers!inner(user_id)",
    },
    onSearch: (value: any) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    filters: filter,
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  };

  if (value) {
    selectQuery.defaultValue = value;
  }

  const { onSearch, queryResult } = useSelect(selectQuery);

  const options: { label: string; value: number }[] =
    queryResult?.data?.data?.map((programType) => {
      return {
        label: programType?.name,
        value: programType?.id,
      };
    }) as { label: string; value: number }[];

  const {
    field: { value: courseSettings, onChange: setCourseTypeSettings },
  } = useController({
    name: NewCourseStep2FormNames?.program_type,
  });

  const {
    field: { value: maxCapacityValue, onChange: maxCapacityOnChange },
  } = useController({
    name: NewCourseStep2FormNames?.max_capacity,
  });

  /**
   * @description this function is used to get all the fields in the program_types and assign to the setCourseTypeSettings
   * @function getCourseTypeSettings
   * @param val
   * This functions sets the data which is came from program_types table usign the id we have  in the setCourseTypeSettings redux variable
   */
  const getCourseTypeSettings = async (val: any) => {
    const courseSettings = queryResult?.data?.data.filter(
      (data) => data.id == val
    );

    const maxAttendes = courseSettings?.[0].maximum_capacity
      ? courseSettings?.[0].maximum_capacity.toString()
      : undefined;

    // when we change the course type and we get new settings we need to set the max capacity from the course type settings otherwise it should be empty
    if (maxAttendes) {
      maxCapacityOnChange(maxAttendes);
    } else {
      setValue(NewCourseStep2FormNames?.max_capacity, "");
    }

    setCourseTypeSettings(courseSettings?.[0]);
  };

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize) {
      setPageSize((previousLimit: number) => previousLimit + 10);
    }
  };
  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Course Type <div className="text-[#7677F4]"> *</div>
      </div>
      <Select
        value={value}
        onValueChange={(val: any) => {
          onChange(val);
          getCourseTypeSettings(val);
        }}
        disabled={isEditCourse}
      >
        <SelectTrigger
          className="w-[320px]"
          error={courseTypeError ? true : false}
        >
          <SelectValue placeholder="Select course type" />
        </SelectTrigger>
        <SelectContent>
          <Input
            value={searchValue}
            onChange={(value: ChangeEvent<HTMLInputElement>) => {
              searchOnChange(value.target.value);
              onSearch(value.target.value);
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options?.map((option: any, index: number) => (
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

      {courseTypeError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {courseTypeError?.message}
        </span>
      )}
    </div>
  );
};

const RegistrationGateway = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewCourseStep2FormNames?.is_registration_required,
  });

  return (
    <div className="flex flex-row items-center gap-[19px]">
      <div className="text-[14px] text-[#323232] w-[244px] font-normal text-wrap">
        Registration is mandatory for this course
      </div>
      <Switch
        id="is_registration_required"
        className="!w-[57px] !h-[24px]"
        checked={value}
        onCheckedChange={(value: boolean) => {
          onChange(value);
        }}
      />
    </div>
  );
};

const CourseNameDropDown = () => {
  const [pageSize, setPageSize] = useState(10);

  const { watch } = useFormContext();

  const formData = watch();

  const { options, onSearch, queryResult } = useSelect({
    resource: "program_type_alias_names",
    optionLabel: "alias_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "alias_name",
        operator: "contains",
        value,
      },
    ],
    filters: [
      //Need to fetch alias names of program_types
      {
        field: "program_type_id",
        operator: "eq",
        value: formData?.program_type_id,
      },
    ],
    pagination: {
      pageSize,
      mode: "server",
    },
  });

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: NewCourseStep2FormNames?.program_alias_name_id,
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (queryResult?.data?.data && queryResult?.data?.total >= pageSize) {
      setPageSize((previousLimit: number) => previousLimit + 10);
    }
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Course Name <div className="text-[#7677F4]">*</div>
      </div>

      <Select
        value={value}
        onValueChange={(val) => {
          onChange(val);
        }}
      >
        <SelectTrigger className="w-[320px]" error={error ? true : false}>
          <SelectValue placeholder="Select course alias name" />
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(value: ChangeEvent<HTMLInputElement>) =>
              onSearch(value.target.value)
            }
          />
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

      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
    </div>
  );
};

const TeachersDropDown = () => {
  const { data: loginUserData }: any = useGetIdentity();

  const { watch } = useFormContext();

  const formData = watch();

  const {
    field: { value, onChange },
    fieldState: { error: teachersErrors },
  } = useController({
    name: NewCourseStep2FormNames?.teacher_ids,
  });

  const iAmOrganizerId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_ORGANIZER
  )?.id;

  /**
   * This holds the certification certified level id
   */
  const certificationCeritifiedLevelId = getOptionValueObjectByOptionOrder(
    CERTIFICATION_TYPE,
    CERTIFIED
  )?.id;

  /**
   * This holds the certification co teach level id
   */
  const certificationCoTeachLevelId = getOptionValueObjectByOptionOrder(
    CERTIFICATION_TYPE,
    CO_TEACH
  )?.id;

  /**
   * Initiall filter array holds the certification level for teachers and it fetch only those whose certification levl is co teach and cerified
   */
  let filter: Array<CrudFilter> = [
    {
      field: "program_type_teachers.certification_level_id",
      operator: "in",
      value: [certificationCeritifiedLevelId, certificationCoTeachLevelId],
    },
  ];

  if (formData?.program_type_id) {
    filter.push({
      field: "program_type_teachers.program_type_id",
      operator: "eq",
      value: formData?.program_type_id,
    });
  }

  // we have to get teachers based on the selected organization
  if (formData?.organization_id) {
    filter.push({
      field: "program_type_teachers.program_type_id.organization_id",
      operator: "eq",
      value: formData?.organization_id,
    });
  }

  const [pageSize, setPageSize] = useState(10);

  const selectQuery: any = {
    resource: "users",
    meta: {
      select:
        "*,program_type_teachers!inner(certification_level_id,program_type_id!inner(organization_id)),contact_id!inner(full_name))",
    },
    filters: filter,
    onSearch: (value: any) => [
      {
        field: "contact_id.full_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
    optionLabel: "contact_id.full_name",
    optionValue: "id",
  };

  if (value) {
    selectQuery.defaultValue = value;
  }

  const { options, queryResult, onSearch } = useSelect(selectQuery);

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (queryResult && (queryResult?.data?.total as number) >= pageSize) {
      setPageSize((previousLimit: number) => previousLimit + 10);
    }
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row">
        Teacher <div className="text-[#7677F4]">*</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Teacher Name"
        data={options}
        onBottomReached={handleOnBottomReached}
        onSearch={onSearch}
        onChange={(val: any) => {
          onChange(val);
        }}
        getOptionProps={(option: { value: { id: number } }) => {
          //If program is created by teacher or co-teacher then we need to prefill the teacher drop-down and can't deselect
          if (
            option === loginUserData?.userData?.id &&
            formData?.program_created_by != iAmOrganizerId
          ) {
            return {
              disable: true,
            };
          } else {
            return {
              disable: false,
            };
          }
        }}
        error={teachersErrors}
      />
      {teachersErrors && (
        <span className="text-[#FF6D6D] text-[12px]">
          {teachersErrors?.message}
        </span>
      )}
    </div>
  );
};

const AssistantTeachersDropDown = () => {
  const { watch } = useFormContext();

  const [pageSize, setPageSize] = useState(10);

  const formData = watch();

  //Finding program Organizer role id
  const certificationLevelId = getOptionValueObjectByOptionOrder(
    CERTIFICATION_TYPE,
    ASSIST
  )?.id;

  let filter: Array<CrudFilter> = [
    {
      field: "program_type_teachers.certification_level_id",
      operator: "eq",
      value: certificationLevelId,
    },
  ];

  if (formData?.program_type_id) {
    filter.push({
      field: "program_type_teachers.program_type_id",
      operator: "eq",
      value: formData?.program_type_id,
    });
  }

  const { queryResult, onSearch } = useSelect({
    resource: "users",
    meta: {
      select:
        "*,contact_id!inner(first_name,last_name),program_type_teachers!inner(program_type_id,certification_level_id)",
    },
    filters: filter,
    onSearch: (value) => [
      {
        field: "contact_id.full_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (queryResult && (queryResult?.data?.total as number) >= pageSize)
      setPageSize((previousLimit: number) => previousLimit + 10);
  };

  const teachers: any = queryResult.data?.data?.map((val) => {
    return {
      label: val?.contact_id?.first_name + " " + val?.contact_id?.last_name,
      value: val?.id,
    };
  });

  const {
    field: { value, onChange },
    fieldState: { error: assistantTeachersErrors },
  } = useController({
    name: NewCourseStep2FormNames?.assistant_teacher_ids,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Assistant Teacher
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Teacher Name"
        data={teachers}
        onBottomReached={handleOnBottomReached}
        onSearch={onSearch}
        onChange={onChange}
        error={assistantTeachersErrors}
      />
      {assistantTeachersErrors && (
        <span className="text-[#FF6D6D] text-[12px]">
          {assistantTeachersErrors?.message}
        </span>
      )}
    </div>
  );
};

const Visibility = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewCourseStep2FormNames?.visibility_id,
  });

  //Finding program Organizer role id
  const publicVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PUBLIC
  )?.id;

  const privateVisibilityId = getOptionValueObjectByOptionOrder(
    VISIBILITY,
    PRIVATE
  )?.id;

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Program Visibility <div className="text-[#7677F4]"> *</div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px]">
              <div className="flex flex-row gap-1 items-center">
                <Globe />
                Public
              </div>
              <div>
                There are a lot of things you can do in space, and space
                essentially is unlimited resources.
              </div>
              <div className="my-2">
                <hr></hr>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <LockIcon />
                Private
              </div>
              <div>
                There are a lot of things you can do in space, and space
                essentially is unlimited resources.
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <RadioGroup
        onValueChange={(val: string) => {
          onChange(parseInt(val));
        }}
        value={JSON.stringify(value)}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value={JSON.stringify(publicVisibilityId)}
            selectedRadioValue={JSON.stringify(value)}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px] "
          />
          <RadioButtonCard
            value={JSON.stringify(privateVisibilityId)}
            selectedRadioValue={JSON.stringify(value)}
            label="Private"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

const DisplayLanguage = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewCourseStep2FormNames?.is_language_translation_for_participants,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Display language translation option for participants *
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(value) => {
          value === "true" ? onChange(true) : onChange(false);
        }}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

const GeoRestriction = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewCourseStep2FormNames?.is_geo_restriction_applicable,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Is geo restriction applicable for registrations
        <div className="text-[#7677F4]">*</div>
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-[231px] text-wrap !rounded-[15px] font-normal">
              Text entered in the 'Email Notes' field will be included in the
              registration confirmation email only irrespective of the
              transaction status (Email notes will not be shown on the Art of
              Living Website)
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(val: string) => {
          val == "true" ? onChange(true) : onChange(false);
        }}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label="No"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};
const LanguageDropDown = () => {
  const { watch } = useFormContext();

  const formData = watch();

  const [pageSize, setPageSize] = useState(10);

  const {
    field: { value, onChange },
    fieldState: { error: languageError },
  } = useController({
    name: NewCourseStep2FormNames?.language_ids,
  });

  const { options, onSearch, queryResult } = useSelect({
    resource: "languages",
    optionLabel: "language_name",
    optionValue: "id",
    defaultValue: value,
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: formData?.organization_id,
      },
    ],
    onSearch: (value) => [
      {
        field: "language_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });

  const filteredOptions = options?.filter((val: any) => {
    if (formData?.translation_language_ids?.includes(val?.value)) return false;
    return true;
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= pageSize)
      setPageSize((previousLimit: number) => previousLimit + 10);
  };

  const handleOnSearch = (value: any) => {
    onSearch(value);
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className=" flex flex-row text-xs font-normal text-[#333333]">
        Language(s) course is taught in
        <div className="text-[#7677F4]"> *</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Select Language"
        data={filteredOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={handleOnSearch}
        onChange={onChange}
        error={languageError}
      />
      {languageError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {languageError?.message}
        </span>
      )}
    </div>
  );
};

const LanguageTranslationDropDown = () => {
  const { watch } = useFormContext();

  const formData = watch();

  const [pageSize, setPageSize] = useState(10);

  const { options, onSearch, queryResult } = useSelect({
    resource: "languages",
    optionLabel: "language_name",
    optionValue: "id",
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: formData?.organization_id,
      },
    ],
    onSearch: (value) => [
      {
        field: "language_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  });

  const filteredOptions = options?.filter((val) => {
    if (formData?.language_ids?.includes(val.value)) return false;

    return true;
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= pageSize)
      setPageSize((previousLimit: number) => previousLimit + 10);
  };

  const {
    field: { value, onChange },
    fieldState: { error: languageTranslationError },
  } = useController({
    name: NewCourseStep2FormNames?.translation_language_ids,
  });

  const handleOnSearch = (value: any) => {
    onSearch(value);
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Available language(s) for translation
      </div>
      <MultiSelect
        value={value}
        placeholder="Select translation languages"
        data={filteredOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={handleOnSearch}
        onChange={onChange}
        error={languageTranslationError}
      />
    </div>
  );
};

const AllowedCountriesDropDown = () => {
  const { watch } = useFormContext();

  const formData = watch();

  const countryArray: DataItem[] = Object.entries(countryCodes).map(
    ([countryCode, countryName]) => ({
      label: countryName,
      value: countryCode,
    })
  );

  const allowedCountries = formData?.program_type?.allowed_countries;

  const allowedCountriesData = countryArray?.filter((val) =>
    allowedCountries?.includes(val?.value)
  );

  const {
    field: { value, onChange },
    fieldState: { error: allowedCountriesErrors },
  } = useController({
    name: NewCourseStep2FormNames?.allowed_countries,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row text-xs font-normal text-[#333333]">
        Country(s) from where registrations are allowed
        <div className="text-[#7677F4]">*</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Countries"
        data={allowedCountriesData}
        onBottomReached={() => {}}
        onSearch={() => {}}
        onChange={onChange}
        error={allowedCountriesErrors}
      />
      {allowedCountriesErrors && (
        <span className="text-[#FF6D6D] text-[12px]">
          {allowedCountriesErrors?.message}{" "}
        </span>
      )}
    </div>
  );
};

const MaximumCapacity = () => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: NewCourseStep2FormNames?.max_capacity,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="flex flex-row gap-1 items-center font-normal text-[#333333]">
        <Text className="text-xs ">Max Capacity</Text>
        <Text className="text-[#7677F4]">*</Text>
        {/* popover to show the note to maximum capacity */}
        <HoverCard>
          <HoverCardTrigger>
            <Important />
          </HoverCardTrigger>
          <HoverCardContent>
            <Text className="text-[#FFFFFF] text-wrap text-xs font-normal">
              If this field is blank, then the course capacity is unlimited.
            </Text>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Input
        placeholder="Enter no. of attendees"
        value={value}
        onChange={(val) => {
          onChange(val);
        }}
        className="rounded-[12px] text-[14px] font-normal placeholder:text-[#999999]"
        error={error ? true : false}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px] !w-[320px] break-all">
          {error?.message}
        </span>
      )}
    </div>
  );
};
