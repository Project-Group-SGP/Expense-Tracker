import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import dynamic from "next/dynamic"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { EmojiClickData } from "emoji-picker-react"

// Define the validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().optional(),
})

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

type FormData = z.infer<typeof formSchema>

interface NewCategoryDialogProps {
  onAddCategory: (category: string) => void
}

const NewCategoryDialog: React.FC<NewCategoryDialogProps> = ({
  onAddCategory,
}) => {
  const [open, setOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emoji: "",
    },
  })

  // handle submit
  const handleSubmit = (data: FormData) => {
    try {
      onAddCategory(`${data.emoji} ${data.name}`.trim())
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Failed to add category:", error)
    }
  }

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    form.setValue("emoji", emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Create a new <span className="text-green-500">Category</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            {/* Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* emoji picker */}

            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Emoji</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        {field.value || "Select Emoji"}
                      </Button>
                      {field.value && (
                        <span className="text-2xl">{field.value}</span>
                      )}
                    </div>
                  </FormControl>
                  {showEmojiPicker && (
                    <EmojiPicker className="dark:bg-black dark:text-white " onEmojiClick={onEmojiClick} />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 sm:mt-8">
              <Button type="submit" className="w-full sm:w-auto">
                Add Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewCategoryDialog
