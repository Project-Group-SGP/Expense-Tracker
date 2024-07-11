 
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const page = () => {
  return (
    <section className='flex h-screen items-center justify-center'>
         <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign up page</CardTitle>
   
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Enter Email ID</Label>
              <Input id="name" type="text" placeholder="xyz@gmail.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">First name</Label>
              <Input id="name" type="text" placeholder="spend" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Last Name</Label>
              <Input id="name" type="text" placeholder="wise" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Password</Label>
              <Input id="name" type="password"/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Conform Password</Label>
              <Input id="name" type="password"/>
            </div>
            
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
    </section>
  )
}

export default page
