import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import NewCourseThankyouPage from "@components/course/newCourse/NewCourseThankyouPage";
import { IsShowConfirmBoxInNewCourse } from "@components/courseBusinessLogic";
import { NewCourseContext, useNewCourseContext } from "@contexts/NewCourseContext";
import _ from "lodash";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { NewCourse, getSectionFromUrl } from "pages/courses/add";
import { useEffect, useState } from "react";
import { authProvider } from "src/authProvider";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

const index = () => {

      const router = useRouter()

      const {
        query: { section },
      } = router;

     
 /**
   * This context is used to keep track of whether the copy course form is edited or not
   * Requirement: We have to stop the user when he is changing route form one to another
   * Implementation: To make it simple we are using useRef
   */
  useEffect(() => {
    const routeChange = (url: string) => {  

        const sectionFromUrl = getSectionFromUrl(url,'section')

        // if the destination url is the preview page then we don't need to show the confirm box.
        // if the data is entered and then click on newCourse again we have to show the confirm box.
        if (IsShowConfirmBoxInNewCourse(sectionFromUrl,section)) {
          if (
            confirm(
              "Do you want to leave this page? Unsaved changes may be lost."
            )
          ) {
            console.log("ok go ahead");
          } else {
            router.events.emit("routeChangeError");
            throw "Route change aborted. User confirmation required.";
          }
        }
      
    };

    router.events.off("routeChangeStart", routeChange);

    router.events.on("routeChangeStart", routeChange);

    return () => {
      router.events.off("routeChangeStart", routeChange);
    };
    
  }, [section]);

    if (section === "thank_you") {
        return (
          <div className="mb-8">
            <NewCourseThankyouPage />;
          </div>
        );
      }
    
      if (section === "preview_page") {
        return<NewCourseReviewPage />
      } else {
        return<CopyCoursePage />
      }
}

export default index;


export const CopyCoursePage = () => {
    const [isLoading, setIsLoading] = useState(true);
  
    const {
      query: { id },
    }: any = useRouter();
  
    const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
      TIME_FORMAT,
      TIME_FORMAT_12_HOURS
    )?.id as number;

    const { setNewCourseData,setProgramCreatedById,setCurrentStep } = newCourseStore();
  
    useEffect(() => {
      const fetchDefaultValues = async () => {
  
        /**
         * load default value by calling this function and store in newCourseData redux variable so that it will be used to prefill
         */
        let defaultValues = await handleCourseDefaultValues(
          id,
          timeFormat12HoursId
        );
        
          // we have to delete schedules when user click on copy course and other we need to prefill
          defaultValues = _.omit(defaultValues, ["id", "schedules"]);

          //remove the id, program_id from each object in program_fee_level_settings array
          if (defaultValues?.program_fee_level_settings) {
            defaultValues.program_fee_level_settings = _.map(defaultValues.program_fee_level_settings, (setting) =>
              _.omit(setting, ['id', 'program_id'])
            );
          }

          //Remove the id, program_id from each object in contact array
          if (defaultValues?.contact){
            defaultValues.contact = _.map(defaultValues.contact, (contact) => 
            _.omit(contact, ['id', 'program_id']))
          }

          // Remove the id, program_id from each object in accommodation array
          if (defaultValues?.accommodation){
            defaultValues.accommodation = _.map(defaultValues.accommodation, (accomodation) => 
            _.omit(accomodation, ['id', 'program_id']))
          }

          setNewCourseData(defaultValues);
          // we are storing the program created by in the zustand variable to use it in the validatios
          setProgramCreatedById(defaultValues?.program_created_by)
          setIsLoading(false);

          // when we do copy course we have to set the current step to first step
          setCurrentStep(1);
      };
      fetchDefaultValues();
    }, []); 
  
    if (isLoading) {
      return <section className="flex justify-center align-center pt-[15%]"><div className="loader"></div></section>
    }
    return <NewCourse />;
  };


  /**
 * Function to fetch server-side props.
 * This function checks the authentication status using the auth provider and
 * fetches translations for the current locale.
 * If the user is not authenticated, it redirects them to the specified destination.
 * @param context The context object containing information about the request.
 * @returns Server-side props including translated props or redirection information.
 */
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
  