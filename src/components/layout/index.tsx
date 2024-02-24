import { PropsWithChildren } from "react";

import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import Navbar from "@components/navbar";
import { useRouter } from "next/router";
import HomeIcon from "@public/assets/HomeIcon";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter();
  const addGapsToPathname = (pathname: any) => {
    // Split the pathname by '/' and insert a hyphen before and after each '/'
    const newPathname = pathname.split("/").join(" / ");

    return newPathname;
  };

  const formattedPthName = addGapsToPathname(pathname);

  return (
    <div className="layout">
      <Navbar />
      <div className="h-[32px] w-full bg-[#F9F9F9] drop-shadow-md flex flex-row items-center font-normal text-[12px] text-[#7677F4] ">
        <div className="ml-7 flex flex-row">
          <HomeIcon />
          Home
          {formattedPthName}
        </div>
      </div>
      <div className="content">
        <Breadcrumb />
        <div>{children}</div>
      </div>
    </div>
  );
};
