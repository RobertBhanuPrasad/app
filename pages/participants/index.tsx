import Filters from 'src/participants/Filters'
import { Button } from 'src/ui/button'
import { Sheet, SheetContent, SheetTrigger } from 'src/ui/sheet'

const home = () => {
  return (
    <Sheet>
      <SheetTrigger className="p-0">
        <Button>All Programs Filter Section</Button>
      </SheetTrigger>
      <SheetContent className="w-[446px] rounded-l-xl">
        <Filters />
      </SheetContent>
    </Sheet>
  )
}

export default home
