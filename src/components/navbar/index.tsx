import Bell from '@public/assets/Bell'
import LoadingIcon from '@public/assets/LoadingIcon'
import Logo from '@public/assets/Logo'
import LogoutIcon from '@public/assets/LogoutIcon'
import TableMenu from '@public/assets/TableMenu'
import { useGetIdentity, useOne } from '@refinedev/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from 'src/ui/avatar'
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
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from 'src/ui/navigation-menu'
import { supabaseClient } from 'src/utility'


function Navbar() {

  const { data: loginUserData }: any = useGetIdentity()

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
    {
      title: 'Discount Codes',
      href: '/Courses/DiscountCodes'
    }
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
        <Bell />
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
