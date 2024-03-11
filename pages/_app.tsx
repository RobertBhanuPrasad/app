import { Authenticated, Refine, useGetIdentity } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import type { GetServerSideProps, NextPage } from "next";
import { AppProps } from "next/app";

import { Layout } from "@components/layout";
import { dataProvider } from "@refinedev/supabase";
import "@styles/global.css";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";
import { supabaseClient } from "src/utility";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { loginUserStore } from "src/zustandStore/LoginUserStore";
import { optionLabelValueStore } from "src/zustandStore/OptionLabelValueStore";
import { useEffect } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
  requireAuth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    const { setOptionLabelValue, optionLabelValue } = optionLabelValueStore();

    const { setLoginUserData, loginUserData } = loginUserStore();

    const fetchOptionLabelOptionValueData = async () => {
      const { data } = await supabaseClient
        .from("option_labels")
        .select("*,option_values(*)");

      setOptionLabelValue(data as any[]);
    };

    const fetchLoginUserData = async () => {
      const { data } = await supabaseClient.auth.getUser();

      if (data?.user?.id) {
        const { data: userData } = await supabaseClient
          .from("users")
          .select(
            "*,contact_id(*),user_roles(*,role_id(*)),program_type_teachers(program_type_id)"
          )
          .eq("user_identifier", data?.user?.id);

        setLoginUserData({
          loginData: data?.user as Object,
          userData: userData?.[0],
        });
      }
    };

    useEffect(() => {
      fetchOptionLabelOptionValueData();
      fetchLoginUserData();
    }, []);

    const renderContent = () =>
      optionLabelValue?.length != 0 &&
      Object.keys(loginUserData?.userData).length > 0 && (
        <Component {...pageProps} />
      );

    if (Component.requireAuth || Component.requireAuth === undefined) {
      return (
        <Authenticated
          key="app"
          fallback={<div>You cannot access this section</div>}
        >
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
      dataProvider={dataProvider(supabaseClient)}
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

export default appWithTranslation(MyApp);

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
