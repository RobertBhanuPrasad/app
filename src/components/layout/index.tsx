import { PropsWithChildren } from "react";

import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import Navbar from "@components/navbar";
import { useRouter } from "next/router";
import HomeIcon from "@public/assets/HomeIcon";
import Image from "next/image";
import background from "@public/images/background.png";

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
      <div className="h-[32px]  bg-[#F9F9F9] drop-shadow-md flex items-center gap-2 shrink-0  font-normal text-[12px] text-[#7677F4] ">
        <HomeIcon />
        <div>
          Home
          {formattedPthName}
        </div>
      </div>
      <div className="content">
        <Breadcrumb />

        <div className="mx-8" style={{ backgroundImage: `url(${background})` }}>
          <div className="text-[24px] my-4 font-semibold">NEW COURSE</div>
          {children}
        </div>
      </div>
    </div>
  );
};
