"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import AddPdfModal from "./_components/AddPdfModal"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import DataTable from "./data-table"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"

export type TransactionPDF = {
  bank: string
  file: File
  password?: string
}

export type Transaction = {
  Date: string
  Category: string
  Amount: number
}

export default function Page() {
  const [data, setData] = useState<Transaction[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleImportPDF = () => {
    setIsOpen(true)
  }

  const { mutateAsync } = useMutation({
    mutationKey: ["Extract-table"],
    mutationFn: async (values: TransactionPDF) => {
      try {
        const formData = new FormData()
        formData.append("file", values.file, values.file.name)
        formData.append("bank", values.bank)

        const response = await axios.post(
          "http://localhost:5000/extract-tables",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )

        if (!response || !response.data) {
          throw new Error(
            `Failed to extract tables: ${response.status} ${response.statusText}`
          )
        }
        console.log(response.data)
        const dataWithCategory = response.data.table[0].map(
          (transaction: Transaction) => ({
            ...transaction,
            Category: "Other",
          })
        )
        setData(dataWithCategory)
      } catch (error) {
        console.error("Error extracting tables:", error)
      }
    },
  })

  const changeCategory = (index: number, newCategory: string) => {
    setData((prevData) => {
      const newData = [...prevData]
      newData[index].Category = newCategory
      return newData
    })
  }

  return (
    <>
      <AddPdfModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleExtractTable={mutateAsync}
      />
      <MaxWidthWrapper>
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
          <DataTable data={data} changeCategory={changeCategory} />
        </div>
      </MaxWidthWrapper>
    </>
  )
}
