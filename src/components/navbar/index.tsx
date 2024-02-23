import Bell from "@public/assets/Bell";
import Logo from "@public/assets/logo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { cn } from "src/lib/utils";
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
  const components: { title: string; href: string }[] = [
    {
      title: "New course",
      href: "/course/newcourse",
    },
    {
      title: "Find course",
      href: "/course",
    },
    {
      title: "Progress",
      href: "/docs/primitives/progress",
    },
  ];
  const { pathname } = useRouter();
  console.log(pathname, "pathname");
  const [tabValue, setTabValue] = useState();
  return (
    <div className="w-auto bg-[white] flex flex-row px-8 h-16">
      <div className="float-left items-center">
        <Logo />
      </div>
      <div className="flex items-center justify-center mx-auto gap-4">
        <NavigationMenu
          className="text-[#999999]"
          onValueChange={(value: any) => {
            console.log(value, "value");
            setTabValue(value)
          }}
        >
          <NavigationMenuList>
            <NavigationMenuItem value="Home">
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[160px] gap-3 py-4 px-2 ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {" "}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="Administer">
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Administer
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem value="Contacts">
              <Link href="/Contacts" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contacts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem value="Courses">
              <NavigationMenuTrigger >Courses</NavigationMenuTrigger>
              <NavigationMenuContent className="NavigationMenuViewport">
                <ul className="grid w-[160px] gap-3 py-4 px-2 ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="Events">
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem value="Teachers">
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Teachers
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem value="Mailings">
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Mailings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem value="Menu">
              <Link href="/course" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Menu
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
