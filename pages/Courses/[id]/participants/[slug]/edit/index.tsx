import Form from '@components/Formfield'
import EditParticipantTabs from '@components/participants/editParticipant/EditParticipantTabs'
import { handleEditParticipantValues } from '@components/participants/editParticipant/EditParticipantUtil'
import LoadingIcon from '@public/assets/LoadingIcon'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
export default function index() {
  const { query } = useRouter()
  const [defaultValues, setDefaultValues] = useState({})
  const Id: number | undefined = query?.slug ? parseInt(query.slug as string) : undefined

  // State variable to manage loading state while fetching data
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Set loading state to true while fetching data
        setIsLoading(true)

        // Fetch default values for the form based on the ID
        const values = await handleEditParticipantValues(Number(Id))

        // Set the fetched default values
        setDefaultValues(values)

        // Set loading state back to false after data is fetched
        setIsLoading(false)
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }

    if (Id) {
      fetchData()
    }
  }, [Id])

  return (
    <div>
      <div>
        {isLoading ? (
          <LoadingIcon />
        ) : (
          // Add schema for form validations
          <Form onSubmit={() => {}} defaultValues={defaultValues}>
            <EditParticipantTabs />
          </Form>
        )}
      </div>
    </div>
  )
}
