import { PropsWithChildren } from 'react'

import Navbar from '@components/navbar'
import HomeIcon from '@public/assets/HomeIcon'
import background from '@public/images/background.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Breadcrumb } from '../breadcrumb'

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const {
    query: { id, participantId }
  } = useRouter()
  const breadCrumbData:any = {
    '/courses/add': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list '
      },
      {
        label: 'New Course',
        className: '',
        href: ''
      }
    ],
    '/courses/list': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list'
      },
      {
        label: 'Find Courses',
        className: '',
        href: ''
      }
    ],
    '/courses/[id]': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: '',
        href: ''
      }
    ],
    '/courses/[id]/edit': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list'
      },
      {
        label: 'Edit Course',
        className: '',
        href: ''
      }
    ],
    '/courses/[id]/participants/list': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: 'text-primary',
        href: `/courses/${id}`
      },
      {
        label: 'View Course Participants',
        className: '',
        href: ''
      }
    ],
    '/courses/[id]/participants/[participantId]': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: 'text-primary',
        href: `/courses/${id}`
      },
      {
        label: 'View Course Participants',
        className: 'text-primary',
        href: `/courses/${id}/participants/list`
      },
      {
        label: 'Participant Registration Details',
        className: '',
        href: ''
      }
    ],
    '/courses/[id]/participants/[participantId]/edit': [
      {
        label: 'Home',
        className: 'text-primary',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: 'text-primary',
        href: `/courses/${id}`
      },
      {
        label: 'View Course Participants',
        className: 'text-primary',
        href: `/courses/${id}/participants/list`
      },
      {
        label: 'Edit Participant Registration',
        className: '',
        href: ''
      }
    ]
  }
  const { pathname } = useRouter()

  const data: any = breadCrumbData[`${pathname}`]

  return (
    <div className="layout sticky">
      <Image src={background} alt="bg" className="w-full -mt-1 !h-[227px]" />
      <div className="absolute top-0 left-0 w-full z-10 inset-0">
        <Navbar />
        <div className="h-[32px] bg-[#F9F9F9] drop-shadow-md flex items-center  shrink-0  font-normal text-[12px] pl-8">
          <HomeIcon />
          <div className="flex">
            {data?.map((label: any, index: number) => {
              const isLastLabel = index === data.length - 1 // Check if it's the last label
              return (
                <p
                  className={`${label.className} text-xs`}
                  onClick={() => {
                   !isLastLabel && router.push(`${label.href}`)
                  }}
                >
                  &nbsp;
                  {label.label}
                  {!isLastLabel && ' /'} {/* Render '/' only if it's not the last label */}
                </p>
              )
            })}
          </div>
        </div>
        <Breadcrumb />
        <div className="mt-9">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  )
}
