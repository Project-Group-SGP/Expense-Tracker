"use client"
export default function Error({ error }: { error: Error }) {
  return <div>{error.message}</div>
}
