import Form from "@components/Formfield";
import EditIcon from "@public/assets/EditIcon";
import { Dialog } from "@radix-ui/react-dialog";
import { useGetIdentity, useList } from "@refinedev/core";
import { useFormContext } from "react-hook-form";
import {
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
} from "src/constants/CourseConstants";
import { I_AM_CO_TEACHING, SUPER_ADMIN } from "src/constants/OptionValueOrder";
import { Button } from "src/ui/button";
import { DialogContent, DialogFooter, DialogTrigger } from "src/ui/dialog";
import { useValidateCurrentStepFields } from "src/utility/ValidationSteps";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { validationSchema } from "./NewCourseValidations";
import _ from "lodash";
import { requiredValidationFields } from "pages/courses/add";

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
  title: string;
  content: any;
  handleSaveClick: (formData: any) => void;
  handleCancelClick: () => void;
  open: boolean;
  openEdit: () => void;
  onOpenChange: any;
  currentStep: any;
}
import { useTranslation } from "next-i18next";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { PROGRAM_ORGANIZER_TYPE } from "src/constants/OptionLabels";

export const EditModalDialog = ({
  title,
  content,
  handleSaveClick,
  handleCancelClick,
  open,
  openEdit,
  onOpenChange,
  currentStep,
}: EditModalDialogProps) => {
  const { newCourseData } = newCourseStore();
  /**
   * @constant iAmCoTeachingId
   * @description thid const stores the id of the i am co teaching
   */
  const iAmCoTeachingId = getOptionValueObjectByOptionOrder(
    PROGRAM_ORGANIZER_TYPE,
    I_AM_CO_TEACHING
  )?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="w-16 h-18 ml-4 text-blue-600 ">
          <div onClick={openEdit} className="cursor-pointer">
            <EditIcon />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] w-auto max-h-[500px] overflow-y-scroll">
        <Form
          defaultValues={newCourseData}
          onSubmit={function (data: any): void {
            throw new Error("Function not implemented.");
          }}
          schema={validationSchema(iAmCoTeachingId as number)}
        >
          {content}
          {/* From now we can call this a new component instead of keeping it inside the form to avoid rerendering */}
          <ButtonsDialog
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            currentStep={currentStep}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
};

/**
 * ButtonsDialog Component
 *
 * This component renders the buttons within the dialog, including 'Save' and 'Cancel'.
 * 'Save' button updates the course data with the new values and closes the dialog.
 * 'Cancel' button closes the dialog without saving changes.
 *
 * @returns {JSX.Element} - ButtonsDialog component
 */
const ButtonsDialog = ({
  currentStep,
  handleCancelClick,
  handleSaveClick,
}: any) => {
  const { getValues } = useFormContext();
  const formData = getValues();
  const { t } = useTranslation(["common"]);
  const { newCourseData, setNewCourseData } = newCourseStore();

  let validationFieldsStepWise = requiredValidationFields(formData);

  let isAllFieldsFilled = false;

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const onSubmit = async () => {
    isAllFieldsFilled = await ValidateCurrentStepFields(
      validationFieldsStepWise[currentStep - 1]
    );

    // Close the dialog
    if (isAllFieldsFilled) {
      // Update newCourseData with new form data
      setNewCourseData({ ...newCourseData, ...formData });
      handleSaveClick({ ...newCourseData, ...formData });
    }
  };

  return (
    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-5">
      <Button
        onClick={handleCancelClick}
        className="w-[100px] border border-[#7677F4] bg-[white] text-[#7677F4] font-semibold"
      >
        {t("cancel_button")}
      </Button>
      <Button className="w-[100px]" onClick={onSubmit}>
        {t("save_button")}
      </Button>
    </DialogFooter>
  );
};
