import { useEffect, useState } from 'react'; // Import useEffect and useState
import LoadingIcon from '@public/assets/LoadingIcon';
import Logo from '@public/assets/Logo';
import LogoutIcon from '@public/assets/LogoutIcon';
import { useGetIdentity } from '@refinedev/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { Avatar, AvatarFallback, AvatarImage } from 'src/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'src/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from 'src/ui/navigation-menu';
import { supabaseClient } from 'src/utility';
import { newCourseStore } from 'src/zustandStore/NewCourseStore';
import { AlertDialog, AlertDialogContent } from 'src/ui/alert-dialog';
import { Button } from 'src/ui/button';

function Navbar() {
  const { data: loginUserData }: any = useGetIdentity();
  const router = useRouter();
  const { currentStep, setNewCourseAlertMessageModal, newCourseAlertMessageModal } = newCourseStore();

  const [pendingUrl, setPendingUrl] = useState<string | null>(null); // State to keep track of the URL the user intends to navigate to
  const [navigationConfirmed, setNavigationConfirmed] = useState<boolean>(false); // State to track if navigation is confirmed

  // Define navigation components and their respective routes
  const components = [
    {
      title: 'New Course',
      href: '/courses/add'
    },
    {
      title: 'Find Course',
      href: '/courses/list'
    },
    // {
    //   title: 'Discount Codes',
    //   href: '/Courses/DiscountCodes'
    // }
  ]

  const supabase = supabaseClient()

  // Get the current pathname using the useRouter hook
  const { pathname } = router

  // Split the pathname into segments
  const pathSegments = pathname.split('/')

  // Extract the first segment of the pathname
  const firstRouteName = pathSegments.find(segment => segment !== '')

  // to logged out the current user
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      destroyCookie(null, 'token') // Remove the token cookie
      router.replace('/login') // Redirect to the login page
    }
    console.log('error is', error)
  }

  // Alert user when navigating away from /courses/add 
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const basePath = url.split('?')[0];
      if (!navigationConfirmed && pathname === '/courses/add' && basePath !== '/courses/add') {
        setNewCourseAlertMessageModal(true);
        setPendingUrl(url); // Store the URL the user intends to navigate to
        router.events.emit('routeChangeError'); // Emit route change error to stop the navigation
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const handleRouteChangeComplete = () => {
      setNavigationConfirmed(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [pathname, navigationConfirmed, router.events]);


  const handleAlertClose = (proceed: boolean) => {
    setNewCourseAlertMessageModal(false);
    if (proceed && pendingUrl) {
      setNavigationConfirmed(true);
      router.push(pendingUrl); // Navigate to the stored URL
    }
    setPendingUrl(null); // Clear the pending URL
  };


  return (
    <div className="w-full flex flex-row px-4 h-16 justify-between items-center  ">
      {/* Logo */}
      <Logo />
      {/* Navigation Menu */}
      <div className="flex items-center justify-center mr-auto ml-[10%]" >
        <NavigationMenu className="text-[#999999]">
          <NavigationMenuList>
            {/* TODO  : for now may-13 release it has to be hidden */}
            {/* Home Navigation */}
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[160px] gap-3 py-4 px-2 ">
                  {components.map(component => (
                    <li key={component.title}>
                      <MenuList Name={component.title} route={component.href} />
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
            {/* Administer Navigation */}
            {/* <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Administer</NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            {/* Contacts Navigation */}
            {/* <NavigationMenuItem>
              <Link href="/Contacts" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contacts</NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            {/* Courses Navigation */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={firstRouteName === 'Courses' ? '!text-[#7677F4] font-semibold' : ''}>
                Courses
              </NavigationMenuTrigger>
              <NavigationMenuContent className="NavigationMenuViewport">
                <ul className="grid w-[160px] gap-3 py-4 px-2 ">
                  {components.map(component => (
                    <li key={component.title}>
                      <MenuList Name={component.title} route={component.href} />
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Events Navigation */}
            {/* <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Events</NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            {/* Teachers Navigation */}
            {/* <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Teachers</NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            {/* Mailings Navigation */}
            {/* <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Mailings</NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            {/* Menu Navigation */}
            {/* <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <div className=" flex flex-row items-center gap-2">
                    Menu
                    <div className="mt-[2px]">
                      <TableMenu />
                    </div>
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Bell and Avatar */}
      <div className="flex flex-row items-center gap-4 ">
        {/* <Bell /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.png" />
              <AvatarFallback>{loginUserData?.userData?.contact_id?.first_name[0].concat(loginUserData?.userData?.contact_id?.last_name[0]).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[312px]">
            {loginUserData?.userData ? (
              <p className="text-primary text-base font-semibold pl-3 py-5">{loginUserData?.userData?.contact_id?.full_name}</p>
            ) : (
              <LoadingIcon></LoadingIcon>
            )}
            <DropdownMenuSeparator className="bg-primary mx-[12px]" />
            <DropdownMenuItem onClick={handleLogOut} className="flex gap-3 pl-3 py-5">
              <LogoutIcon />
              <p className="text-[#FF0000] font-semibold text-sm cursor-pointer">Log Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* New Course Alert Message */}
      <ViewNewCourseAlertMessage onClose={handleAlertClose} />
    </div>
  );
}

export default Navbar

// Component to render each menu item
const MenuList = ({ Name, route }: any) => {
  return (
    <div>
      <Link href={route} legacyBehavior passHref>
        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          {Name}
        </NavigationMenuLink>
      </Link>
    </div>
  );
};

// ViewNewCourseAlertMessage Component
export const ViewNewCourseAlertMessage = ({ onClose }: { onClose: (proceed: boolean) => void }) => {
  const {
    newCourseAlertMessageModal,
    setNewCourseAlertMessageModal,
  } = newCourseStore();

  return (
    <AlertDialog open={newCourseAlertMessageModal}>
      <AlertDialogContent className="w-[414px] h-[301px]">
        <div className="flex flex-col items-center">
          <div className="font-semibold text-center mt-2">
            Error Message
          </div>
          <div className="text-center my-4">
            Are you sure you want to leave this page?
          </div>
          <div className="w-full flex justify-center items-center gap-5">
            <div>
              <Button
                type="button"
                variant="outline"
                className="text-[#7677F4] border border-[#7677F4] w-[71px] h-[46px]"
                onClick={() => onClose(false)} // User stays on the same page
              >
                No
              </Button>
            </div>
            <div>
              <Button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 w-[71px] h-[46px]"
                onClick={() => onClose(true)} // User navigates to the new page
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
