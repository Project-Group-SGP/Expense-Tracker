import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Navbar from "@/components/Navbar"
import { db } from "@/db/db"
import Loading from "./loading"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />

      <MaxWidthWrapper>
        <div className="m-8 flex flex-col-reverse items-center justify-center gap-8 md:flex-row md:gap-16">
          <div className="mt-4 p-4 text-center md:text-left">
            <p className="text-xl font-bold mb-5 md:text-2xl">
              Track your spending, unleash your saving!
              <br />
              Transform expenses into financial freedom!
            </p>
            <Link
              href="/signup"
              className="hover:bg-primary-dark  rounded-lg bg-primary px-6 py-2 text-white transition-colors"
            >
              Start Your Journey
            </Link>
          </div>
          <div className="mt-16 pl-0 md:pl-10">
            <Image
              src="/main_page.png"
              width="600"
              height="600"
              alt="nothing"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </main>
  )
}
