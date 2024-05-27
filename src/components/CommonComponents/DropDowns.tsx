import {
  BaseOption,
  CrudFilter,
  useGetIdentity,
  useList,
  useSelect,
} from "@refinedev/core";
import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Text } from "src/ui/TextTags";
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
import { useTranslation } from "next-i18next";
import useGetCountryCode from "src/utility/useGetCountryCode";

export const VenueNameComponent = () => {
  const { t } = useTranslation(["common", "course.new_course"]);
  const {
    field: { value: venueName, onChange: venueOnchange },
    fieldState: { error: venueError },
  } = useController({
    name: "name",
  });
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        {t("course.new_course:time_and_venue_tab.venue_name")}
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px]  font-semibold text-sm">
        <Input
          value={venueName}
          placeholder={t(
            "course.new_course:time_and_venue_tab.venue_name_placeholder"
          )}
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
  const supabase = supabaseClient();
  const { t } = useTranslation(["common", "course.new_course"]);

  const {
    field: { value: postalCodeValue, onChange: postalCodeOnchange },
    fieldState: { error },
  } = useController({
    name: "postal_code",
  });
  const { setValue } = useFormContext();

  const fetchCityStateData = async () => {
    if (postalCodeValue?.length > 4) {
      const { data: prefillData } = await supabase
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
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">
        {t("course.new_course:time_and_venue_tab.postal_code")}
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px]  font-semibold text-sm">
        <Input
          value={postalCodeValue}
          placeholder={t(
            "course.new_course:time_and_venue_tab.postal_code_placeholder"
          )}
          onChange={postalCodeOnchange}
          error={error ? true : false}
        />
        {error && (
          <span className="text-[#FF6D6D] text-[12px]">{error.message}</span>
        )}
      </div>
    </div>
  );
};

export const StreetAddressComponent = () => {
  const { t } = useTranslation(["common", "course.new_course"]);
  const {
    field: { value: streetAddressValue, onChange: streetAddressOnchange },
    fieldState: { error },
  } = useController({
    name: "address",
  });
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">
        {t("course.new_course:time_and_venue_tab.street_address")}
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px]  font-semibold text-sm">
        <Input
          value={streetAddressValue}
          placeholder={t(
            "course.new_course:time_and_venue_tab.street_address_placeholder"
          )}
          onChange={streetAddressOnchange}
          error={error ? true : false}
        />
        {error && (
          <span className="text-[#FF6D6D] text-[12px]">{error.message}</span>
        )}
      </div>
    </div>
  );
};

