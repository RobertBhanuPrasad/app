import { Button } from "src/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "src/ui/card";
import {useRouter} from "next/router";

const CustomCard = (props: { title: string; description: string; content: React.ReactNode; }) => {
  return (
    <div className="flex flex-col justify-center items-center ">
      <Card className=" border-black rounded-5 p-3 text-center m-3 w-4/6">
          <CardHeader>
              <CardTitle >{props.title}</CardTitle>
              <CardDescription className="text-base text-foreground">{props.description}</CardDescription>
          </CardHeader>
          <CardContent>
              <p>{props.content}</p>
          </CardContent>
      </Card></div>
  )
}

const Home = () => {
  const router = useRouter();
  
  return (
      <>
          <div className="text-center">
              <h1 className="mt-8 mb-3 text-4xl font-extrabold">CAPS ADMIN</h1>
          </div>

          <CustomCard title="Test Payment" description="Test a Payment as a user providing user-data and module information manually" content={<Button variant={"default"} onClick={()=>router.push('/caps/test-payment')}> Click Here</Button>} />

          <CustomCard title="Add a Payment Gateway" description="Configure a new payment gateway and related information" content={<Button variant={"default"} onClick={()=>router.push('/caps/add-payment')}> Click Here</Button>} />

          <CustomCard title="Payment Gateways Dashboard" description="Configure the exisiting payment gateways (edit/enable/disable/delete)" content={<Button variant={"default"} onClick={()=>router.push('/caps/payment-dashboard')}> Click Here</Button>} />

          <CustomCard title="Add Entity" description="Register your module/country/organization with CAPS (or edit the configuration if it's already registered)" content={<Button variant={"default"} onClick={()=>router.push('/caps/add-entity')}> Click Here</Button>} />

          <CustomCard title="Entity Dashboard" description="Configure the exisiting entities (edit/delete)" content={<Button variant={"default"} onClick={()=>router.push('/caps/entity-dashboard')}> Click Here</Button>} />
      </>
  )
}

// Home.noLayout = true;
Home.requireAuth = true;

export default Home;