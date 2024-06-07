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

        // </section>
    )
}

export default ThankyouPage

export const TickIconInCircle = () => {
    return (
        <svg width="101" height="101" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50.416 0.417969C22.916 0.417969 0.416016 22.918 0.416016 50.418C0.416016 77.918 22.916 100.418 50.416 100.418C77.916 100.418 100.416 77.918 100.416 50.418C100.416 22.918 77.916 0.417969 50.416 0.417969ZM50.416 90.418C28.366 90.418 10.416 72.468 10.416 50.418C10.416 28.368 28.366 10.418 50.416 10.418C72.466 10.418 90.416 28.368 90.416 50.418C90.416 72.468 72.466 90.418 50.416 90.418ZM73.366 28.318L40.416 61.268L27.466 48.368L20.416 55.418L40.416 75.418L80.416 35.418L73.366 28.318Z" fill="#44B741" />
        </svg>

    )
}