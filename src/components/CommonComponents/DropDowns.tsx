import { BaseOption, CrudFilter, useSelect } from "@refinedev/core";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Input } from "src/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { supabaseClient } from "src/utility";


export const VenueNameComponent = () => {
  const {
    field: { value: venueName, onChange: venueOnchange },
    fieldState: { error: venueError },
  } = useController({
    name: "name",
  });
const { t } = useTranslation( [ "common", 'course.new_course']); 

return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        {t("new_strings:venue")} <div className="text-[#7677F4]"> *</div>
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={venueName}
          placeholder= {t("course.new_course:time_and_venue_tab.venue_name_placeholder")}
          className="placeholder:text-[#999999]"
          onChange={venueOnchange}
          error={venueError ? true : false}
        />
        {venueError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {venueError.message}
        </span>
      )}
      </div>
    </div>
  );
};

export const PostalCodeComponent = () => {
  const {
    field: { value: postalCodeValue, onChange: postalCodeOnchange },
    fieldState: { error },
  } = useController({
    name: "postal_code",
  });
  const { setValue } = useFormContext();

  const fetchCityStateData = async () => {
    if (postalCodeValue?.length > 4) {
      const { data: prefillData } = await supabaseClient
        .from("city")
        .select("*")
        .eq("postal_code", postalCodeValue);
      if (prefillData && prefillData?.length > 0) {
        setValue("city_id", prefillData?.[0]?.id);
        setValue("state_id", prefillData?.[0]?.state_id);
      }
    }
  };
  useEffect(() => {
    fetchCityStateData();
  }, [postalCodeValue]);

  const { t } = useTranslation( [ "common", 'course.new_course']);
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]"> {t("course.new_course:time_and_venue_tab.postal_code")}</div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={postalCodeValue}
          placeholder={t("course.new_course:time_and_venue_tab.postal_code_placeholder")}
          className="placeholder:text-[#999999]"
          onChange={postalCodeOnchange}
          error={error ? true : false}
        />
        {error && (
        <span className="text-[#FF6D6D] text-[12px]">
          {error.message}
        </span>
      )}
      </div>
    </div>
  );
};

export const StreetAddressComponent = () => {
  const {
    field: { value: streetAddressValue, onChange: streetAddressOnchange },
    fieldState: { error },
  } = useController({
    name: "address",
  });

  const { t } = useTranslation( [ "common", 'course.new_course']);
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">{t("course.new_course:time_and_venue_tab.street_address")}</div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={streetAddressValue}
          placeholder={t("course.new_course:time_and_venue_tab.street_address_placeholder")}
          className="placeholder:text-[#999999]"
          onChange={streetAddressOnchange}
          error={error ? true : false}
        />
        {error && (
        <span className="text-[#FF6D6D] text-[12px]">
          {error.message}
        </span>
      )}
      </div>
    </div>
  );
};

export const CityDropDown = ({ name }: { name: string }) => {
  const {t}=useTranslation("common")
  const [pageSize, setPageSize] = useState(10);

  const {
    field: { value: cityValue, onChange: cityValueOnChange },
    fieldState: { error: cityValueError },
  } = useController({ name });

  const { watch, setValue } = useFormContext();
  const formData = watch();

  let filter: Array<CrudFilter> = [];
  if (formData?.state_id) {
    filter.push({
      field: "state_id",
      operator: "eq",
      value: formData?.state_id,
    });
  }

  const { options, onSearch } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    filters: filter,
    defaultValue: cityValue,
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      mode: "server",
      pageSize: pageSize,
    },
  });

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10);
  };

  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">{t('city')}</div>

      <Select value={cityValue} onValueChange={cityValueOnChange}>
        <SelectTrigger className="w-full" error={cityValueError ? true : false}>
          <SelectValue placeholder={t("city_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              onSearch(value);
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options.map((option: BaseOption) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="h-[44px]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      {cityValueError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {cityValueError.message}
        </span>
      )}
    </div>
  );
};

