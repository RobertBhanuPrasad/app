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
import { getLanguageCodeFromLocale } from "src/utility/useGetLanguageCode";
import { ConfigStore } from "src/zustandStore/ConfigStore";
import { optionLabelValueStore } from "src/zustandStore/OptionLabelValueStore";

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
  const supabase: any = supabaseClient(countryCode);

  const renderComponent = () => {
    const { setOptionLabelValue } = optionLabelValueStore();

    const { setCountryCode, setLanguageCode } = ConfigStore();

    const fetchOptionLabelOptionValueData = async () => {
      const {data: enumData}=await supabase.rpc('get_enums_for_schema', { schema_name: 'public' })

      const result = enumData.reduce((acc:any, { enum_name, enum_value }:{enum_name: string,enum_value:string}) => {
        if (!acc[enum_name]) {
          acc[enum_name] = {};
        }
        acc[enum_name][enum_value] = enum_value;
        return acc;
      }, {});

      console.log("Enums Values are:",result)
      setOptionLabelValue(result);
    };

    useEffect(() => {
      fetchOptionLabelOptionValueData();

      // set coutry code and language code in zustand store
      setCountryCode(countryCode);
      setLanguageCode(languageCode);
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
