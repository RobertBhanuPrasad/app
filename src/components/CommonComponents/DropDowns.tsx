import { BaseOption, CrudFilter, useSelect } from "@refinedev/core";
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

export const VenueNameComponent = () => {
  const {
    field: { value: venueName, onChange: venueOnchange },
    fieldState: { error: venueError }
  } = useController({
    name: 'name'
  })
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333] flex flex-row gap-1">
        Venue Name
      </div>
      <div className="w-[278px] h-[40px] rounded-[1px]  font-semibold text-sm">
        <Input
          value={venueName}
          placeholder="Enter Venue Name"
          className="placeholder:text-[#333333] placeholder:font-semibold placeholder:text-sm"
          onChange={venueOnchange}
          error={venueError ? true : false}
        />
        {venueError && <span className="text-[#FF6D6D] text-[12px]">{venueError.message}</span>}
      </div>
    </div>
  )
}

export const PostalCodeComponent = () => {
  const supabase = supabaseClient()

  const {
    field: { value: postalCodeValue, onChange: postalCodeOnchange },
    fieldState: { error }
  } = useController({
    name: 'postal_code'
  })
  const { setValue } = useFormContext()

  const fetchCityStateData = async () => {
    if (postalCodeValue?.length > 4) {
      const { data: prefillData } = await supabase.from('city').select('*').eq('postal_code', postalCodeValue)
      if (prefillData && prefillData?.length > 0) {
        setValue('city_id', prefillData?.[0]?.id)
        setValue('state_id', prefillData?.[0]?.state_id)
      }
    }
  }
  useEffect(() => {
    fetchCityStateData()
  }, [postalCodeValue])
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Postal Code</div>
      <div className="w-[278px] h-[40px] rounded-[1px]  font-semibold text-sm">
        <Input
          value={postalCodeValue}
          placeholder="Enter Postal Code"
          className="placeholder:text-[#333333] placeholder:font-semibold placeholder:text-sm"
          onChange={postalCodeOnchange}
          error={error ? true : false}
        />
        {error && <span className="text-[#FF6D6D] text-[12px]">{error.message}</span>}
      </div>
    </div>
  )
}

export const StreetAddressComponent = () => {
  const {
    field: { value: streetAddressValue, onChange: streetAddressOnchange },
    fieldState: { error }
  } = useController({
    name: 'address'
  })
  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="text-xs font-normal text-[#333333]">Street Address</div>
      <div className="w-[278px] h-[40px] rounded-[1px]  font-semibold text-sm">
        <Input
          value={streetAddressValue}
          placeholder="Enter Street Address"
          className="placeholder:text-[#333333] placeholder:font-semibold placeholder:text-sm"
          onChange={streetAddressOnchange}
          error={error ? true : false}
        />
        {error && <span className="text-[#FF6D6D] text-[12px]">{error.message}</span>}
      </div>
    </div>
  )
}

