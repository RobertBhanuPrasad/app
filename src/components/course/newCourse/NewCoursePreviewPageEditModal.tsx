import Form from '@components/Formfield'
import EditIcon from '@public/assets/EditIcon'
import { Dialog } from '@radix-ui/react-dialog'
import { useGetIdentity, useList } from '@refinedev/core'
import { useFormContext } from 'react-hook-form'
import {
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames
} from 'src/constants/CourseConstants'
import { SUPER_ADMIN } from 'src/constants/OptionValueOrder'
import { Button } from 'src/ui/button'
import { DialogContent, DialogFooter, DialogTrigger } from 'src/ui/dialog'
import { useValidateCurrentStepFields } from 'src/utility/ValidationSteps'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'
import { validationSchema } from './NewCourseValidations'
import _ from 'lodash'

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
  onOpenChange: any
  currentField: any
}

export const EditModalDialog = ({
  title,
  content,
  onClose,
  open,
  openEdit,
  onOpenChange,
  currentField
}: EditModalDialogProps) => {
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
    const { data: loginUserData }: any = useGetIdentity()
    const { data: timeZoneData } = useList({ resource: 'time_zones' })
    const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
      (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
    )

    let RequiredNewCourseStep3FormNames = []

    // REQUIRMENT if the program type is online then we need to validate the online url , state is present or not, city is present or not, center id is present or not
    // so if it is online type then we are keeping the online_url, state_id, city_id, center_id
    if (newCourseData?.program_type?.is_online_program === true) {
      RequiredNewCourseStep3FormNames.push('online_url', 'state_id', 'city_id', 'center_id')
    } else {
      // else we are validating the venues
      RequiredNewCourseStep3FormNames.push('is_existing_venue')
    }

    // REQUIRMENT If country does not have multiple time zones no need to validate time zone drop down
    // If there is one time zone then it will be the default time zone
    // If there are more than one time zones then we need to select the time zone
    // So we are sending the time_zone_id if there are more than 0ne time zone
    if ((timeZoneData?.total as number) > 1) {
      RequiredNewCourseStep3FormNames.push('time_zone_id')
    }

    let RequiredNewCourseStep1FormNames = _.omit(
      NewCourseStep1FormNames,
      newCourseData?.is_registration_via_3rd_party ? [] : ['registration_via_3rd_party_url']
    )

    let RequiredNewCourseStep2FormNames = _.omit(NewCourseStep2FormNames, [
      ...(newCourseData?.program_type?.has_alias_name ? [] : ['program_alias_name_id']),
      ...(newCourseData?.is_geo_restriction_applicable ? [] : ['allowed_countries']),
      ...(hasSuperAdminRole ? [] : ['is_language_translation_for_participants']),
      ...(newCourseData?.program_type?.is_geo_restriction_applicable ? [] : ['is_geo_restriction_applicable'])
    ])
    let RequiredNewCourseStep5FormNames = _.omit(NewCourseStep5FormNames, [
      ...(newCourseData?.is_residential_program == false
        ? [
            'accommodation',
            'fee_per_person',
            'no_of_residential_spots',
            'accommodation_type_id',
            'accommodation_fee_payment_mode'
          ]
        : [])
    ])
    const validationFieldsStepWise = [
      Object.values(RequiredNewCourseStep1FormNames),
      Object.values(RequiredNewCourseStep2FormNames),
      RequiredNewCourseStep3FormNames,
      Object.values(NewCourseStep4FormNames),
      Object.values(RequiredNewCourseStep5FormNames),
      Object.values(NewCourseStep6FormNames)
    ]
    let isAllFieldsFilled = false
    const { ValidateCurrentStepFields } = useValidateCurrentStepFields()
    const onSubmit = async () => {
      // Update newCourseData with new form data
      setNewCourseData({ ...newCourseData, ...formData })
      isAllFieldsFilled = await ValidateCurrentStepFields(validationFieldsStepWise[currentField])
      console.log(isAllFieldsFilled, 'isallfiilled')

      // Close the dialog
      if (isAllFieldsFilled) {
        onClose()
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="w-16 h-18 ml-4 text-blue-600 ">
          <div onClick={openEdit} className="cursor-pointer">
            <EditIcon />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-auto max-h-[500px] overflow-y-scroll">
        <Form
          defaultValues={newCourseData}
          onSubmit={function (data: any): void {
            throw new Error('Function not implemented.')
          }}
          schema={validationSchema()}
        >
          {content}
          <ButtonsDialog />
        </Form>
      </DialogContent>
    </Dialog>
  )
}
