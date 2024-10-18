"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AddPdfModal from "./_components/AddPdfModal"
import DeleteTransactionModal from "./_components/DeleteTransactionModal"
import { SaveTransactions } from "./actions"
import DataTable from "./data-table"

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
  const [isSaving, setIsSaving] = useState<boolean>(false)

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
          `${process.env.NEXT_PUBLIC_PYTHON_API}/extract-tables`,
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

        const dataWithCategory = response.data.transactions.map(
          (transaction: Transaction) => ({
            ...transaction,
            Category: transaction.Amount > 0 ? "Income" : "Other",
            Description: "",
          })
        )
        toast.success("Transactions extracted successfully")
        setData(dataWithCategory)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            toast.error(
              "Network error. Please check your connection and try again."
            )
          } else if (error.response.status === 400) {
            toast.error(
              `Bad Request: Please check your PDF file and password, and try again.`
            )
          } else if (error.response.status === 500) {
            toast.error(
              `Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.`
            )
          } else {
            toast.error(`An unexpected error occurred, please try again.`)
          }
        } else {
          toast.error(`An unexpected error occurred, please try again.`)
        }
      }
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(
              `Bad Request: Please check your PDF file and password, and try again.`
            )
          } else if (error.response.status === 500) {
            toast.error(
              `Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.`
            )
          } else {
            toast.error(`An unexpected error occurred, please try again.`)
          }
        } else if (error.request) {
          toast.error(
            "No response received from server. Please ensure that the PDF and password are correct."
          )
        } else {
          toast.error(`An unexpected error occurred, please try again.`)
        }
      } else {
        toast.error(`An unexpected error occurred, please try again.`)
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

  const handleSaveTransactions = async () => {
    setIsSaving(true)
    const loadingToast = toast.loading("Saving transactions...")

    try {
      const response = await SaveTransactions(data)
      if (response.success) {
        setData([])
        toast.success("Transactions saved successfully", {
          id: loadingToast,
        })
        setIsSaving(false)
      } else {
        throw new Error("Failed to save transactions")
      }
    } catch (error) {
      toast.error("Failed to save transactions", {
        id: loadingToast,
      })
      setIsSaving(false)
    }
  }

  return (
    //@ts-ignore
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
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <div className="z-10 mb-4 flex flex-col items-start justify-between bg-white py-4 dark:bg-zinc-950 sm:flex-row sm:items-center">
            <h1 className="mb-4 text-3xl font-bold sm:mb-0">Transactions</h1>
            <div className="w-full sm:w-auto">
              {data.length > 0 ? (
                <Button
                  className="w-full rounded-md bg-primary px-4 py-2 text-white sm:w-auto"
                  onClick={handleSaveTransactions}
                  disabled={isSaving}
                >
                  Save Transactions
                </Button>
              ) : (
                <Button
                  onClick={handleImportPDF}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm text-white sm:w-auto sm:text-base"
                >
                  Import Transaction PDF
                </Button>
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
      </div>
    </>
  )
}
