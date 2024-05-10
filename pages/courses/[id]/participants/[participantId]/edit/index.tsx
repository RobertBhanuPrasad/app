import Form from "@components/Formfield";
import { ParticipantsListMainHeader } from "@components/participants/ParticipantsListMainHeader";
import EditParticipantTabs from "@components/participants/editParticipant/EditParticipantTabs";
import { handleEditParticipantValues } from "@components/participants/editParticipant/EditParticipantUtil";
import { editParticipantSchema } from "@components/participants/editParticipant/EditParticipantValidations";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authProvider } from "src/authProvider";

export default function Edit() {
    const { query } = useRouter();
    const [defaultValues, setDefaultValues] = useState({});

    // This function will get the participant Id from router and fetches defaultValues from EditParticipantUtil
    const Id: number | undefined = query?.participantId
        ? parseInt(query.participantId as string)
        : undefined;

    useEffect(() => {
        async function fetchData() {
            try {
                const values = await handleEditParticipantValues(Number(Id));
                setDefaultValues(values);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }

        if (Id) {
            fetchData();
        }
    }, [Id]);
    return (
        <div >
            <div className="top-0  z-[100] bg-white shadow-xl w-full">
                <ParticipantsListMainHeader />
            </div>
            <div className="px-[20px] py-[20px]">
                <div>
                    {!defaultValues ||
                    Object.keys(defaultValues).length === 0 ? (
                        <div className="loader"></div>
                    ) : (
                        <Form
                            onSubmit={() => {}}
                            defaultValues={defaultValues}
                            schema={editParticipantSchema()}
                        >
                            <EditParticipantTabs />
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const { authenticated, redirectTo } = await authProvider.check(context);

    const translateProps = await serverSideTranslations(
        context.locale ?? "en",
        ["common", "course.participants", "new_strings", "course.find_course","course.new_course"]
    );

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
