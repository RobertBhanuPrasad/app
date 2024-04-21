import Form from "@components/Formfield";
import EditParticipantTabs from "@components/participants/editParticipant/EditParticipantTabs";
import { handleEditParticipantValues } from "@components/participants/editParticipant/EditParticipantUtil";
import LoadingIcon from "@public/assets/LoadingIcon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {editParticipantSchema} from '@components/participants/editParticipant/EditParticipantValidations'

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
        <div>
            <div>
                {!defaultValues || Object.keys(defaultValues).length === 0 ? (
                    <LoadingIcon />
                ) : (
                    <Form onSubmit={() => {}} defaultValues={defaultValues} schema={editParticipantSchema()}>
                        <EditParticipantTabs />
                    </Form>
                )}
            </div>
        </div>
    );
}