export const CityDropDown = ({ name }: { name: string }) => {
  const [pageSize, setPageSize] = useState(10)

  const {
    field: { value: cityValue, onChange: cityValueOnChange },
    fieldState: { error: cityValueError }
  } = useController({ name })

  const { watch, setValue } = useFormContext()
  const formData = watch()

  let filter: Array<CrudFilter> = []
  if (formData?.state_id) {
    filter.push({
      field: 'state_id',
      operator: 'eq',
      value: formData?.state_id
    })
  }

  const { options, onSearch } = useSelect({
    resource: 'city',
    optionLabel: 'name',
    optionValue: 'id',
    filters: filter,
    defaultValue: cityValue,
    onSearch: value => [
      {
        field: 'name',
        operator: 'contains',
        value
      }
    ],
    pagination: {
      mode: 'server',
      pageSize: pageSize
    }
  })

  const handleOnBottomReached = () => {
    setPageSize((previousLimit: number) => previousLimit + 10)
  }

  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">City</Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>

      <Select value={cityValue} onValueChange={cityValueOnChange}>
        <SelectTrigger error={cityValueError ? true : false} className="font-semibold text-sm ">
          <SelectValue placeholder="Select City"/>
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value
              onSearch(value)
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options.map((option: BaseOption) => (
              <SelectItem key={option.value} value={option.value} className="h-[44px]">
                {option.label}
              </SelectItem>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      {cityValueError && <span className="text-[#FF6D6D] text-[12px]">{cityValueError.message}</span>}
    </div>
  )
}

export const StateDropDown = ({ name }: { name: string }) => {
  const [pageSize, setPageSize] = useState(10)

  const [selectOptions, setSelectOptions] = useState<any>([])

  const {
    field: { value: stateValue, onChange: stateValueOnchange },
    fieldState: { error: stateValueError }
  } = useController({
    name
  })

  const { options, onSearch: stateOnsearch } = useSelect({
    resource: 'state',
    meta: { select: '*' },
    optionLabel: 'name',
    optionValue: 'id',
    defaultValue: stateValue,
    onSearch: value => [
      {
        field: 'name',
        operator: 'contains',
        value
      }
    ],
    pagination: {
      mode: 'server',
      pageSize: pageSize
    }
  })

  const handleOnBottomReached = () => {
    setPageSize(pageSize => pageSize + 10)
  }

  return (
    <div className="flex gap-1 flex-col h-[60px] w-full">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">Province</Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>

      <Select value={stateValue} onValueChange={stateValueOnchange}>
        <SelectTrigger className="w-full font-semibold text-sm" error={stateValueError ? true : false}>
          <SelectValue placeholder="Select Province" />
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value
              stateOnsearch(value)
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options?.map((option: BaseOption, index: number) => (
              <>
                <SelectItem key={option.value} value={option.value} className="h-[44px]">
                  {option.label}
                </SelectItem>
                {index < selectOptions.length - 1 && <hr className="border-[#D6D7D8]" />}
              </>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      {stateValueError && <span className="text-[#FF6D6D] text-[12px]">{stateValueError.message}</span>}
    </div>
  )
}

export const CenterDropDown = ({ name }: { name: string }) => {
  const [pageSize, setPageSize] = useState(10)

  const {
    field: { value: centerValue, onChange: centerValueOnChange },
    fieldState: { error: centerValueError }
  } = useController({ name })

  const { watch, setValue } = useFormContext()
  const formData = watch()

  let filter: Array<CrudFilter> = []

  if (formData?.city_id) {
    filter.push({
      field: 'city_id',
      operator: 'eq',
      value: formData.city_id
    })
  }

  if (formData?.state_id) {
    filter.push({
      field: 'state_id',
      operator: 'eq',
      value: formData.state_id
    })
  }

  const { options, onSearch: centerOnSearch } = useSelect({
    resource: 'center',
    optionLabel: 'name',
    optionValue: 'id',
    filters: filter,
    defaultValue: centerValue,
    onSearch: value => [
      {
        field: 'name',
        operator: 'contains',
        value
      }
    ],
    pagination: {
      mode: 'server',
      pageSize: pageSize
    }
  })

  const handleOnBottomReached = () => {
    setPageSize(prevPageSize => prevPageSize + 10)
  }

  return (
    <div className="flex gap-1 flex-col h-[60px]">
      <div className="flex flex-row gap-1 items-center">
        <Text className="text-xs font-normal text-[#333333]">
          {" "}
          Local Center
        </Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <Select value={centerValue} onValueChange={centerValueOnChange}>
        <SelectTrigger className="w-full font-semibold text-sm" error={centerValueError ? true : false}>
          <SelectValue placeholder="Select Local center" />
        </SelectTrigger>
        <SelectContent>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value
              centerOnSearch(value)
            }}
          />
          <SelectItems onBottomReached={handleOnBottomReached}>
            {options.map((option: BaseOption) => (
              <SelectItem key={option.value} value={option.value} className="h-[44px]">
                {option.label}
              </SelectItem>
            ))}
          </SelectItems>
        </SelectContent>
      </Select>
      {centerValueError && <span className="text-[#FF6D6D] text-[12px]">{centerValueError.message}</span>}
    </div>
  )
}

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
