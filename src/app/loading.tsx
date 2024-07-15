import Image from "next/image";

export default function Loading() {
  return (
    <div className="grid h-screen w-screen items-center justify-center">
      <Image src="/SpendWise-2.png" width="600" height="600" alt="nothing" />
    </div>
  )
}
