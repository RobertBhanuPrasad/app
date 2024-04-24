import Form from "@components/Formfield";
import { ParticipantsListMainHeader } from "@components/participants/ParticipantsListMainHeader";
import EditParticipantTabs from "@components/participants/editParticipant/EditParticipantTabs";
import { handleEditParticipantValues } from "@components/participants/editParticipant/EditParticipantUtil";
import { editParticipantSchema } from "@components/participants/editParticipant/EditParticipantValidations";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Edit() {
    const { query } = useRouter();
    const [defaultValues, setDefaultValues] = useState({});
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
            <div className="top-0 sticky z-[100] bg-white shadow-xl w-full">
                <ParticipantsListMainHeader />
            </div>
            <div className="px-[20px] py-[20px]">
                <div>
                    {!defaultValues ||
                    Object.keys(defaultValues).length === 0 ? (
                        <LoadingIcon />
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
