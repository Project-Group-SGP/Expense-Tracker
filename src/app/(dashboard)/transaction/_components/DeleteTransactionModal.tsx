import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import React from "react"

function DeleteTransactionModal({
  isOpen,
  handleCloseModal,
  handleDeleteTransaction,
}: {
  isOpen: boolean
  handleCloseModal: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteTransaction: () => void
}) {
  const closeModal = () => {
    handleCloseModal(false)
  }
  return (
    <Dialog onOpenChange={closeModal} open={isOpen}>
      <DialogContent className="w-80 z-[6000]">
        <DialogHeader>
          <div className="relative flex w-full flex-col items-center justify-center p-4">
            <div>
              <div className="flex-auto justify-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto flex h-12 w-12 items-center text-gray-800 dark:text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>

                <DialogTitle className="pt-4 text-xl font-bold dark:text-gray-200">
                  Are you sure?
                </DialogTitle>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="px-2 text-center text-sm text-gray-500">
          Do you really want to delete this transaction? <br />
          This action cannot be undone.
        </div>
        <div className="mt-4 flex justify-center space-x-4 p-2">
          <button
            onClick={closeModal}
            className="rounded-full border-2 border-gray-600 bg-gray-700 px-5 py-2 text-sm font-medium tracking-wider text-gray-300 shadow-sm transition duration-300 ease-in hover:border-gray-700 hover:bg-gray-800 hover:shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTransaction}
            className="ml-4 rounded-full border-2 border-red-300 bg-red-400 px-5 py-2 text-sm font-medium tracking-wider text-white shadow-sm transition duration-300 ease-in hover:border-red-500 hover:bg-red-500 hover:shadow-lg"
          >
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTransactionModal
