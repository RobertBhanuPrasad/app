import Form from "@components/Formfield";
import { useList, useSelect } from "@refinedev/core";
import { log } from "console";
import { LogIn } from "lucide-react";
import { useRouter } from "next/router";
import { FormEvent, use, useCallback, useEffect, useState } from "react";
import {
  useForm,
  useController,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { translatedText } from "src/common/translations";
import { USER_ROLE } from "src/constants/OptionLabels";
import { TEACHER } from "src/constants/OptionValueOrder";
import { MultiSelect } from "src/ui/multi-select";
import { supabaseClient } from "src/utility";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleValue, setRoleValue] = useState(42); // Teacher role id

  const router = useRouter();

  // const {getValues} = useFormContext()

  // const supabase = supabaseClient();

  // const {handleSubmit} = useForm()

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
  console.log(options, "options");

  // const handleSignup = async () => {
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //   });

  //   console.log("heyy register data", data, error);

  //   const { data: contactData } = await supabase
  //     .from("contact")
  //     .insert([{ first_name: firstName, last_name: lastName, email: email }])
  //     .select();

  //   const { data: userData } = await supabase
  //     .from("users")
  //     .insert([
  //       { user_identifier: data?.user?.id, contact_id: contactData?.[0]?.id },
  //     ])
  //     .select();

  //   const { data: roleData } = await supabase
  //     .from("user_roles")
  //     .insert([{ user_id: userData?.[0]?.id, role_id: roleValue }])
  //     .select();

  //   router.push("/login");
  // };

  console.log(roleValue, "teacher list");

  useEffect(() => {
    console.log(roleValue, "role data which is updating");
  }, [roleValue]);

  // form on-submit

  // console.log(getValues(), "form data ");

  const handleFormSubmit = (formData: any) => {
    console.log(formData, "formdata");
  };

  return (
    <div className="login flex min-h-screen bg-neutral justify-center items-center">
      <div className="card w-full flex flex-col gap-y-[5rem] max-w-4xl bg-base-100 px-4 py-8">
        <div className="px-4">
          <h1 className="text-[32px] font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
            SIGN UP
          </h1>
        </div>
        <Form onSubmit={handleFormSubmit} defaultValues={{}}>
          {error && (
            <div className="alert alert-error justify-start">
              <i className="i-feather-alert-triangle"></i>
              <span className="flex-grow">{error.message}</span>
            </div>
          )}
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
  const supabase = supabaseClient("ca");
  const { getValues } = useFormContext();

  const [selectCountries, setSelectedCountries] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);

  const { append, fields, remove } = useFieldArray({
    name: "program_types",
  });

  const {
    field: { value: roles, onChange: onSelectedRole },
  } = useController({
    name: "roles",
  });

  const {
    field: { value: userName, onChange: onUserName },
  } = useController({
    name: "username",
  });

  const {
    field: { value: firstName, onChange: onfirstname },
  } = useController({
    name: "firstName",
  });

  const {
    field: { value: lastName, onChange: onlastName },
  } = useController({
    name: "lastName",
  });

  const {
    field: { value: email, onChange: onEmail },
  } = useController({
    name: "email",
  });

  const {
    field: { value: countries, onChange: onCountries },
  } = useController({
    name: "countries",
  });

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

  const handleAddItem = () => {
    append({
      program_type_id: 13,
      certification_level_id: 38,
    });
  };

  const handleRemoveItem = (index: number) => {
    console.log(index, "index");

    remove(index);
  };

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

  const fetchCountryList = async () => {
    try {
      const { data, error } = await supabase
        .from("country")
        .select("*")

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
    fetchCountryList()
  }, [])

  const selectedRole = options.map((record: any) => {
    return {
      label: record?.label?.en,
      value: record?.value
    };
  });
  
  const selectedCountries = selectCountries.map((record: any) => {
    // console.log(record, "countries for multiselect");
    return {
      label: record?.name,
      value: record?.abbr ? record.abbr.toLowerCase() : ''
    
    };
  });
  console.log(selectedCountries, "countries for multiselect");

  const programOrganizationId = getOptionValueObjectByOptionOrder(
    USER_ROLE,
    TEACHER
  )?.id;

  console.log(programOrganizationId, "programOrganizationId");

  const modifyRoleFormData = (id: number[]) => {
    const result = id?.map((roleId) => {
      return options?.filter(role => role.value === roleId).map(role => ({
        id: role.value,
        name: role.label.en
      }))[0];
    }).filter((item) => item !== undefined); 
    
    setRoleList(result);
  };


  const onSubmitForm = async (data: any) => {
    data.program_types = data.program_types.map((type: any)=>({program_type_id : parseInt(type.program_type_id), certification_level_id : parseInt(type.certification_level_id)}))
    data.roles = roleList

    console.log(data, "form Data");
    const supabase = supabaseClient();
    const response  = await supabase.functions.invoke("create-user", {body : data})

    console.log(response.data, "response")
    console.log(response.error, "error");
    
  };
  console.log(roles, "roles");
  

  return (
    <main className="flex flex-col gap-y-[2rem]">
      {/* user name input column  */}
      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text">User Name</span>
        </label>
        <input
          type="text"
          onChange={onUserName}
          placeholder="Enter user name"
          className="border-[1px] border-black ml-[10px] p-1"
          value={userName}
        />
      </div>
      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text">First Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter first name"
          className="border-[1px] border-black ml-[10px] p-1"
          value={firstName}
          onChange={onfirstname}
        />
      </div>
      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text">Last Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter last name"
          className="border-[1px] border-black ml-[10px] p-1"
          value={lastName}
          onChange={onlastName}
        />
      </div>

      <div className="form-control flex items-center justify-between">
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          placeholder="Enter email"
          className="border-[1px] border-black ml-[10px] p-1"
          value={email}
          onChange={onEmail}
        />
      </div>

      <div className="form-control mt-0 flex items-center justify-between">
        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={onPassword}
          placeholder="Enter password"
          className="border-[1px] border-black ml-[10px] p-1"
        />
      </div>

      <div className=" form-control flex items-center justify-between">
        <label>Countries: </label>

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

      <div className=" form-control flex items-center justify-between">
        <label>Select Role:</label>

        <MultiSelect
          value={roles}
          placeholder={"Select Role"}
          data={selectedRole}
          onBottomReached={() => {}}
          onChange={(val :any)=>{
            modifyRoleFormData(val)
            onSelectedRole(val)
          }
          }
          onSearch={() => {}}
          searchBar={false}
          variant="basic"
        />
      </div>

      {/* program type  */}

      <>
        {roles?.includes(programOrganizationId) && (
          <div className="flex flex-row gap-x-[5rem] justify-between items-center">
            {fields?.map((value, index) => (
              <>
                <ProgramCertificationContainer
                  value={value}
                  index={index}
                />

                {index === fields.length - 1 && (
                  <div
                    onClick={handleAddItem}
                    className="text-[#7677F4] flex flex-row gap-1 justify-center items-center cursor-pointer"
                  >
                    add
                  </div>
                )}

                <div
                  onClick={(index: any) => {
                    console.log(index?.target, "inside rmove button index");

                    handleRemoveItem(index);
                  }}
                  className="text-[#7677F4] flex flex-row gap-1 justify-center items-center cursor-pointer"
                >
                  remove
                </div>
              </>
            ))}
          </div>
        )}
      </>

      <div className="form-control mt-6 flex justify-center ">
        <button
          className="font-semibold cursor-pointer"
          onClick={() => {
            onSubmitForm(getValues());
          }}
          type="button"
        >
          signup
        </button>
      </div>
    </main>
  );
};

const ProgramCertificationContainer = ({ value, index }: any) => {
  const supabase = supabaseClient("ca");

  const [programTypeList, setProgramTypeList] = useState<any[]>([]); // Program list
  const [certificationList, setCertificationList] = useState<any[]>([]); // Certification list
  // const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);

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

  console.log(programTypeList, "programTypeList");
  
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
    <div key={value?.id} className="flex flex-row items-center gap-x-[20px] justify-center">
      <div className=" form-control flex items-center justify-between">
        <label>Select Program:</label>
        <select
          value={program_id}
          className="w-[190px] border border-1 border-[black] p-1"
          onChange={
            onProgramType
          }
        >
          {programTypeList?.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option?.name?.en}
            </option>
          ))}
        </select>
      </div>

      <div className=" form-control flex items-center justify-between">
        <label>Select Certification:</label>

        <select
          onChange={onCertification}
          value={certification_level_id}
          className="w-[190px] border border-1 border-[black] p-1"
        >
          {certificationList?.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
