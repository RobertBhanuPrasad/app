import { handleCourseDefaultValues } from "@components/course/newCourse/EditCourseUtil";
import NewCourseReviewPage from "@components/course/newCourse/NewCoursePreviewPage";
import NewCourseThankyouPage from "@components/course/newCourse/NewCourseThankyouPage";
import { useGetIdentity } from "@refinedev/core";
import _ from "lodash";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authProvider } from "src/authProvider";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { handleRouteChangeStart } from "@components/course/newCourse/NewCourseUtil";

const index = () => {
  
  const { setNewCourseCreateSuccessOrNot,newCourseCreateSuccessOrNot,editCourseData,newCourseData} = newCourseStore();

  const { data: loginUserData }: any = useGetIdentity();

  const router = useRouter();

  const loggedUserData = loginUserData?.userData?.id;

  console.log("heyy logged user data", loggedUserData);

   // Get the current pathname using the useRouter hook
   const pathname = usePathname();
   
  const [navigationConfirmed, setNavigationConfirmed] = useState<boolean>(false); // State to track if navigation is confirmed

  const {
    query: { section },
  }: any = useRouter();

  console.log(section);

  /**
   * useEffect hook to handle route changes.
   * - Monitors route changes and triggers an alert if navigating away from '/courses/add' without saving.
   * - Emits a routeChangeError event to cancel the navigation when necessary.
   * - Sets a pending URL and opens an alert dialog for user confirmation.
   * - Resets the navigation confirmation flag once the route change completes.
   */
  
  useEffect(() => {

    const routeChange = (url:string) => {

      const condition = !_.isEqual(newCourseData,editCourseData)
      handleRouteChangeStart(url,condition,pathname,router,newCourseCreateSuccessOrNot,setNewCourseCreateSuccessOrNot,navigationConfirmed,setNavigationConfirmed)
    }

    router.events.on('routeChangeStart', routeChange);

    return () => {
        router.events.off('routeChangeStart', routeChange);
    };

}, [pathname, navigationConfirmed, router.events, newCourseData]);

  if (section === "thank_you") {
    return (
      <div className="mb-8">
        <NewCourseThankyouPage />
      </div>
    );
  } else {
    return <EditCourseReviewPage />;
  }
};

export default index;

const EditCourseReviewPage = () => {
  console.log("hehehheheehhe");
  const [isLoading, setIsLoading] = useState(true);

  const {
    query: { id },
  }: any = useRouter();

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id as number;

  const { setNewCourseData,setProgramCreatedById,setEditCourseData } = newCourseStore();

  useEffect(() => {
    const fetchDefaultValues = async () => {
      console.log("clicking on edit course");

      /**
       * load default value by calling this function and store in newCourseData redux variable so that it will be used to prefill
       */
      const defaultValues = await handleCourseDefaultValues(
        id,
        timeFormat12HoursId
      );
      console.log("default values are", defaultValues);

      setNewCourseData(defaultValues);
      setEditCourseData(defaultValues)
      // we are storing the program created by in the zustand variable to use it in the validatios
      setProgramCreatedById(defaultValues?.program_created_by)
      setIsLoading(false);
    };
    fetchDefaultValues();
  }, []); 

  if (isLoading) {
    return <section className="flex justify-center align-center pt-[15%]"><div className="loader"></div></section>
  }
  return <NewCourseReviewPage />;
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
    "common","course.new_course", "new_strings", "course.participants","course.view_course"
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
