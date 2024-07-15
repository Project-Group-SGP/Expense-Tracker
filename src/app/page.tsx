import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Navbar from "@/components/Navbar"
import { db } from "@/db/db"
import Loading from "./loading"
import Image from "next/image"

export default async function Home() {
  return (
     <main className="flex flex-col">
      <Navbar />
    
        <MaxWidthWrapper>
          <div className="flex flex-col-reverse md:flex-row justify-center items-center m-8 gap-8 md:gap-16">
            <div className="p-4 mt-4 text-center md:text-left">
              <p className="text-xl  md:text-2xl font-bold">
                Track your spending, unleash your saving!
                <br />
                Transform expenses into financial freedom!
              </p>
            </div>
            <div className="pl-0 mt-16 md:pl-10">
              <Image src="/main_page.png" width="600" height="600" alt="nothing" />
            </div>
          </div>
        </MaxWidthWrapper>
      </main>
 
  )
}
