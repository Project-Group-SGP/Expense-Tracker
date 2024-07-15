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
import DeleteTransactionModal from "./_components/DeleteTransactionModal"

export type TransactionPDF = {
  bank: string
  file: File
  password?: string
}

export type Transaction = {
  Date: string
  Category: string
  Amount: number
  Description: string
}

export default function Page() {
  const [data, setData] = useState<Transaction[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [indexToBeDeleted, setIndexToBeDeleted] = useState<number | null>()

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
        formData.append("password", values.password || "")

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
          throw new Error("Failed to extract transactions: No data received")
        }

        const dataWithCategory = response.data.table.map(
          (transaction: Transaction) => ({
            ...transaction,
            Category: "Other",
            Description: "",
          })
        )
        toast.success("Transactions extracted successfully")
        setData(dataWithCategory)
      } catch (error) {
        throw error
      }
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 400) {
            toast.error(`Bad Request: ${error.response.data.error}`)
          } else if (error.response.status === 500) {
            toast.error(`Server Error: ${error.response.data.error}`)
          } else {
            toast.error(`Error: ${error.response.data.error}`)
          }
        } else if (error.request) {
          // The request was made but no response was received
          toast.error(
            "No response received from server. Please ensure that the pdf and password are correct."
          )
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error(`Error: ${error.message}`)
        }
      } else {
        // Non-Axios error
        toast.error(`An unexpected error occurred: ${error.message}`)
      }
    },
  })

  const deleteTransactionIndex = (index: number) => {
    setIndexToBeDeleted(index)
    setIsDeleteModalOpen(true)
  }

  const changeCategory = (index: number, newCategory: string) => {
    setData((prevData) => {
      const newData = [...prevData]
      newData[index].Category = newCategory
      return newData
    })
  }

  const changeDescription = (index: number, newDescription: string) => {
    console.log(newDescription, index)
    setData((prevData) => {
      const newData = [...prevData]
      newData[index].Description = newDescription
      return newData
    })
    toast.success("Transaction updated successfully")
  }

  const deleteTransaction = () => {
    if (typeof indexToBeDeleted !== "number") return

    const index = indexToBeDeleted
    setData((prevData) => prevData.filter((_, i) => i !== index))
    setIsDeleteModalOpen(false)
    toast.success("Transaction deleted successfully")
  }

  return (
    <>
      <AddPdfModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleExtractTable={mutateAsync}
      />
      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        handleCloseModal={setIsDeleteModalOpen}
        handleDeleteTransaction={deleteTransaction}
      />
      <MaxWidthWrapper className="mt-8">
        <div className="container mx-auto py-10">
          <div className=" z-50 mb-4 flex items-center justify-between py-4 dark:bg-zinc-950 bg-white">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <div>
              {data.length > 0 ? (
                <Button className="w-38 rounded-md bg-primary px-4 py-2 text-white">
                  Save Transactions
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleImportPDF}
                    className="hidden w-36 rounded-md bg-primary px-4 py-2 text-white md:block md:w-full lg:block"
                  >
                    Import Transaction PDF
                  </Button>
                  <Button
                    onClick={handleImportPDF}
                    className="w-[120px] rounded-md bg-primary px-4 py-2 text-white md:hidden md:w-full lg:hidden"
                  >
                    Import PDF
                  </Button>
                </>
              )}
            </div>
          </div>

          <DataTable
            data={data}
            changeCategory={changeCategory}
            deleteTransaction={deleteTransactionIndex}
            changeDescription={changeDescription}
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
                  className="mt-2 h-10 w-full bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </>
  )
}
