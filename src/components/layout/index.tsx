import Navbar from "@components/navbar";
import background from "@public/images/background.png";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="layout relative w-full h-full">
      <div className="fixed top-0 left-0 w-full h-[96px] bg-[white] z-10">
        <Navbar />
        <Breadcrumb />
      </div>

      <div className="mt-[120px]">
        <div className="absolute -top-[80px] -z-10 w-full">
          <Image src={background} alt="bg" className="w-full" />
        </div>
        {children}
      </div>
    </div>
  );
};
