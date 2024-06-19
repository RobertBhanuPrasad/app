import Form from "@components/Formfield";
import { useList, useSelect } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useForm,
  useController,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { USER_ROLE } from "src/constants/OptionLabels";
import { TEACHER } from "src/constants/OptionValueOrder";
import { MultiSelect } from "src/ui/multi-select";
import { supabaseClient } from "src/utility";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

const Signup = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [error, setError] = useState<Error | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [roleValue, setRoleValue] = useState(42); // Teacher role id

  // const { data } = useList<any>({
  //   resource: "option_labels",
  //   filters: [
  //     {
  //       field: "name",
  //       operator: "eq",
  //       value: "User Role",
  //     },
  //   ],
  // });
  // const { options } = useSelect({
  //   resource: "option_values",
  //   optionLabel: "name",
  //   optionValue: "id",
  //   filters: [
  //     {
  //       field: "option_label_id",
  //       operator: "eq",
  //       value: data?.data[0]?.id,
  //     },
  //   ],
  // });

  // useEffect(() => {
  //   console.log(roleValue, "role data which is updating");
  // }, [roleValue]);

  return (
    <div className="login flex min-h-screen bg-neutral justify-center items-center">
      <div className="card w-full flex flex-col gap-y-[5rem] max-w-4xl bg-base-100 px-4 py-8">
        <div className="px-4">
          <h1 className="text-[32px] font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
            SIGN UP
          </h1>
        </div>
        <Form onSubmit={()=> {}} defaultValues={{}}>
          {/* {error && (
            <div className="alert alert-error justify-start">
              <i className="i-feather-alert-triangle"></i>
              <span className="flex-grow">{error.message}</span>
            </div>
          )} */}
          <RegisterComponent />
        </Form>
      </div>
    </div>
  );
};
export default Signup;

Signup.requireAuth = false;
Signup.noLayout = false;

const RegisterComponent = () => {

  const router = useRouter()

  const supabase = supabaseClient("ca");
  const { getValues } = useFormContext();

  const [selectCountries, setSelectedCountries] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);

  const { append, fields, remove } = useFieldArray({
    name: "program_types",
  });

  // use controller for roles 
  const {
    field: { value: roles, onChange: onSelectedRole },
  } = useController({
    name: "roles",
  });

   // use controller for user name
  const {
    field: { value: userName, onChange: onUserName },
  } = useController({
    name: "username",
  });

   // use controller for first name
  const {
    field: { value: firstName, onChange: onfirstname },
  } = useController({
    name: "firstName",
  });

   // use controller for last name
  const {
    field: { value: lastName, onChange: onlastName },
  } = useController({
    name: "lastName",
  });

   // use controller for email
  const {
    field: { value: email, onChange: onEmail },
  } = useController({
    name: "email",
  });

 // use controller for countries 
  const {
    field: { value: countries, onChange: onCountries },
  } = useController({
    name: "countries",
  });

   // use controller for password 
  const {
    field: { value: password, onChange: onPassword },
  } = useController({
    name: "password",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({}); // Changed to setFields to update the state
    }
  }, []);

  const { data } = useList<any>({
    resource: "option_labels",
    filters: [
      {
        field: "name",
        operator: "eq",
        value: "User Role",
      },
    ],
  });
  const { options } = useSelect({
    resource: "option_values",
    optionLabel: "name",
    optionValue: "id",
    filters: [
      {
        field: "option_label_id",
        operator: "eq",
        value: data?.data[0]?.id,
      },
    ],
  });

  // fetching the country data from country table 
  const fetchCountryList = async () => {
    try {
      const { data, error } = await supabase.from("country").select("*");

      if (error) {
        throw error;
      }

      if (data !== null) {
        console.log(data, "data of the countries");

        setSelectedCountries(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCountryList();
  }, []);

  // preparaing data for roles multiselect 
  const selectedRole = options.map((record: any) => {
    return {
      label: record?.label?.en,
      value: record?.value,
    };
  });

  // preparaing data for roles countries 
  const selectedCountries = selectCountries.map((record: any) => {
    return {
      label: record?.name,
      value: record?.abbr ? record.abbr.toLowerCase() : "",
    };
  });

  const programOrganizationId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    TEACHER
  )?.id;

  // function for modify the role form data
  const modifyRoleFormData = (id: number[]) => {
    const result = id
      ?.map((roleId) => {
        return options
          ?.filter((role) => role.value === roleId)
          .map((role) => ({
            id: role.value,
            name: role.label.en,
          }))[0];
      })
      .filter((item) => item !== undefined);

    setRoleList(result);
  };

  const onSubmitForm = async (formData: any) => {

    console.log(formData, "data");
    
    // changing the string to int as they are id's 
    formData.program_types = formData.program_types.map((type: any) => ({
      program_type_id: parseInt(type.program_type_id),
      certification_level_id: parseInt(type.certification_level_id),
    }));
    formData.roles = roleList;

    const supabase = supabaseClient();

    const {data, error} = await supabase.functions.invoke("create-user", {
      body: formData,
    });

    if(error) {
      console.log(error, "error message");
    } else {
      console.log(data, "user-create response")
      router.push("/login")
    }
  };

  return (
    <main className="flex flex-col gap-y-[2rem]">
      {/* user name input column  */}
      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text font-semibold text-[20px]">User Name</span>
        </label>
        <input
          type="text"
          onChange={onUserName}
          placeholder="Enter user name"
          className="w-[300px] pl-[15px] border-[1px] rounded-[12px] border-inherit h-[40px] border-black ml-[10px] p-1"
          value={userName}
        />
      </div>
      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text font-semibold text-[20px]">First Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter first name"
          className="w-[300px] pl-[15px] border-[1px] rounded-[12px] border-inherit h-[40px] border-black ml-[10px] p-1"
          value={firstName}
          onChange={onfirstname}
        />
      </div>
      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text font-semibold text-[20px]">Last Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter last name"
          className="w-[300px] pl-[15px] border-[1px] rounded-[12px] border-inherit h-[40px] border-black ml-[10px] p-1"
          value={lastName}
          onChange={onlastName}
        />
      </div>

      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text font-semibold text-[20px]">Email</span>
        </label>
        <input
          type="text"
          placeholder="Enter email"
          className="w-[300px] pl-[15px] border-[1px] rounded-[12px] border-inherit h-[40px] border-black ml-[10px] p-1"
          value={email}
          onChange={onEmail}
        />
      </div>

      <div className="form-control mt-0 flex items-center justify-between">
        <label htmlFor="password" className="label">
          <span className="label-text font-semibold text-[20px]">Password</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={onPassword}
          placeholder="Enter password"
          className="w-[300px] pl-[15px] border-[1px] rounded-[12px] border-inherit h-[40px] border-black ml-[10px] p-1"
        />
      </div>

      <div className=" form-control flex items-center justify-between">
        <label className="font-semibold text-[20px]">Countries </label>
        <div className="w-[300px]">
          <MultiSelect
            value={countries}
            placeholder={"Select Countries"}
            data={selectedCountries}
            onBottomReached={() => {}}
            onChange={onCountries}
            onSearch={() => {}}
            searchBar={false}
            variant="basic"
          />
        </div>
      </div>

      <div className=" form-control flex items-center justify-between">
        <label className="font-semibold text-[20px]">Role:</label>

        <div className="w-[300px]">
          <MultiSelect
            value={roles}
            placeholder={"Select Role"}
            data={selectedRole}
            onBottomReached={() => {}}
            onChange={(val: any) => {
              modifyRoleFormData(val);
              onSelectedRole(val);
            }}
            onSearch={() => {}}
            searchBar={false}
            variant="basic"
          />
        </div>
      </div>

      {/* program type  */}

      <>
        {roles?.includes(programOrganizationId) && (
          <div className="flex flex-col gap-y-[21px] gap-x-[5rem] justify-between items-center">
            {fields?.map((value, index) => (
              <>
                <ProgramCertificationContainer
                  value={value}
                  index={index}
                  fields={fields}
                  append={append}
                  remove={remove}
                />
              </>
            ))}
          </div>
        )}
      </>

      <div className="form-control mt-6 flex justify-center ">
        <button
          className="w-[200px] h-[40px] rounded-[12px] bg-[#7677F4] text-[#fff] font-semibold cursor-pointer"
          onClick={() => {
            onSubmitForm(getValues());
          }}
          type="button"
        >
          Sign-Up
        </button>
      </div>
    </main>
  );
};

