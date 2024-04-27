import Navbar from '@components/navbar'
import background from '@public/images/background.png'
import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { Breadcrumb } from '../breadcrumb'

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="layout sticky">
      <Image src={background} alt="bg" className="w-full -mt-1 !h-[227px]" />
      <div className="absolute top-0 left-0 w-full z-10 inset-0">
        <Navbar />
        <Breadcrumb />
        <div className="mt-9">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  )
}
