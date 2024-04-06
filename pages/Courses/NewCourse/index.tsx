import Form from '@components/Formfield'
import NewCourseReviewPage from '@components/course/newCourse/NewCoursePreviewPage'
import NewCourseStep1 from '@components/course/newCourse/NewCourseStep1'
import NewCourseStep2 from '@components/course/newCourse/NewCourseStep2'
import NewCourseStep3 from '@components/course/newCourse/NewCourseStep3'
import NewCourseStep4 from '@components/course/newCourse/NewCourseStep4'
import NewCourseStep5 from '@components/course/newCourse/NewCourseStep5'
import NewCourseStep6 from '@components/course/newCourse/NewCourseStep6'
import NewCourseThankyouPage from '@components/course/newCourse/NewCourseThankyouPage'
import Car from '@public/assets/Car'
import Fees from '@public/assets/Fees'
import Group from '@public/assets/Group'
import Info from '@public/assets/Info'
import Profile from '@public/assets/Profile'
import Venue from '@public/assets/Venue'
import { useGetIdentity } from '@refinedev/core'
import { useFormContext } from 'react-hook-form'
import {
  ACCOMMODATION_STEP_NUMBER,
  BASIC_DETAILS_STEP_NUMBER,
  CONTACT_INFO_STEP_NUMBER,
  COURSE_DETAILS_STEP_NUMBER,
  FEE_STEP_NUMBER,
  NewCourseStep1FormNames,
  NewCourseStep2FormNames,
  NewCourseStep3FormNames,
  NewCourseStep4FormNames,
  NewCourseStep5FormNames,
  NewCourseStep6FormNames,
  TIME_AND_VENUE_STEP_NUMBER
} from 'src/constants/CourseConstants'
import { VISIBILITY } from 'src/constants/OptionLabels'
import { PUBLIC } from 'src/constants/OptionValueOrder'
import { Button } from 'src/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/ui/tabs'
import { getOptionValueObjectByOptionOrder } from 'src/utility/GetOptionValuesByOptionLabel'

import _ from 'lodash'
import { SUPER_ADMIN } from 'src/constants/OptionValueOrder'
import { useValidateCurrentStepFields } from 'src/utility/ValidationSteps'
import { newCourseStore } from 'src/zustandStore/NewCourseStore'
import { validationSchema } from './NewCourseValidations'

