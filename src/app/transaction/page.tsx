"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import AddPdfModal from "./_components/AddPdfModal"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import DataTable from "./data-table"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

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

  const { mutateAsync, isPending } = useMutation({
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
        const dataWithCategory = response.data.table[0].map(
          (transaction: Transaction) => ({
            ...transaction,
            Category: "Other",
          })
        )
        setData(dataWithCategory)
      } catch (error) {
        throw error
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred."
      toast.error(`There was an error extracting data: ${errorMessage}`)
    },
  })

  const changeCategory = (index: number, newCategory: string) => {
    setData((prevData) => {
      const newData = [...prevData]
      newData[index].Category = newCategory
      return newData
    })
  }

  const addTransaction = (transaction: Transaction) => {
    setData((prevData) => [...prevData, transaction])
  }

  const deleteTransaction = (index: number) => {
    setData((prevData) => prevData.filter((_, i) => i !== index))
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
            <div>
              <Button
                onClick={handleImportPDF}
                className="rounded-md bg-primary px-4 py-2 text-white"
              >
                Import Transaction PDF
              </Button>
            </div>
          </div>

          <DataTable
            data={data}
            changeCategory={changeCategory}
            // deleteTransaction={deleteTransaction}
          />
          {data.length === 0 && !isPending && (
            <p className="pt-10 text-center text-lg text-red-500">
              Please upload transactions
            </p>
          )}
          {isPending && (
            <div className="flex flex-col gap-4">
              {[...Array(10)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-10 w-full bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </>
  )
}
