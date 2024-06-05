import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "src/ui/alert-dialog";

export type DialogProps = {
    message: React.ReactNode;
    buttonMessage: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    title: string;
}


export function Dialog(props: DialogProps) {
    return (<AlertDialog defaultOpen>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{props.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {props.message}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="text-center">
                {/* <AlertDialogCancel>Retry</AlertDialogCancel> */}
                <AlertDialogAction onClick={props.onClick}>{props.buttonMessage}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>);
}