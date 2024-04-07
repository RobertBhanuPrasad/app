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
    <div className="layout sticky top-0 bg-white z-50">
      <Image src={background} alt="bg" className="w-full -mt-1 !h-[227px]" />
      <div className="absolute top-0 left-0 w-full z-10 inset-0">
        <Navbar />
        <div className="h-[32px] bg-[#F9F9F9] drop-shadow-md flex items-center gap-2 shrink-0  font-normal text-[12px] text-[#7677F4] ">
          <HomeIcon />
          <div>
            Home
            {formattedPthName}
          </div>
        </div>
        <Breadcrumb />
        <div className="mt-9">
          <div className="">
            <div className="text-[24px] my-4 font-semibold mx-8">NEW COURSE</div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
