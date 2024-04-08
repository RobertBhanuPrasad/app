import { PropsWithChildren } from "react";

import Navbar from "@components/navbar";
import HomeIcon from "@public/assets/HomeIcon";
import background from "@public/images/background.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { Breadcrumb } from "../breadcrumb";

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
            <Image src={background} alt="bg" className="w-full -mt-1 !h-[227px]" />
            <div className=" absolute top-0 left-0 w-full h-[100vh] overflow-hidden pb-16">
                <Navbar />
                <div className="h-[32px] bg-[#F9F9F9] drop-shadow-md flex items-center gap-2 shrink-0  font-normal text-[12px] text-[#7677F4] ">
                    <HomeIcon />
                    <div>
                        Home
                        {formattedPthName}
                    </div>
                </div>
                <Breadcrumb />
                {children}
            </div>
        </div>
    );
};
