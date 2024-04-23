import Form from '@components/Formfield'
import EditIcon from '@public/assets/EditIcon'
import { Dialog } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Button } from 'src/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogTrigger } from 'src/ui/dialog'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'

/**
 * EditModalDialog Component
 *
 * This component represents a modal dialog for editing course details.
 * It contains a trigger button to open the dialog, which displays the provided content.
 * The content typically includes a form for editing course data.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the dialog
 * @param {ReactNode} props.content - Content of the dialog, usually a form for editing data
 * @param {Function} props.onClose - Function to close the dialog
 * @param {boolean} props.open - Boolean indicating whether the dialog is open or closed
 * @param {Function} props.openEdit - Function to trigger editing mode
 * @returns {JSX.Element} - EditModalDialog component
 */

interface EditModalDialogProps {
  title: string
  content: any
  onClose: () => void
  open: boolean
  openEdit: () => void
}

export const EditModalDialog = ({ title, content, onClose, open, openEdit }: EditModalDialogProps) => {
  const { newCourseData, setNewCourseData } = newCourseStore()

  /**
   * ButtonsDialog Component
   *
   * This component renders the buttons within the dialog, including 'Save' and 'Cancel'.
   * 'Save' button updates the course data with the new values and closes the dialog.
   * 'Cancel' button closes the dialog without saving changes.
   *
   * @returns {JSX.Element} - ButtonsDialog component
   */

  const ButtonsDialog = () => {
    const { getValues } = useFormContext()
    const formData = getValues()
    const onSubmit = () => {
      // Update newCourseData with new form data
      setNewCourseData({ ...newCourseData, ...formData })
      // Close the dialog
      onClose()
    }

    return (
      <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
        <Button onClick={onClose} className="w-[100px] border border-[#7677F4] bg-[white] text-[#7677F4] font-semibold">
          Cancel
        </Button>
        <Button className="w-[100px]" onClick={onSubmit}>
          Save
        </Button>
      </DialogFooter>
    )
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <div className="w-16 h-18 ml-4 text-blue-600 ">
          <div onClick={openEdit} className="cursor-pointer">
            <EditIcon />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-auto">
        <DialogClose asChild>
          <X
            className=" cursor-pointer absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={onClose}
          />
        </DialogClose>
        <Form
          defaultValues={newCourseData}
          onSubmit={function (data: any): void {
            throw new Error('Function not implemented.')
          }}
        >
          {content}
          <ButtonsDialog />
        </Form>
      </DialogContent>
    </Dialog>
  )
}
