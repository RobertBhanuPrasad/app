import { CrudFilter, useSelect } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import CustomSelect from "src/ui/custom-select";
import { Input } from "src/ui/input";
import { supabaseClient } from "src/utility";
import { fetchLongitudeLatitudeData } from "src/utility/GetOptionValuesByOptionLabel";
import MapPointer from "@components/MapComponent";
export const VenueNameComponent = () => {
  const {
    field: { value: venueName, onChange: venueOnchange },
    fieldState: { error: venueError },
  } = useController({
    name: "venueName",
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
    name: "postalCode",
  });
  const { setValue } = useFormContext();

  const fetchCityStateData = async () => {
    if (postalCodeValue?.length > 4) {
      const { data: prefillData } = await supabaseClient
        .from("city")
        .select("*")
        .eq("postal_code", postalCodeValue);

      const transformed = {
        label: prefillData?.[0]?.name,
        value: prefillData?.[0]?.id,
      };

      const transformedState = {
        label: prefillData?.[0]?.state_id?.name,
        value: prefillData?.[0]?.state_id?.id,
      };

      setValue("city_id", transformed);
      setValue("state_id", transformedState);
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
    name: "streetAddress",
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
    meta: { select: "*" },
    optionLabel: "name",
    optionValue: "id",
    filters: filter,
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

  const handleCityOnChange = (val: number) => {
    cityValueOnchange(val);
    const cityData: any = queryResult?.data?.data?.find(
      (city) => city.id == val
    );
    setValue("state_id", cityData?.state_id);
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
  const [currentPage, setCurrentPage] = useState(1);

  const [selectOptions, setSelectOptions] = useState<any>([]);

  const {
    options: stateOptions,
    onSearch: stateOnsearch,
    queryResult,
  } = useSelect({
    resource: "state",
    meta: { select: "*" },
    optionLabel: "name",
    optionValue: "id",
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

  const {
    field: { value: stateValue, onChange: stateValueOnchange },
  } = useController({
    name: "state_id",
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
        onChange={stateValueOnchange}
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
    name: "center",
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

  const handleCenterOnChange = (val: number) => {
    centerValueOnchange(val);
    const centerData: any = queryResult?.data?.data?.find(
      (center) => center.id == val
    );

    setValue("state_id", centerData?.state_id);
    setValue("city_id", centerData?.city_id);
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

export const MapComponent = () => {
    const {
      field: { value: stateValue },
    } = useController({
      name: "state_id",
    });
  
    const {
      field: { value: cityValue },
    } = useController({
      name: "city_id",
    });
  
    const {
      field: { value: coordinates, onChange: setCoordinates },
    }: { field: { value: { lat: number; lng: number }; onChange: Function } } =
      useController({
        name: "address_line_coordinates",
      });
  
    useEffect(() => {
      loadInitialCoordinates();
    }, [stateValue, cityValue]);
  
    const { watch } = useFormContext();
  
    const formData = watch();
  
    const loadInitialCoordinates = async () => {
      let LocationData: any;
      if (formData?.city_id && formData?.state_id) {
        LocationData = await fetchLongitudeLatitudeData(
          `${formData?.city_id?.label},${formData?.state_id?.label}`
        );
      }
  
      if (LocationData?.length > 0) {
        setCoordinates({ lat: LocationData?.[0]?.y, lng: LocationData?.[0]?.x });
      }
    };
  
    return (
      <div className=" flex w-[586px] h-[160px] rounded-[16px] border border-[#999999] my-5 text-center items-center justify-center">
        <MapPointer
          value={coordinates}
          onChange={setCoordinates}
          draggable={true}
          //If coordinates are [0,0] then display whole map
          zoom={_.isEqual(coordinates, { lat: 0, lng: 0 }) ? 1 : 15}
        />
      </div>
    );
  };