export const StateDropDown = ({ name }: { name: string }) => {
  const [pageSize, setPageSize] = useState(10);

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const {
    field: { value: stateValue, onChange: stateValueOnchange },
    fieldState: { error: stateValueError },
  } = useController({
    name,
  });

  const { options, onSearch: stateOnsearch } = useSelect({
    resource: "state",
    meta: { select: "*" },
    optionLabel: "name",
    optionValue: "id",
    defaultValue: stateValue,
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      mode: "server",
      pageSize: pageSize,
    },
  });

  const handleOnBottomReached = () => {
    setPageSize((pageSize) => pageSize + 10);
  };
  const { t } = useTranslation( [ "common", 'course.new_course']);

  return (
    <div className="flex gap-1 flex-col h-[60px] w-full">
      <div className="text-xs font-normal text-[#333333]">{t("course.new_course:time_and_venue_tab.province")}</div>

      <Select value={stateValue} onValueChange={stateValueOnchange}>
        <SelectTrigger
          className="w-full"
          error={stateValueError ? true : false}
        >
          <SelectValue placeholder={t("course.new_course:time_and_venue_tab.province_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              stateOnsearch(value);
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options?.map((option: BaseOption, index: number) => (
              <>
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="h-[44px]"
                >
                  {option.label}
                </SelectItem>
                {index < selectOptions.length - 1 && (
                  <hr className="border-[#D6D7D8]" />
                )}
              </>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      {stateValueError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {stateValueError.message}
        </span>
      )}
    </div>
  );
};

export const CenterDropDown = ({ name }: { name: string }) => {
  const [pageSize, setPageSize] = useState(10);

  const {
    field: { value: centerValue, onChange: centerValueOnChange },
    fieldState: { error: centerValueError },
  } = useController({ name });

  const { watch, setValue } = useFormContext();
  const formData = watch();

  let filter: Array<CrudFilter> = [];

  if (formData?.city_id) {
    filter.push({
      field: "city_id",
      operator: "eq",
      value: formData.city_id,
    });
  }

  if (formData?.state_id) {
    filter.push({
      field: "state_id",
      operator: "eq",
      value: formData.state_id,
    });
  }

  const { options, onSearch: centerOnSearch } = useSelect({
    resource: "center",
    optionLabel: "name",
    optionValue: "id",
    filters: filter,
    defaultValue: centerValue,
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
    pagination: {
      mode: "server",
      pageSize: pageSize,
    },
  });

  const handleOnBottomReached = () => {
    setPageSize((prevPageSize) => prevPageSize + 10);
  };

  const {t} = useTranslation(["common","new_strings"])

  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">{t('local_center')}</div>
      <Select value={centerValue} onValueChange={centerValueOnChange}>
        <SelectTrigger
          className="w-full"
          error={centerValueError ? true : false}
        >
          <SelectValue placeholder={t('new_strings:select_local_center')}/>
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              centerOnSearch(value);
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options.map((option: BaseOption) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="h-[44px]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      {centerValueError && (
        <span className="text-[#FF6D6D] text-[12px]">
          {centerValueError.message}
        </span>
      )}
    </div>
  );
};

// export const MapComponent = () => {
//   const {
//     field: { value: stateValue },
//   } = useController({
//     name: "state_id",
//   });

//   const {
//     field: { value: cityValue },
//   } = useController({
//     name: "city_id",
//   });

//   const {
//     field: {
//       value: coordinates = { lat: 37.0902, lng: -95.7129 },
//       onChange: setCoordinates,
//     },
//   }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
//     useController({
//       name: "address_line_coordinates",
//     });

//   useEffect(() => {
//     loadInitialCoordinates();
//   }, [stateValue, cityValue]);

//   const { watch, setValue } = useFormContext();

//   const formData = watch();

//   const loadInitialCoordinates = async () => {
//     if (formData?.state_id && formData?.state?.name) {
//       let location = formData?.state?.name;

//       if (formData?.city_id && formData?.city?.name) {
//         location = `${formData?.state?.name}${" "}${formData?.city?.name}`;
//       }

//       if (location) {
//         const locationData = await fetchLongitudeLatitudeData(location);
//         if (locationData?.length > 0) {
//           setCoordinates({
//             lat: locationData?.[0]?.y,
//             lng: locationData?.[0]?.x,
//           });
//         }
//       }
//     }
//   };

//   const handleChangeCoOrdinates = async (val: any) => {
//     setCoordinates(val);

//     const { data } = await supabaseClient.rpc(
//       "get_cities_by_nearest_location",
//       {
//         reference_latitude: val.lat,
//         reference_longitude: val.lng,
//         limit_count: 1,
//       }
//     );

//     if (data?.[0]?.distance < 50) {
//       setValue("state_id", data?.[0]?.city_state_id);
//       setValue("city_id", data?.[0]?.city_id);
//     }
//   };

//   return (
//     <div className=" flex w-[586px] h-[160px] rounded-[16px] border border-[#999999] my-5 text-center items-center justify-center">
//       <MapPointer
//         value={coordinates}
//         onChange={handleChangeCoOrdinates}
//         draggable={true}
//         //If coordinates are [0,0] then display whole map
//         zoom={5}
//       />
//     </div>
//   );
// };