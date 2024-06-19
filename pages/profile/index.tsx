import { createClient } from '@refinedev/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '../../src/ui/avatar'
import React, { useEffect, useRef, useState } from 'react'

type Name = {
  first_name?:string;
  last_name? : string;
  full_name?: String;
}

const UserProfile = () => {
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log(SUPABASE_KEY);

  const supabase = createClient('http://192.168.1.170:54321/', SUPABASE_KEY!)
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [userData, setUserData]= useState<Name[]>([]);

  const fetchProfileName = async () => {
    console.log('Fetching profile name...');
    const { data: userData } = await supabase.auth.getUser();
    const uuid = userData.user?.id;
  
    if (!uuid) {
      console.error('User ID not found');
      return;
    }
  console.log('step 1');
  
  const { data, error }:any = await supabase
  .from('contact')
  .select(`
    id,
    first_name,
    last_name,
    full_name,
    users!inner(contact_id, user_identifier)
  `)
  .eq('users.user_identifier', uuid);
    console.log('step 2', data);
    
    if (error) {
      console.error('Error fetching profile name:', error);
      throw error;
    } else {
      console.log('step 3');
      
      console.log('Profile name fetched successfully:', data);
      // console.log(data.first_name,'FIRST NAME');
      
      console.log('step 4');
      return setUserData(data);
    }
    
    
  };
useEffect(()=>{
  fetchProfileName();
},[])

  // Upload file using standard upload
  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    let file;
    if (e.target.files) {
      file = e.target.files[0];
    }
    // console.log('Uploading file:', file);
    const { data: userData } = await supabase.auth.getUser();
    const uuid = userData.user?.id
    console.log(uuid,'hee hee');
    
    if ((await supabase.storage.from("Profiles").list(`${uuid}`)).data?.find(i => i.name === "dp.png")) {
      const { data, error } = await supabase.storage.from('Profiles').update(uuid + "/dp.png", file as File)
      console.log('Step : 2');
      if (error) {
        console.log(error, 'Image Uploading failed');
      } else {
        // Handle success
        console.log(data, 'Image');
        setShowTooltip(false);
        fetchUserData();
      }
    } else {
      const { data, error } = await supabase.storage.from('Profiles').upload(uuid + "/dp.png", file as File)
      console.log('Step : 2');
      if (error) {
        console.log(error, 'Image Uploading failed');
      }
      else {
        console.log(data, 'Image');
        setShowTooltip(false);
        fetchUserData();
      }
    }

  }
  const handleCameraClick = () => {
    setShowTooltip(!showTooltip);
  };

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
    console.log('Add Photo clicked');
    setShowTooltip(false);
  };

  const handleRemovePhoto = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uuid = userData.user?.id;

    const { error } = await supabase.storage.from('Profiles').remove([uuid + "/dp.png"]);

    if (error) {
      console.log('Error removing image: ', error);
    } else {
      console.log('Image removed successfully');
      setProfileImageUrl(''); // Update state to reflect the removed image
      setShowTooltip(false);
    }
  };

  const fetchUserData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uuid = userData.user?.id;
    console.log(uuid);
    

    if (!uuid) {
      console.log('User ID not found');
      return;
    }

    const { data, error } = await supabase
      .storage
      .from('Profiles')
      .download(uuid + "/dp.png");

    if (error) {
      console.log('Error: ', error);
    } else if (data) {
      const url = URL.createObjectURL(data);
      console.log(url)
      setProfileImageUrl(url);
    }
  };
  useEffect(() => {
    fetchUserData()
  }, []);

  const toPascalCase = (str: string | String | undefined)=> {
    if (!str) return '';
    return str.replace(/\w+/g, 
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  };
  return (
    <>

      <div className='w-full px-2 py-4 bg-blue-400 h-40 flex justify-center'>

        <div className='absolute inline-block left-6'>

          <Avatar className="border-4 border-white rounded-full w-32 h-32 object-cover" >
            <AvatarImage className='' src={profileImageUrl} alt="profile" />
            <AvatarFallback>{userData[0]?.first_name?.charAt(0).toUpperCase()}{userData[0]?.last_name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='absolute bottom-0 right-0'>
            <Avatar className="border-4 border-white hover:cursor-pointer rounded-full w-12 h-12 object-cover" onClick={handleCameraClick}>
              <AvatarImage src='' alt="camera" />
              <AvatarFallback>{userData[0]?.first_name?.charAt(0).toUpperCase()}{userData[0]?.last_name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          {showTooltip && (
            <div className="absolute bottom-0 left-36 mb-2 bg-white text-black rounded-lg shadow-lg p-2 w-40">
              <div
                className="hover:bg-gray-200 cursor-pointer p-2 rounded"
                onClick={handleAddPhoto}
              >
                {profileImageUrl ? 'Update Photo' : 'Add Photo'}
              </div>
              <div
                className="hover:bg-gray-200 cursor-pointer p-2 rounded mt-1"
                onClick={handleRemovePhoto}
              >
                Remove Photo
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-col justify-center'>
          <h1 className='text-slate-200 text-xl flex justify-center'>MY PROFILE</h1>
          <h1 className='text-white text-2xl py-1'>{toPascalCase(userData[0]?.full_name)}</h1>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={uploadFile}
      />
    </>
  )
}

export default UserProfile
