import EditPencil from "@public/assets/EditPencil"
import { DialogContent } from "@radix-ui/react-dialog"
import { Dialog, DialogTrigger } from "src/ui/dialog"

export const EditMangeDialogModal = ({

}) =>{
    return (
        <Dialog>
            <DialogTrigger >
                <button>
                    <div className="flex gap-1 mt-1">
                        <div className="mt-[1px]"><EditPencil/></div>
                        <span className="text-sm text-[#7677F4]">Manage</span>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent>
                <div className="min-w-[859px] w-auto h-[523px] border shadow-2xl bg-white absolute top-[1%] left-[22%] rounded-xl">
                </div>
            </DialogContent>
        </Dialog>
    )
}