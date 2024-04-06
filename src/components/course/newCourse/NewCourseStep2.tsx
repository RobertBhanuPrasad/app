import Globe from "@public/assets/Globe";
import Important from "@public/assets/Important";
import LockIcon from "@public/assets/Lock";
import { CrudFilter, useGetIdentity, useSelect } from "@refinedev/core";
import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { NewCourseStep2FormNames } from "src/constants/CourseConstants";
import { PROGRAM_ORGANIZER_TYPE } from "src/constants/OptionLabels";
import { I_AM_ORGANIZER, SUPER_ADMIN } from "src/constants/OptionValueOrder";
import countryCodes from "src/data/CountryCodes";
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

export default function NewCourseStep2() {
  const { watch } = useFormContext();

  const formData = watch();

  const { data: loginUserData }: any = useGetIdentity();
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  );

  return (
    <div className="pt-2 w-auto ">
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        <div className="w-80 h-20">
          <CourseTypeDropDown />
        </div>
        {formData?.program_type?.has_alias_name && (
          <div className="w-80 h-20">
            <CourseNameDropDown />
          </div>
        )}

        {/* )} */}
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
        {formData?.is_language_translation_for_participants == "true" && (
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
        <div className="w-80 h-20">
          <GeoRestriction />
        </div>
        {formData?.is_geo_restriction_applicable == "true" && (
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
  const { watch } = useFormContext();

  const [pageSize, setPageSize] = useState(10);

  const formData = watch();

  let filter: Array<CrudFilter> = [
    //TODO: We need to filter the below but right now these columns arent existing in the API
    // {
    //   field: "organization_id",
    //   operator: "eq",
    //   value: formData?.organization_id,
    // },
    // {
    //   field: "program_category_id.value",
    //   operator: "eq",
    //   value: "Course",
    // },
  ];

  // if (formData?.teachers?.length > 0) {
  //   const programTypeIds: number[] = [];
  //   formData?.teachers?.map((val: any) => {
  //     val?.value?.program_type_teachers?.map(
  //       (val: { program_type_id: number }) =>
  //         programTypeIds.push(val?.program_type_id)
  //     );
  //   });

  //   filter.push({
  //     field: "id",
  //     operator: "in",
  //     value: programTypeIds,
  //   });
  // }

  const {
    field: { value, onChange },
    fieldState: { error: courseTypeError },
  } = useController({
    name: NewCourseStep2FormNames?.program_type_id,
  });

  const selectQuery: any = {
    resource: "program_types",
    optionLabel: "name",
    optionValue: "id",
    // meta: { select: "*,program_category_id!inner(*)" },
    onSearch: (value: any) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    //TODO: Need to uncomment when we working on filters
    // filters: filter,
    pagination: {
      pageSize: pageSize,
      mode: "server",
    },
  };

  if (value) {
    selectQuery.defaultValue = value;
  }

  const { options, onSearch, queryResult } = useSelect(selectQuery);

  const {
    field: { onChange: setCourseTypeSettings },
  } = useController({
    name: NewCourseStep2FormNames?.program_type,
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

    setCourseTypeSettings(courseSettings?.[0]);
  };

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };

  // if (queryResult.isLoading) {
  //   return null;
  // }
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
      >
        <SelectTrigger className="w-[320px]" error={courseTypeError ? true : false}>
          <SelectValue placeholder="Select course type" />
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(value: ChangeEvent<HTMLInputElement>) => {
              onSearch(value.target.value);
            }}
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

      {courseTypeError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {courseTypeError?.message}
        </span>
      )}
    </div>
  );
};

const RegistrationGateway = () => {
  const [checkedValue, setCheckedValue] = useState();
  return (
    <div className="flex flex-row items-center gap-[19px]">
      <div className="text-[14px] text-[#323232] w-[244px] font-normal text-wrap">
        Registration is mandatory for this course
      </div>
      <Switch
        id="registration"
        className="!w-[57px] !h-[24px]"
        onCheckedChange={(value: any) => {
          setCheckedValue(value);
        }}
      />
    </div>
  );
};

const CourseNameDropDown = () => {
  const [pageSize, setPageSize] = useState(10);

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
      {
        field: "program_type_id",
        operator: "eq",
        value: 1,
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
    setPageSize((previousLimit: number) => previousLimit + 10);
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
        <SelectTrigger className="w-[320px]" error = {error ? true : false}
>
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

  const iAmOrganizerId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_ORGANIZER
  )?.id;

  let filter: Array<CrudFilter> = [];

  if (formData?.courseType?.value) {
    filter.push({
      field: "program_type_teachers.program_type_id",
      operator: "eq",
      value: formData?.courseType?.value,
    });
  }

  const [currentPage, setCurrentPage] = useState(1);

  const { queryResult, onSearch } = useSelect({
    resource: "users",
    meta: {
      select:
        "*,program_type_teachers!inner(program_type_id),contact_id!inner(first_name,last_name))",
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
      current: currentPage,
      mode: "server",
    },
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (queryResult && (queryResult?.data?.total as number) >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const teachers: any = queryResult.data?.data?.map((val) => {
    return {
      label: val?.contact_id?.first_name + " " + val?.contact_id?.last_name,
      value: val,
    };
  });

  const {
    field: { value, onChange },
    fieldState: { error: teachersErrors },
  } = useController({
    name: NewCourseStep2FormNames?.teacher_ids,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333] flex flex-row">
        Teacher <div className="text-[#7677F4]">*</div>
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Teacher Name"
        data={teachers}
        onBottomReached={handleOnBottomReached}
        onSearch={onSearch}
        onChange={(val: any) => {
          onChange(val);
        }}
        getOptionProps={(option: { value: { id: number } }) => {
          //If program is created by teacher or co-teacher then we need to prefill the teacher drop-down and can't deselect
          if (
            option.value?.id === loginUserData?.userData?.id &&
            formData?.programOrganizedBy != iAmOrganizerId
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

  const [currentPage, setCurrentPage] = useState(1);

  const formData = watch();

  let filter: Array<CrudFilter> = [
    {
      field: "program_type_teachers.certification_level_id",
      operator: "eq",
      value: "38",
    },
  ];

  if (formData?.courseType?.value) {
    filter.push({
      field: "program_type_teachers.program_type_id",
      operator: "eq",
      value: formData?.courseType?.value,
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
      current: currentPage,
      mode: "server",
    },
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (queryResult && (queryResult?.data?.total as number) >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const teachers: any = queryResult.data?.data?.map((val) => {
    return {
      label: val?.contact_id?.first_name + " " + val?.contact_id?.last_name,
      value: val,
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

      <RadioGroup defaultValue="public" onValueChange={onChange} value={value}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="public"
            selectedRadioValue={value}
            label="Public"
            className="w-[112px] h-[40px] rounded-[12px] "
          />
          <RadioButtonCard
            value="private"
            selectedRadioValue={value}
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
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={value}
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
  const {
    formState: { errors },
  } = useFormContext();

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

      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] !h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={value}
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

  const [currentPage, setCurrentPage] = useState(1);

  const [selectOptions, setSelectOptions] = useState<any>();

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
    onSearch: (value) => [
      {
        field: "language_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      pageSize: 20,
      current: currentPage,
      mode: "server",
    },
  });

  useEffect(() => {
    if (currentPage > 1) setSelectOptions([...selectOptions, ...options]);
    else setSelectOptions(options);
  }, [options]);

  const filteredOptions = selectOptions?.filter((val: any) => {
    if (
      _.some(formData?.translationLanguages, (obj) => obj.value === val.value)
    )
      return false;
    return true;
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= currentPage * 20)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const handleOnSearch = (value: any) => {
    // For resetting the data to the first page which coming from the API
    setCurrentPage(1);

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

  const [currentPage, setCurrentPage] = useState(1);

  const { options, onSearch, queryResult } = useSelect({
    resource: "organization_languages",
    optionLabel: "language_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "language_name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      current: currentPage,
      mode: "server",
    },
  });

  const filteredOptions = options?.filter((val) => {
    if (_.some(formData?.languages, (obj) => obj.value === val.value))
      return false;

    return true;
  });

  // Handler for bottom reached to load more options
  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const {
    field: { value, onChange },
    fieldState: { error: languageTranslationError },
  } = useController({
    name: NewCourseStep2FormNames?.translation_language_ids,
  });

  const handleOnSearch = (value: any) => {
    setCurrentPage(1);
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

  const allowedCountries = formData?.courseTypeSettings?.allowed_countries;

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
  const { watch } = useFormContext();

  const formData = watch();

  const maxAttendees = formData?.courseTypeSettings?.maximum_capacity;

  const {
    field: { value = maxAttendees, onChange },
    fieldState: { error },
  } = useController({ name: NewCourseStep2FormNames?.max_capacity });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">Max Capacity</div>
      <Input
        placeholder="Enter no. of attendees"
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
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
