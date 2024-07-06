"use client"
import { Button } from "@/components/ui/button"
import { columns, Transaction } from "./columns"
import { DataTable } from "./data-table"
import React, { useState } from "react"
import AddPdfModal from "./_components/AddPdfModal"
import { useMutation } from "@tanstack/react-query"

type TransactionPDF = {
  bank: String
  file: File
  password?: string
}
export default function Page() {
  const [data, setData] = useState<Transaction[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleImportPDF = () => {
    setIsOpen(true)
  }

  //   const handleExtractTable = (values: TransactionPDF) => {
  //     const { data, mutate } = useMutation({
  //       mutationKey: ["Extract-table"],
  //       mutationFn: async () => {
  //         const formdata = new FormData()
  //         formdata.append("file", values.file, values.file.name)
  //         formdata.append("bank", values.bank)

  //         const requestOptions = {
  //           method: "POST",
  //           body: formdata,
  //         }
  //         const data = await fetch(
  //           "http://localhost:5000/extract-tables",
  //           requestOptions
  //         )
  //       },
  //     })
  //   }

  return (
    <>
      <AddPdfModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="container mx-auto py-10">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button
            onClick={handleImportPDF}
            className="rounded-md bg-primary px-4 py-2 text-white"
          >
            Import Transaction PDF
          </Button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
