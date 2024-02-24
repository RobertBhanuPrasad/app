import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import Logo from "@public/assets/logo";
import Bell from "@public/assets/Bell";
import TableMenu from "@public/assets/TableMenu";
import { Avatar, AvatarFallback, AvatarImage } from "src/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "src/ui/navigation-menu";

function Navbar() {
  // Define navigation components and their respective routes
  const components = [
    {
      title: "New Course",
      href: "/Courses/NewCourse",
    },
    {
      title: "Find Course",
      href: "/Courses/FindCourse",
    },
    {
      title: "Discount Codes",
      href: "/Courses/DiscountCodes",
    },
  ];

  // Get the current pathname using the useRouter hook
  const { pathname } = useRouter();

  // Split the pathname into segments
  const pathSegments = pathname.split("/");

  // Extract the first segment of the pathname
  const firstRouteName = pathSegments.find((segment) => segment !== "");

  return (
    <div className="w-auto bg-[white] flex flex-row px-8 h-16">
      {/* Logo */}
      <div className="float-left items-center mt-2">
        <Logo />
      </div>
      {/* Navigation Menu */}
      <div className="flex items-center justify-center mx-auto ">
        <NavigationMenu className="text-[#999999]">
          <NavigationMenuList>
            {/* Home Navigation */}
            <NavigationMenuItem>
              <NavigationMenuTrigger >Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[160px] gap-3 py-4 px-2 ">
                  {components.map((component) => (
                    <li key={component.title}>
                      <MenuList Name={component.title} route={component.href} />
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Administer Navigation */}
            <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Administer
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* Contacts Navigation */}
            <NavigationMenuItem>
              <Link href="/Contacts" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contacts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* Courses Navigation */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={
                  firstRouteName === "Courses" ? "!text-[#7677F4] font-semibold" : ""
                }
              >
                Courses
              </NavigationMenuTrigger>
              <NavigationMenuContent className="NavigationMenuViewport">
                <ul className="grid w-[160px] gap-3 py-4 px-2 ">
                  {components.map((component) => (
                    <li key={component.title}>
                      <MenuList Name={component.title} route={component.href} />
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Events Navigation */}
            <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* Teachers Navigation */}
            <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Teachers
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* Mailings Navigation */}
            <NavigationMenuItem>
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Mailings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* Menu Navigation */}
            <NavigationMenuItem>
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
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Bell and Avatar */}
      <div className="flex justify-end">
        <div className="flex flex-row items-center gap-4 ">
          <Bell />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

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
