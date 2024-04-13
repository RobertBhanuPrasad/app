import Form from "@components/Formfield";
import EditParticipantTabs from "@components/participants/editParticipant/EditParticipantTabs";
export default function index() {
    
    return (
        <div>
            <div>
                <Form defaultValues={undefined}>
                    <EditParticipantTabs />
                </Form>
            </div>
        </div>
    );
}
