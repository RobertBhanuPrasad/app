import { useRouter } from "next/router"
import HomeIcon from '@public/assets/HomeIcon'
import SlashIcon from "src/ui/SlashIcon"

type breadCrumbDataType = {
  [key: string]: {
    label: string
    className: string
    href: string
  }[]
}
export const Breadcrumb = () => {
  const router = useRouter()

  /**
   * Based on the URL paths the breadcrumbs listed here
   */
  const breadCrumbData: breadCrumbDataType = {
    '/courses/add': [
      {
        label: 'Home',
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary cursor-pointer',
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
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: '',
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
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary cursor-pointer',
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
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary cursor-pointer',
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
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary cursor-pointer',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: 'text-primary cursor-pointer',
        href: `/courses/${router.query.id}`
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
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary cursor-pointer',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: 'text-primary cursor-pointer',
        href: `/courses/${router.query.id}`
      },
      {
        label: 'View Course Participants',
        className: 'text-primary cursor-pointer',
        href: `/courses/${router.query.id}/participants/list`
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
        className: '',
        href: ''
      },
      {
        label: 'Courses',
        className: 'text-primary cursor-pointer',
        href: '/courses/list'
      },
      {
        label: 'Course Details',
        className: 'text-primary cursor-pointer',
        href: `/courses/${router.query.id}`
      },
      {
        label: 'View Course Participants',
        className: 'text-primary cursor-pointer',
        href: `/courses/${router.query.id}/participants/list`
      },
      {
        label: 'Edit Participant Registration',
        className: '',
        href: ''
      }
    ]
  }

  /**
   * based on the current path as key  retrieve the corresponding value
   */
  const data = breadCrumbData[`${router.pathname}`]

  return (
    <div className="h-[32px] bg-[#F9F9F9] drop-shadow-md flex items-center  shrink-0  font-normal text-[12px] pl-8">
    <HomeIcon />
    <div className="flex">
      {data?.map((label: any, index: number) => {
        const isLastLabel = index === data.length - 1 // Check if it's the last label
        return (
          <p
            className={`${label.className} flex items-center`}
            onClick={() => {  // Check if it's not the last label and not the Home page
              if (!isLastLabel && index !== 0) {
                router.push(`${label.href}`);
              }
            }}
          >
            &nbsp;
            {label.label}
            &nbsp;
            {!isLastLabel && <SlashIcon/>} {/* Render '/' only if it's not the last label */}
          </p>
        )
      })}
    </div>
  </div>
  );
};
