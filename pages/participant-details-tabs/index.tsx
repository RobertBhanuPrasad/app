import { useSearchParams } from 'next/navigation'
import { Button } from 'src/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'src/ui/tabs'

const TabsComponent = () => {
  return (
    <Tabs defaultValue="account">
      <TabsList className="flex justify-between">
        <TabsTrigger value="Course Information">Course Information</TabsTrigger>
        <TabsTrigger value="Transaction Details">Transaction Details</TabsTrigger>
        <TabsTrigger value="Email Delivery Logs">Email Delivery Logs</TabsTrigger>
        <TabsTrigger value="Customer Device Details">Customer Device Details</TabsTrigger>
        <TabsTrigger value="UTM Parameters">UTM Parameters</TabsTrigger>
      </TabsList>
      <TabsContent value="Course Information">
        <div>
          <p>Course Information</p>
          <div>
            <div>
              <p>Course Type</p>
              <p>Happiness Program</p>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="Transaction Details">
        <p>Transaction Details.</p>
        <Button>click</Button>
      </TabsContent>
      <TabsContent value="Email Delivery Logs">Email Delivery Logs.</TabsContent>
      <TabsContent value="Customer Device Details">Customer Device Details.</TabsContent>
      <TabsContent value="UTM Parameters">UTM Parameters.</TabsContent>
    </Tabs>
  )
}

export default TabsComponent
