import { CapsEnvironment, GatewayReturnStatus, paymentStatus } from "caps-ui";
import { useEffect, useState } from "react";

const ThankyouPage = () => {

    const [pStatus, setPStatus] = useState<GatewayReturnStatus | { error: string }>();

    const CAPS_BASE_ENV = process.env.NEXT_PUBLIC_CAPS_ENVIRONMENT as CapsEnvironment

    useEffect(() => {
        paymentStatus(CAPS_BASE_ENV).then(value => setPStatus(value));
    }, []);

    if (!pStatus) { return <></> }
    if ("error" in pStatus) {
        return <p>Some error : {pStatus.error}</p>
    }

    return (
        <div className="h-fit min-w-[500px]  max-w-fit my-10 mx-auto space-y-[10px] rounded-[10px] bg-[white] border-[2px] border-[#D7D7D7] p-4 font-semibold text-[#59595B]">
            <p className="text-lg text-center">Details of the payment</p>
            <hr />
            <p>
                Transaction ID: <span className="font-normal">{pStatus?.id}</span>
            </p>
            <p>
                Status: <span className="font-normal uppercase">{pStatus?.status}</span>
            </p>
            <p>
                Currency: <span className="font-normal uppercase">{pStatus?.currency}</span>
            </p>
            <p>
                Amount: <span className="font-normal">{pStatus?.amount}</span>
            </p>
            <p>
                Payment Method: <span className="font-normal">{pStatus?.method}</span>
            </p>
            <p>
                Payment Vendor: <span className="font-normal">{pStatus?.vendor}</span>
            </p>
            <p>
                Payment Type: <span className="font-normal">{pStatus?.type}</span>
            </p>
            <p>
                Transaction Visible ID : <span className="font-normal">{pStatus?.visible_id}</span>
            </p>
            <p>
                Meta data: <span className="font-normal">{JSON.stringify(pStatus?.metadata)}</span>
            </p>
        </div>
    )
}

export default ThankyouPage
