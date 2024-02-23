import { PropsWithChildren } from "react";

import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import Navbar from "@components/navbar";
import { useRouter } from "next/router";
import HomeIcon from "@public/assets/HomeIcon";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter();
  console.log(pathname, "pathname");

  return (
    <div className="layout">
      <Navbar />
      <div className="h-[32px] w-full bg-[#F9F9F9] drop-shadow-md flex flex-row items-center font-normal">
        <HomeIcon />
        Home{pathname}
      </div>
      <div className="content">
        <Breadcrumb />
        <div>{children}</div>
      </div>
    </div>
  );
};
