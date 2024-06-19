import HeaderSection from '@components/course/viewCourse/CourseAccountingForm/CourseAccountingFormHeader'
import Form from '@components/Formfield'
import CloseParticipantsSection from '@components/course/viewCourse/CourseAccountingForm/CloseParticipantsSection'
import ExpenseSection from '@components/course/viewCourse/CourseAccountingForm/ExpenseSection'
import RevenueSection from '@components/course/viewCourse/CourseAccountingForm/RevenueSection'
import { useSearchParams } from 'next/navigation'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { accountingValidationSchema } from '@components/course/viewCourse/CourseAccountingForm/CourseAccountingValidations'

function index() {
  const params = useSearchParams()
  const currentSection = params.get('current_section')

  const sections = [
    {
      sectionName: 'close_participants',
      component: <CloseParticipantsSection />
    },
    {
      sectionName: 'revenue',
      component: <RevenueSection />
    },
    {
      sectionName: 'expense',
      component: <ExpenseSection />
    }
  ]

  /**
   * WE have 3 sections right but we have to render only one section at a moment
   * For this we will use find method
   * We will find the component to render based on the current section
   * we will get current section form url params
   * We are storing the curren_section information in params when user click on buttons we are setting
   */
  const componentToRender = sections.find((item: any) => {
    return item.sectionName === currentSection
  })

  const onSubmit = (data: unknown) => {
    console.log('form data', data)
  }

  const { courseAccountingFormDefaultValues } = newCourseStore()
  return (
    <div>
      <section className="h-[83px] top-[96px] z-10 sticky shadow-md w-full bg-[white]">
        {/*  here we are showing header section  */}
        <HeaderSection />
      </section>

      <Form
        defaultValues={courseAccountingFormDefaultValues}
        schema={accountingValidationSchema()}
        onSubmit={onSubmit}
      >
        <section>{componentToRender?.component}</section>
      </Form>
    </div>
  );
}

export default index

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
    "course.new_course",
    "new_strings",
    "course.participants",
    "course.view_course",
    "course.find_course",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};

