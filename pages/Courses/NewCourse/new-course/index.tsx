import Form from "@components/Formfield"
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage"
import NewCourseThankyouPage from "@components/course/newCourse/NewCourseThankyouPage"
import { useSearchParams } from "next/navigation"
// Define type for sectionComponents

function index() {
  const params = useSearchParams()
  const currentSection = params.get("current_section")

  const sections = [
    {
      sectionName: "preview_page",
      component: <NewCourseReviewPage />,
    },
    {
      sectionName: "thankyou_page",
      component: <NewCourseThankyouPage />,
    },
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
    console.log("form data",data)
  }

  return (
    <div>
      <Form defaultValues={{}} onSubmit={onSubmit}>
        <section>{componentToRender?.component}</section>
      </Form>
    </div>
  )
}

export default index
