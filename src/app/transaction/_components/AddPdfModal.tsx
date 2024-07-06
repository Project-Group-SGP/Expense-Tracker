import React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

export default function AddPdfModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const formSchema = z.object({
    bank: z.string().min(1, "Please select a bank"),
    file: z.any().refine((file) => file, "File is required"),
    password: z.string().min(1, "Password is required"),
  })

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank: "",
      file: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data)
      // Reset form or close modal after successful submission
      setIsOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  const bankOptions = [
    {
      value: "SBI",
      label: "SBI",
    },
    {
      value: "ICICI",
      label: "ICICI",
    },
  ]

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/SpendWise-2.png"
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
        <DialogDescription className="py-2 text-base">
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={formMethods.control}
                name="bank"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <>
                        <FormLabel>Select Bank</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-3"
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
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="file"
                render={({ field }) => (
                  <div className="space-y-1">
                    <FormLabel>PDF file</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        {...field}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={formMethods.control}
                name="password"
                render={({ field }) => (
                  <div className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="rounded-md bg-green-500 px-4 py-2 text-white"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md bg-gray-400 px-4 py-2 text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