export const CityDropDown = ({
  name,
  onChange = () => {},
}: {
  name: string;
  onChange?: any;
}) => {
  const { t } = useTranslation("common");
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

  // Function to handle city value change
  const handleCityValueChange = async (newValue: any) => {

    //Call callback function when new value is selected 
    if (newValue != cityValue) onChange();

    // If the selected city is different from the current value, reset center value
    // if (newValue !== cityValue) {
    //   setValue("center_id", "")
    // }

     // Update the city value in the form data
     cityValueOnChange(newValue)

    // If state_id is not already set, fetch the state_id corresponding to the selected city
    if (!formData?.state_id) {

    const supabase = supabaseClient()

    // Fetch state_id from the database based on the selected city's id
    const {data:state_obj, error} = await supabase
    .from("city")
    .select("state_id")
    .eq("id", newValue)
    
    if(!error){
    // Set the state_id value in the form data
    setValue("state_id",state_obj?.[0]?.state_id)
    }
    }

  };

  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">{t("city")}</Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>

      <Select value={cityValue} onValueChange={handleCityValueChange}>
        <SelectTrigger
          error={cityValueError ? true : false}
          className="font-semibold text-sm "
        >
          <SelectValue placeholder={t("city_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {formData?.state_id ? 
          <div>
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
          </div>
          :
          <SelectItems></SelectItems>
}
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

export const StateDropDown = ({
  name,
  onChange = () => {},
}: {
  name: string;
  onChange?: any;
}) => {
  const { t } = useTranslation([
    "common",
    "course.new_course",
    "course.find_course",
  ]);
  const [pageSize, setPageSize] = useState(10);
  const { setValue } = useFormContext();
  const [selectOptions, setSelectOptions] = useState<any>([]);

  /**
   * Getting country code from route using useGetCountryCode function
   */
  const countryCode = useGetCountryCode();

  /**
   * Getting country data based on country code
   */
  const { data } = useList<any>({
    resource: "country",
    filters: [
      {
        field: "abbr",
        operator: "contains",
        value: countryCode,
      },
    ],
  });

  const {
    field: { value: stateValue, onChange: stateValueOnchange },
    fieldState: { error: stateValueError },
  } = useController({
    name,
  });

  let filter: Array<CrudFilter> = [];

  //If the country code is public then dont make the filter for country
  if (countryCode !== "public") {
    filter.push({
      field: "country_id",
      operator: "eq",
      value: data?.data?.[0]?.id,
    });
  }

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
    filters: filter,
  });

  const handleOnBottomReached = () => {
    setPageSize((pageSize) => pageSize + 10);
  };

  // Function to handle state value change
  const handleStateValueChange = (newValue: any) => {

    // Reset city value and center value if state value changes
    if (newValue !== stateValue) {
      setValue("city_id", "")
      setValue("center_id", "")
    }

    //Calling callback function when new value is selected in drop down
    if (newValue != stateValue) onChange();

    // Update state value in form data
    stateValueOnchange(newValue)
  }

  return (
    <div className="flex gap-1 flex-col h-[60px] w-full">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          {t("course.find_course:state")}
        </Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>

      <Select value={stateValue} onValueChange={handleStateValueChange}>
        <SelectTrigger
          className="w-full font-semibold text-sm"
          error={stateValueError ? true : false}
        >
          <SelectValue placeholder={t("select_state")} />
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

export const CenterDropDown = ({
  name,
  onChange = () => {},
}: {
  name: string;
  onChange?: any;
}) => {
  const { t } = useTranslation(["common", "course.new_course"]);
  const [pageSize, setPageSize] = useState(10);

  const {
    field: { value: centerValue, onChange: centerValueOnChange },
    fieldState: { error: centerValueError },
  } = useController({ name });

  const { watch, setValue } = useFormContext();
  const formData = watch();

  let filter: Array<CrudFilter> = [];

  //TODO: Right now center are state based not city based.
  // if (formData?.city_id) {
  //   filter.push({
  //     field: "city_id",
  //     operator: "eq",
  //     value: formData.city_id,
  //   });
  // }

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

  // Function to handle center value change
  const handleCenterValueChange = async (newValue: any) => {

    //Call callback function when new value is selected 
    if (newValue != centerValue) onChange();

    // Update center value in form data
    centerValueOnChange(newValue)

    // If state value or city value is undefined, fetch the state_id and city_id corresponding to selected center
    if (!formData?.state_id) {
    
    const supabase = supabaseClient()

    // Fetch state_id and city_id corresponding to the selected center
    const {data:state_city_obj, error} = await supabase
    .from("center")
    .select("state_id,city_id")
    .eq("id", newValue)

    if(!error){
    // Set the state_id and city_id values in the form data
    setValue("state_id",state_city_obj?.[0]?.state_id)
    // setValue("city_id",state_city_obj?.[0]?.city_id)
    }
  }
  }

  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="flex flex-row gap-1 items-center">
        <Text className="text-xs font-normal text-[#333333]">
          {" "}
          {t("local_center")}
        </Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <Select value={centerValue} onValueChange={handleCenterValueChange}>
        <SelectTrigger
          className="w-full font-semibold text-sm"
          error={centerValueError ? true : false}
        >
          <SelectValue
            placeholder={t(
              "course.new_course:time_and_venue_tab.local_center_placeholder"
            )}
          />
        </SelectTrigger>
        <SelectContent>
          {formData?.state_id!=="" ? <div>
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
          </div>
          : <SelectItems>

          </SelectItems>
}
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
