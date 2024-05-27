import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import NewCourseThankyouPage from "@components/course/newCourse/NewCourseThankyouPage";
import _ from "lodash";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { NewCourse } from "pages/courses/add";
import { useEffect, useState } from "react";
import { authProvider } from "src/authProvider";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

const index = () => {
    const {
        query: { section },
      } = useRouter();
    if (section === "thank_you") {
        return (
          <div className="mb-8">
            <NewCourseThankyouPage />;
          </div>
        );
      }
    
      if (section === "preview_page") {
        return <NewCourseReviewPage />;
      } else {
        return <CopyCoursePage />;
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
            if (defaultValues?.contact){
              defaultValues.contact = _.map(defaultValues.contact, (setting) => 
              _.omit(setting, ['id', 'program_id']))
            }
            if (defaultValues?.accommodation){
              defaultValues.accommodation = _.map(defaultValues.accommodation, (setting) => 
              _.omit(setting, ['id', 'program_id']))
            }
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
  