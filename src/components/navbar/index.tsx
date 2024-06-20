// import Bell from '@public/assets/Bell'
import LoadingIcon from '@public/assets/LoadingIcon'
import Logo from '@public/assets/Logo'
import LogoutIcon from '@public/assets/LogoutIcon'
import { useGetIdentity } from '@refinedev/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Avatar, AvatarFallback, AvatarImage } from 'src/ui/avatar'
import { Button } from 'src/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'src/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'src/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from 'src/ui/navigation-menu'
import { supabaseClient } from 'src/utility'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'


function Navbar() {

  const { data: loginUserData }: any = useGetIdentity()

  const { setViewLogoutModal } = newCourseStore()

  const router = useRouter()

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



  // Get the current pathname using the useRouter hook
  const { pathname } = router

  // Split the pathname into segments
  const pathSegments = pathname.split('/')

  // Extract the first segment of the pathname
  const firstRouteName = pathSegments.find(segment => segment !== '')

  // to logged out the current user
  const handleLogOut = () => {
    setViewLogoutModal(true)
  }

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
              <AvatarFallback>{loginUserData?.userData?.first_name[0].concat(loginUserData?.userData?.last_name[0]).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[312px]">
            {loginUserData?.userData ? (
              <p className="text-primary text-base font-semibold pl-3 py-5">{loginUserData?.userData?.full_name}</p>
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
        <LogoutAlterModal />
      </div>
    </div>
  )
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
  )
}


const LogoutAlterModal = () => {
  const { viewLogoutModal, setViewLogoutModal } = newCourseStore()

  const supabase = supabaseClient()

  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log('error is', error)
    }
    setViewLogoutModal(false)
  }
  return (
    <Dialog open={viewLogoutModal}>
      <DialogContent className="w-[414px] h-[279px]" handleClickCloseButton={() => { setViewLogoutModal(false) }}>
        <DialogHeader className="text-center">
          <div className="flex items-center w-full justify-center">
            <Logo />
          </div>
          <DialogTitle className="font-semibold text-[20px] text-center">
            Logging out
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex flex-row gap-5 justify-center  w-full'>
            <div>
              <Button type='button' variant="outline"
                className="text-[#7677F4] w-[100px] h-[45px] border border-[#7677F4] rounded-[12px] hover:bg-blue-500 hover:text-white "
                onClick={() => setViewLogoutModal(false)}
              >
                No
              </Button>
            </div>
            <div>
              <Button type='button' variant="outline"
                className="text-[#7677F4] w-[100px] h-[45px] border border-[#7677F4] rounded-[12px] hover:bg-blue-500 hover:text-white "
                onClick={handleLogout}

              >
                Yes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