function index() {
  const { data: loginUserData }: any = useGetIdentity()

  const { viewPreviewPage, viewThankyouPage } = newCourseStore()

  console.log(loginUserData)
  // if (!loginUserData?.userData) {
  //   return <div>Loading...</div>;
  // }

  if (viewThankyouPage) {
    return (
      <div className="mb-8">
        <NewCourseThankyouPage />;
      </div>
    )
  }

  if (viewPreviewPage) {
    return <NewCourseReviewPage />
  } else {
    return <NewCourse />
  }
}
function NewCourse() {
  const { data: loginUserData }: any = useGetIdentity()
  const { currentStep, setCurrentStep } = newCourseStore()

  const loggedUserData = loginUserData?.userData?.id

  // Array of step titles, icons, and colors
  const stepTitles = [
    {
      value: BASIC_DETAILS_STEP_NUMBER,
      label: 'Basic Details',
      icon: <Profile color={` ${currentStep == BASIC_DETAILS_STEP_NUMBER ? '#7677F4' : '#999999'}`} />
    },
    {
      value: COURSE_DETAILS_STEP_NUMBER,
      label: 'Course Details',
      icon: <Group color={` ${currentStep == COURSE_DETAILS_STEP_NUMBER ? '#7677F4' : '#999999'}`} />
    },
    {
      value: TIME_AND_VENUE_STEP_NUMBER,
      label: 'Time and Venue',
      icon: <Venue color={` ${currentStep == TIME_AND_VENUE_STEP_NUMBER ? '#7677F4' : '#999999'}`} />
    },
    {
      value: FEE_STEP_NUMBER,
      label: 'Fees',
      icon: <Fees color={` ${currentStep == FEE_STEP_NUMBER ? '#7677F4' : '#999999'}`} />
    },
    {
      value: ACCOMMODATION_STEP_NUMBER,
      label: 'Accommodation',
      icon: <Car color={` ${currentStep == ACCOMMODATION_STEP_NUMBER ? '#7677F4' : '#999999'}`} />
    },
    {
      value: CONTACT_INFO_STEP_NUMBER,
      label: 'Contact Info',
      icon: <Info color={` ${currentStep == CONTACT_INFO_STEP_NUMBER ? '#7677F4' : '#999999'}`} />
    }
  ]

  const onSubmit = (formData: any) => {
    console.log(formData)
  }

  //Finding program Organizer role id
  const publicVisibilityId = getOptionValueObjectByOptionOrder(VISIBILITY, PUBLIC)?.id

  const defaultValues = {
    [NewCourseStep2FormNames?.visibility_id]: publicVisibilityId,
    [NewCourseStep2FormNames?.is_language_translation_for_participants]: true,
    [NewCourseStep2FormNames?.is_geo_restriction_applicable]: true,
    [NewCourseStep5FormNames?.is_residential_program]: 'No',
    [NewCourseStep5FormNames?.accommodation_fee_payment_mode]: 'Pay Online',
    [NewCourseStep1FormNames?.organizer_ids]: [loggedUserData]
  }

  // If the form is still loading, display a loading message
  // if (formLoading) {
  //   return <div>Loading...</div>;
  // }

  const contentStylings =
    'inline-flex !mt-0 whitespace-nowrap rounded-s-sm text-sm font-medium  data-[state=active]:bg-background '
  return (
    <div className="bg-[white]  ">
      <Tabs value={JSON.stringify(currentStep)}>
        <div className="flex flex-row">
          <TabsList className="h-full bg-[#7677F41B] w-[238px] rounded-l-[24px] shadow-md py-10">
            <div className="flex flex-col h-full gap-4 ">
              {stepTitles.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={JSON.stringify(tab.value)}
                  className="!h-12  items-center w-[230px] text-[#999999] !font-normal data-[state=active]:text-[#7677F4]  data-[state=active]:bg-gradient-to-r from-[#7677F4]/20  to-[#7677F4]/10 gap-[9px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  onClick={() => setCurrentStep(tab.value)}
                >
                  {currentStep === tab.value && <div className="rounded bg-[#7677F4] w-1 !h-12 -ml-3"></div>}
                  <div className="flex flex-row gap-[10px] ml-[14px] items-center">
                    {tab.icon}
                    {tab.label}
                  </div>
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          <div className="bg-[white] w-full rounded-[24px] -ml-4 -mt-1 p-6 shadow-md h-[517px]">
            <Form onSubmit={onSubmit} defaultValues={defaultValues} schema={validationSchema()}>
              <div className="flex flex-col justify-between max-h-[460px] h-[460px] overflow-y-auto scrollbar">
                <div>
                  <TabsContent value={JSON.stringify(BASIC_DETAILS_STEP_NUMBER)} className={contentStylings}>
                    <NewCourseStep1 />
                  </TabsContent>
                  <TabsContent value={JSON.stringify(COURSE_DETAILS_STEP_NUMBER)} className={contentStylings}>
                    <NewCourseStep2 />
                  </TabsContent>
                  <TabsContent value={JSON.stringify(TIME_AND_VENUE_STEP_NUMBER)} className={contentStylings}>
                    <NewCourseStep3 />
                  </TabsContent>
                  <TabsContent value={JSON.stringify(FEE_STEP_NUMBER)} className={contentStylings}>
                    <NewCourseStep4 />
                  </TabsContent>
                  <TabsContent value={JSON.stringify(ACCOMMODATION_STEP_NUMBER)} className={contentStylings}>
                    <NewCourseStep5 />
                  </TabsContent>
                  <TabsContent value={JSON.stringify(CONTACT_INFO_STEP_NUMBER)} className={contentStylings}>
                    <NewCourseStep6 />
                  </TabsContent>
                </div>

                <Footer stepTitles={stepTitles} />
              </div>
            </Form>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default index

const Footer = ({ stepTitles }: any) => {
  const { watch, getValues } = useFormContext()
  const { setViewPreviewPage, setNewCourseData, currentStep, setCurrentStep } = newCourseStore()

  const { data: loginUserData }: any = useGetIdentity()
  const hasSuperAdminRole = loginUserData?.userData?.user_roles.find(
    (val: { role_id: { order: number } }) => val.role_id?.order == SUPER_ADMIN
  )

  const formData = getValues()

  let RequiredNewCourseStep1FormNames = _.omit(
    NewCourseStep1FormNames,
    formData?.is_registration_via_3rd_party ? [] : ['registration_via_3rd_party_url']
  )

  let RequiredNewCourseStep2FormNames = _.omit(NewCourseStep2FormNames, [
    ...(formData?.program_type?.has_alias_name ? [] : ['program_alias_name_id']),
    ...(formData?.is_geo_restriction_applicable ? [] : ['allowed_countries']),
    ...(hasSuperAdminRole ? [] : ['is_language_translation_for_participants'])
  ])

  let RequiredNewCourseStep3FormNames = _.omit(
    NewCourseStep3FormNames,
    formData?.program_type?.is_online_program ? [] : ['online_url']
  )

  let RequiredNewCourseStep5FormNames = _.omit(NewCourseStep5FormNames, [
    ...(formData?.is_residential_program == 'No' ? ['accommodation'] : []),
    ...(formData?.is_residential_program == 'No' ? ['fee_per_person'] : []),
    ...(formData?.is_residential_program == 'No' ? ['no_of_residential_spots'] : []),
    ...(formData?.is_residential_program == 'No' ? ['accommodation_type_id'] : [])
  ])

  const validationFieldsStepWise = [
    Object.values(RequiredNewCourseStep1FormNames),
    Object.values(RequiredNewCourseStep2FormNames),
    Object.values(RequiredNewCourseStep3FormNames),
    Object.values(NewCourseStep4FormNames),
    Object.values(RequiredNewCourseStep5FormNames),
    Object.values(NewCourseStep6FormNames)
  ]

  const { ValidateCurrentStepFields } = useValidateCurrentStepFields()

  const handleClickReviewDetailsButton = async (currentStepFormNames: any[]) => {
    const formData = watch()

    const isAllFieldsFilled = await ValidateCurrentStepFields(currentStepFormNames)
    if (isAllFieldsFilled) {
      setViewPreviewPage(true)
      setNewCourseData(formData)
    }
  }

  const handleClickNext = async (currentStepFormNames: any[]) => {
    const isAllFieldsFilled = await ValidateCurrentStepFields(currentStepFormNames)
    if (isAllFieldsFilled) {
      setCurrentStep(currentStep + 1)
    }
    return isAllFieldsFilled
  }

  const handleClickPrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="flex self-end justify-center gap-4 w-full mt-2">
      {currentStep > 1 && (
        <Button
          onClick={e => {
            e.preventDefault()
            handleClickPrevious()
          }}
          className="border border-[#7677F4] bg-[white] w-[118px] h-[46px] text-[#7677F4] font-semibold"
        >
          Previous
        </Button>
      )}

      {currentStep < stepTitles.length && (
        <Button
          className="bg-[#7677F4] w-[87px] h-[46px] rounded-[12px] font-semibold"
          onClick={async e => {
            e.preventDefault()
            await handleClickNext(validationFieldsStepWise[currentStep - 1])
          }}
        >
          Next
        </Button>
      )}

      {currentStep == CONTACT_INFO_STEP_NUMBER && (
        <Button
          className="bg-[#7677F4] w-[117px] h-[46px] rounded-[12px] "
          onClick={async () => {
            await handleClickReviewDetailsButton(validationFieldsStepWise[currentStep - 1])
          }}
        >
          Review Details
        </Button>
      )}
    </div>
  )
}
