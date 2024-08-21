import React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { TransactionPDF } from "../page"
import { toast } from "sonner"

export default function AddPdfModal({
  isOpen,
  setIsOpen,
  handleExtractTable,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleExtractTable: (values: TransactionPDF) => void
}) {
  const formSchema = z.object({
    bank: z.string().min(1, "Please select a bank"),
    file: z.any().refine((file) => file instanceof File, "File is required"),
    password: z.string().optional(),
  })

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank: "",
      file: null,
      password: "",
    },
  })

  const onSubmit = async (data: {
    bank: string
    file: File | null
    password: string
  }): Promise<void> => {
    try {
      if (
        (data.bank === "SBI" || data.bank === "Kotak Mahindra") &&
        !data.password
      ) {
        toast.error("Please enter password")
        return
      } else if (data.bank && data.password) {
        if (data.bank && data.password.length !== 9) {
          toast.error("Please enter a valid password")
          return
        }
      }
      formMethods.reset()
      setIsOpen(false)
      handleExtractTable(data as TransactionPDF)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleCloseModal = () => {
    formMethods.reset()
    setIsOpen(false)
  }

  const bankOptions = [
    { value: "SBI", label: "SBI" },
    { value: "ICICI", label: "ICICI" },
    { value: "HDFC", label: "HDFC" },
    { value: "Kotak Mahindra", label: "Kotak Mahindra" },
  ]

  const isPasswordRequired = (bank: string) => {
    return bank === "SBI" || bank === "Kotak Mahindra"
  }

  return (
    <Dialog onOpenChange={handleCloseModal} open={isOpen}>
      <DialogContent className="z-[6000] w-96">
        <DialogHeader>
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/SpendWIse-5.png"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <DialogTitle className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Import Transaction PDF
          </DialogTitle>
        </DialogHeader>
        {/* form */}
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={formMethods.control}
              name="bank"
              render={({ field }) => (
                <FormControl>
                  <>
                    <FormLabel>Select Bank</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      {bankOptions.map((option) => (
                        <FormControl key={option.value}>
                          <div className="flex items-center gap-1">
                            <RadioGroupItem value={option.value} />
                            <FormLabel>{option.label}</FormLabel>
                          </div>
                        </FormControl>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </>
                </FormControl>
              )}
            />

            <FormField
              control={formMethods.control}
              name="file"
              render={({ field }) => (
                <FormControl>
                  <>
                    <br />
                    <FormLabel>PDF file</FormLabel>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file)
                        }
                      }}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <FormMessage />
                  </>
                </FormControl>
              )}
            />
            {isPasswordRequired(formMethods.watch("bank")) && (
              <FormField
                control={formMethods.control}
                name="password"
                render={({ field }) => (
                  <FormControl>
                    <>
                      <br />
                      <FormLabel>PDF Password</FormLabel>
                      <Input
                        type="password"
                        {...field}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <FormMessage />
                    </>
                  </FormControl>
                )}
              />
            )}
            <div className="flex justify-end space-x-2 pt-1">
              <Button
                type="submit"
                variant={"default"}
                className="w-full rounded-md text-white"
              >
                Submit
              </Button>
              <DialogClose asChild>
                <Button
                  onClick={handleCloseModal}
                  variant={"destructive"}
                  className="w-full rounded-md text-white"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
