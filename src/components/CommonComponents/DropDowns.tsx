import { MapPointer } from "@components/MapComponent";
import { CrudFilter, useSelect } from "@refinedev/core";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { supabaseClient } from "src/utility";
import { fetchLongitudeLatitudeData } from "src/utility/GetOptionValuesByOptionLabel";
export const VenueNameComponent = () => {
  const {
    field: { value: venueName, onChange: venueOnchange },
    fieldState: { error: venueError },
  } = useController({
    name: "name",
  });
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Venue <div className="text-[#7677F4]"> *</div>
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={venueName}
          placeholder="Enter Venue Name"
          className="placeholder:text-[#999999]"
          onChange={venueOnchange}
        />
      </div>
    </div>
  );
};

export const PostalCodeComponent = () => {
  const {
    field: { value: postalCodeValue, onChange: postalCodeOnchange },
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
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Postal Code</div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={postalCodeValue}
          placeholder="Enter Postal Code"
          className="placeholder:text-[#999999]"
          onChange={postalCodeOnchange}
          required
        />
      </div>
    </div>
  );
};

export const StreetAddressComponent = () => {
  const {
    field: { value: streetAddressValue, onChange: streetAddressOnchange },
  } = useController({
    name: "address",
  });
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Street Address</div>
      <div className="w-[278px] h-[40px] rounded-[1px] text-[#999999] font-normal">
        <Input
          value={streetAddressValue}
          placeholder="Enter Street Address"
          className="placeholder:text-[#999999]"
          onChange={streetAddressOnchange}
        />
      </div>
    </div>
  );
};

export const CityDropDown = () => {
  const { watch, setValue } = useFormContext();

  const formData = watch();

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const {
    field: { value: cityValue, onChange: cityValueOnchange },
    fieldState: { error: cityValueError },
  } = useController({
    name: "city_id",
  });

  let filter: Array<CrudFilter> = [];

  if (formData?.state_id) {
    filter.push({
      field: "state_id",
      operator: "eq",
      value: formData?.state_id,
    });
  }

  const { options, onSearch, queryResult } = useSelect({
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
      current: currentPage,
      mode: "server",
    },
  });

  useEffect(() => {
    if (options) {
      if (currentPage > 1) setSelectOptions([...selectOptions, ...options]);
      else setSelectOptions(options);
    }
  }, [options, currentPage]);

  const handleOnBottomReached = () => {
    if (options && (queryResult?.data?.total as number) >= currentPage * 10)
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const handleCityOnChange = async (val: number) => {
    cityValueOnchange(val);
    const { data: cityData }: any = await supabaseClient
      .from("city")
      .select("*,state_id(*)")
      .eq("id", val);
    setValue("city", cityData?.[0]);
    setValue("state_id", cityData?.[0]?.state_id?.id);
    setValue("state", cityData?.[0]?.state_id);
    setValue("postal_code", cityData?.[0]?.postal_code);
  };
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">City</div>

      <CustomSelect
        value={cityValue}
        placeholder="Select City"
        data={selectOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={handleCityOnChange}
        error={cityValueError}
      />
    </div>
  );
};

export const StateDropDown = () => {
  const { setValue } = useFormContext();

  const [currentPage, setCurrentPage] = useState(1);

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const {
    field: { value: stateValue, onChange: stateValueOnchange },
  } = useController({
    name: "state_id",
  });

  const {
    options: stateOptions,
    onSearch: stateOnsearch,
    queryResult,
  } = useSelect({
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
      current: currentPage,
      mode: "server",
    },
  });

  useEffect(() => {
    if (stateOptions) {
      if (currentPage > 1)
        setSelectOptions([...selectOptions, ...stateOptions]);
      else setSelectOptions(stateOptions);
    }
  }, [stateOptions, currentPage]);

  const handleOnBottomReached = () => {
    if (
      stateOptions &&
      (queryResult?.data?.total as number) >= currentPage * 10
    )
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const handleStateOnChange = (val: number) => {
    stateValueOnchange(val);
    const stateObject = queryResult?.data?.data?.find(
      (state) => state.id == val
    );
    setValue("state", stateObject);
  };
  return (
    <div className="flex gap-1 flex-col h-[60px] w-full">
      <div className="text-xs font-normal text-[#333333]">Province</div>

      <CustomSelect
        value={stateValue}
        placeholder="Select Province"
        data={selectOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          stateOnsearch(val);
        }}
        onChange={handleStateOnChange}
      />
    </div>
  );
};

export const CenterDropDown = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const {
    field: { value: centerValue, onChange: centerValueOnchange },
  } = useController({
    name: "center_id",
  });
  const { watch, setValue } = useFormContext();

  const formData = watch();
  let filter: Array<CrudFilter> = [];

  if (formData?.city_id) {
    filter.push({
      field: "city_id",
      operator: "eq",
      value: formData?.city_id,
    });
  }

  if (formData?.state_id) {
    filter.push({
      field: "state_id",
      operator: "eq",
      value: formData?.state_id,
    });
  }

  const {
    options: centerOptions,
    onSearch: centerOnsearch,
    queryResult,
  } = useSelect({
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
      current: currentPage,
      mode: "server",
    },
  });

  useEffect(() => {
    if (centerOptions) {
      if (currentPage > 1)
        setSelectOptions([...selectOptions, ...centerOptions]);
      else setSelectOptions(centerOptions);
    }
  }, [centerOptions, currentPage]);

  const handleOnBottomReached = () => {
    if (
      centerOptions &&
      (queryResult?.data?.total as number) >= currentPage * 10
    )
      setCurrentPage((previousLimit: number) => previousLimit + 1);
  };

  const handleCenterOnChange = async (val: number) => {
    centerValueOnchange(val);
    const { data: centerData } = await supabaseClient
      .from("center")
      .select("*,city_id(*),state_id(*)")
      .eq("id", val);
    setValue("center", centerData?.[0]);
    setValue("state_id", centerData?.[0]?.state_id?.id);
    setValue("state", centerData?.[0]?.state_id);
    setValue("city_id", centerData?.[0]?.city_id?.id);
    setValue("city", centerData?.[0]?.city_id);
    setValue("postal_code", centerData?.[0]?.city_id?.postal_code);
  };
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Local Center</div>

      <CustomSelect
        value={centerValue}
        placeholder="Select Local center"
        data={selectOptions}
        onBottomReached={handleOnBottomReached}
        onSearch={(val: string) => {
          centerOnsearch(val);
        }}
        onChange={handleCenterOnChange}
      />
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
