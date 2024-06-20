import { Authenticated, Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import type { GetServerSideProps, NextPage } from "next";
import { AppProps } from "next/app";
import "caps-ui/dist/caps.css"
import { Layout } from "@components/layout";
import { dataProvider } from "@refinedev/supabase";
import "@styles/global.css";
import { appWithTranslation, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withRouter } from "next/router";
import { useEffect } from "react";
import { authProvider } from "src/authProvider";
import { supabaseClient } from "src/utility";
import { getCountryCodeFromLocale } from "src/utility/useGetCountryCode";
import { getLanguageCodeFromLocale, loadLanguageModule } from "src/utility/useGetLanguageCode";
import { ConfigStore } from "src/zustandStore/ConfigStore";
import { optionLabelValueStore } from "src/zustandStore/OptionLabelValueStore";
import { staticDataStore } from "src/zustandStore/StaticDataStore";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat' 

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
  requireAuth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps,
  router,
}: AppPropsWithLayout): JSX.Element {
  const countryCode = getCountryCodeFromLocale(router.locale as string);
  const languageCode = getLanguageCodeFromLocale(router.locale as string);

  // this function is used for the dynamic importing of the locale of dayjs
  loadLanguageModule(languageCode)

  // we are giving the language code of ours as per the country,
  // so it sets its locale globally and based on the locale it retrives the months week and all as per this locale
  dayjs.locale(languageCode);

  // we are extending the dayjs with the plugin advancedFormat to use for the ordinals for the date and etc.
  dayjs.extend(advancedFormat);

  const supabase: any = supabaseClient(countryCode);

  const renderComponent = () => {
    const { setOptionLabelValue } = optionLabelValueStore();

    const { setCountryCode, setLanguageCode } = ConfigStore();
    const { setStaticData } = staticDataStore();

    const fetchOptionLabelOptionValueData = async () => {
      const { data } = await supabase
        .from("option_labels")
        .select("*,option_values(*)");
      console.log("Option Label Value Data", data);
      setOptionLabelValue(data as any[]);
    };

    useEffect(() => {
      fetchOptionLabelOptionValueData();

      // set coutry code and language code in zustand store
      setCountryCode(countryCode);
      setLanguageCode(languageCode);

      /**
       * getStaticDataFromLocalStorage function is used to set the static data from the local storage in zustand store
       * Here we are getting static data from local storage using getItem() function
       * After getting the static data we set the data in zustand store using setStaticData() void
       */
      const getStaticDataFromLocalStorage = async ()=>{

        // Getting staticData stored in local storage
        const localStorageDataStr = localStorage.getItem("staticDataFromDB");
        let localStorageData = localStorageDataStr ? JSON.parse(localStorageDataStr) : {};       
        setStaticData(localStorageData)
      }

      getStaticDataFromLocalStorage()
      
    }, []);

    const renderContent = () => <Component {...pageProps} />;

    if (Component.requireAuth || Component.requireAuth === undefined) {
      return (
        <Authenticated key="app">
          {Component.noLayout ? (
            renderContent()
          ) : (
            <Layout>{renderContent()}</Layout>
          )}
        </Authenticated>
      );
    }

    if (Component.noLayout) {
      return renderContent();
    }

    return <Layout>{renderContent()}</Layout>;
  };

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const lang = i18n.language;

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(supabase)}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      resources={[
        {
          name: "course",
          list: "/course",
          create: `/course/${lang}/create/`,
          edit: "/course/edit/:id",
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        useNewQueryKeys: true,
      }}
    >
      {renderComponent()}
    </Refine>
  );
}

export default withRouter(appWithTranslation(MyApp));

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (authenticated) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      pageProps: {
        authenticated: authenticated,
        ...translateProps,
      },
    },
  };
};
