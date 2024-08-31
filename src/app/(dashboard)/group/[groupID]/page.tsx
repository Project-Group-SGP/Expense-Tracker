export default async function GroupPage({
  params,
}: {
  params: { groupID: string }
}) {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <div className="z-10 mb-4 flex flex-col items-start justify-between gap-4 bg-white py-4 dark:bg-zinc-950 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            GroupID: {params.groupID}
          </h1>
        </div>
      </div>
    </div>
  )
}
