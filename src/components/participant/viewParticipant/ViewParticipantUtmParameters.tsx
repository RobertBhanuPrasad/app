import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { TableHeader, Text } from 'src/ui/TextTags'
// Component for viewing participant UTM parameters
function ViewParticipantUtmParameters({ participantId }: any) {
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select: 'utm_parameters_section' // Selecting specific fields
    }
  }

  // Fetching participant registration data
  const { data: utmParametersData, isLoading, isError } = useOne(query)

  return (
        <BaseTable
          checkboxSelection={false}
          total={utmParametersData?.data?.utm_parameters_section?.length || 0}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns()}
          data={utmParametersData?.data?.utm_parameters_section || []}
          columnPinning={false}
        />
  )
}

export default ViewParticipantUtmParameters


const columns = () => {

  const {t} = useTranslation('course.participants')

  const columns: ColumnDef<ParticipantUtmParametersDataBaseType>[] = [
    {
      accessorKey: 'program_type_id',
      header: () => {
        return <TableHeader>{t("view_participant: id")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.program_type_id}</Text>
      }
    },
    {
      accessorKey: 'source',
      header: () => {
        return <TableHeader>{t("view_participant: source")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text>{row?.original?.source}</Text>
      }
    },
    {
      accessorKey: 'medium',
      header: () => {
        return <TableHeader>{t("view_participant: medium")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.medium}</Text>
      }
    },
    {
      accessorKey: 'campaign',
      header: () => {
        return <TableHeader>{t("view_participant: campaign")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.campaign}</Text>
      }
    },
    {
      accessorKey: 'term',
      header: () => {
        return <TableHeader>{t("view_participant: term")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.term}</Text>
      }
    },
    {
      accessorKey: 'content',
      header: () => {
        return <TableHeader>{t("view_participant: content")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.content}</Text>
      }
    },
    {
      accessorKey: 'http_refer',
      header: () => {
        return <TableHeader>{t("view_participant: http_refer")}</TableHeader>
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.http_refer}</Text>
      }
    }
  ]
  return columns
}
