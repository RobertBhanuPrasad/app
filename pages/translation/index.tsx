import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'src/ui/button'
import { Input } from 'src/ui/input'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'src/ui/select'

interface CountryData {
  id: number
  country: string
  Languages: { key: string; value: string }[]
}

interface CourseListProp {
  course: string
  value: string
}
const TranslationPage = () => {
  const [countrySelected, setCountrySelected] = useState<string | undefined>()

  const [editableIndex, setEditableIndex] = useState<number | null>(null)

  const { register, handleSubmit } = useForm({
    mode: 'all'
    // defaultValues:
  })

  // Language array data
  const languageArray: CountryData[] = [
    {
      id: 1,
      country: 'india',
      Languages: [
        { key: 'Telugu', value: 'lan1' },
        { key: 'English', value: 'lan2' },
        { key: 'Hindi', value: 'lan3' }
      ]
    },
    {
      id: 2,
      country: 'pakistan',
      Languages: [
        { key: 'Hindi', value: 'lan1' },
        { key: 'pak', value: 'lan2' }
      ]
    },
    {
      id: 3,
      country: 'america',
      Languages: [
        { key: 'English', value: 'lan1' },
        { key: 'French', value: 'lan2' }
      ]
    }
  ]

  const courseList = [
    {
      id: 1,
      course: 'Happiness',
      value: 'course1'
    },
    { id: 2, course: 'Advance', value: 'course2' },
    { id: 3, course: 'Sahaj', value: 'course3' }
  ]

  const toggleEdit = (index: number) => {
    setEditableIndex(index === editableIndex ? null : index)
  }
  return (
    <div className="flex">
      <div className="flex-1">
        <Select
          onValueChange={(value: string) => {
            setCountrySelected(value)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Country Names</SelectLabel>
              {languageArray.map(cou => {
                return <SelectItem value={cou.country}>{cou.country}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select the language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {countrySelected &&
                languageArray
                  .find(country => country.country === countrySelected)
                  ?.Languages.map(language => (
                    <SelectItem key={language.key} value={language.key}>
                      {language.key}
                    </SelectItem>
                  ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <form
          onSubmit={handleSubmit(data => {
            console.log('form submitted', data)
          })}
        >
          <div>
            <h1 className="underline mt-10">CourseList</h1>
            {courseList.map((item, index) => (
              <div className="flex gap-5 mt-5">
                <p className="w-20">{item.course}</p>
                <Input
                  className="max-w-lg"
                  defaultValue={item.value}
                  {...register(item.course, { required: true, value: item.value, disabled: editableIndex !== index })}
                />
                <IndividualCourseItem
                  item={item}
                  index={index}
                  onClick={toggleEdit}
                  buttonClicked={editableIndex !== index}
                />
              </div>
            ))}
          </div>
          <div>
            <h1 className="underline mt-10">Languages</h1>
            {countrySelected &&
              languageArray
                .find(country => country.country === countrySelected)
                ?.Languages.map(language => (
                  <div className="flex gap-5 mt-5">
                    <p className="w-20">{language.key}</p>
                    <Input className="max-w-lg" {...register(language.key, { required: true })} />
                  </div>
                ))}
          </div>
          <Button className="max-w-lg  mt-10 ml-24" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

export default TranslationPage

const IndividualCourseItem = ({
  item,
  index,
  onClick,
  buttonClicked
}: {
  item: CourseListProp
  index: number
  onClick?: Function
  buttonClicked: boolean
}) => {
  const toggleInputDisabled = () => {
    onClick && onClick(index)
    if (!buttonClicked) {
      console.log('save clicked is', item)
    }
  }
  return (
    <Button onClick={() => toggleInputDisabled()} type="button">
      {buttonClicked ? 'Edit' : 'Save'}
    </Button>
  )
}