const ProgramCertificationContainer = ({
  value,
  index,
  fields,
  append,
  remove,
}: any) => {
  const supabase = supabaseClient("ca");

  const [programTypeList, setProgramTypeList] = useState<any[]>([]); // Program list
  const [certificationList, setCertificationList] = useState<any[]>([]); // Certification list

  const fetchListCertification = async () => {
    try {
      const { data, error } = await supabase
        .from("option_values")
        .select("*, option_label_id!inner(*)")
        .eq("option_label_id.key", "CERTIFICATION_TYPE");

      if (error) {
        throw error;
      }

      if (data !== null) {
        setCertificationList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProgramTypeList = async () => {
    try {
      const { data, error } = await supabase
        .from("program_types")
        .select("id, name");

      if (error) {
        throw error;
      }

      console.log(data, "program-List");

      if (data !== null) {
        setProgramTypeList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProgramTypeList();
    fetchListCertification();
  }, []);

  const handleAddItem = () => {
    append({});
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const {
    field: { value: program_id, onChange: onProgramType },
  } = useController({
    name: `program_types.[${index}].program_type_id`,
  });

  const {
    field: { value: certification_level_id, onChange: onCertification },
  } = useController({
    name: `program_types.[${index}].certification_level_id`,
  });

  return (
    <div
      key={value?.id}
      className="flex flex-row items-center gap-x-[20px] justify-center"
    >
      <div className=" form-control flex items-center justify-between">
        <label className="font-semibold text-[20px] mr-[10px]">Program:</label>
        <select
          value={program_id}
          className="w-[200px] h-[40px] border border-inherit rounded-[12px] border-1 border-[black] p-1"
          onChange={onProgramType}
        >
          {programTypeList?.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option?.name?.en}
            </option>
          ))}
        </select>
      </div>

      <div className=" form-control flex items-center justify-between">
        <label className="font-semibold text-[20px] mr-[10px]">Certification:</label>

        <select
          onChange={onCertification}
          value={certification_level_id}
          className="w-[200px] h-[40px] border-inherit rounded-[12px] border border-1 border-[black] p-1"
        >
          {certificationList?.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row w-[200px] gap-x-[20px]">
        {index === fields.length - 1 && (
          <div
            onClick={handleAddItem}
            className="text-[#7677F4] flex flex-row gap-1 justify-center items-center cursor-pointer"
          >
            add
          </div>
        )}
      {index > 0 && ( 
        <div
          onClick={(index: any) => {
            handleRemoveItem(index);
          }}
          className="text-[#7677F4] flex flex-row gap-1 justify-center items-center cursor-pointer"
        >
          remove
        </div>
      )}
      </div>
    </div>
  );
};
