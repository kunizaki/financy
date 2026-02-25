import {useMutation} from "@apollo/client/react"
import {toast} from "sonner"
import {getErrorMessage} from "@/lib/utils.ts"
import {Button} from "@/components/ui/button.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx"
import {Transaction} from "@/types";
import {DELETE_TRANSACTION} from "@/lib/graphql/mutations/Transactions.ts";
import {LIST_TRANSACTIONS} from "@/lib/graphql/queries/Transactions.ts";

interface DeleteTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
    onDeleted?: () => void
}

export function DeleteTransactionDialog({
                                       open,
                                       onOpenChange,
                                       transaction,
                                         onDeleted,
                                   }: DeleteTransactionDialogProps) {
    const [deleteTransactionMutation, { loading }] = useMutation(DELETE_TRANSACTION, {
        onCompleted: () => {
            toast.success("Transação removida com sucesso")
            onOpenChange(false)
            onDeleted?.()
        },
        onError: (error) => {
            toast.error(getErrorMessage(error))
        },
        refetchQueries: [LIST_TRANSACTIONS],
    })

    const handleDeleteTransaction = async () => {
        if (!transaction) return
        await deleteTransactionMutation({
            variables: {
                id: transaction.id,
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-md bg-white sm:rounded-xl border border-gray-200"
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold h-5">Exclusão de Transação</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 text-center">
                    <p className="text-sm text-muted-foreground">
                        Tem certeza que deseja remover a transação abaixo?
                    </p>
                    <p className="text-md font-bold">
                        {transaction?.description}
                    </p>
                </div>
                <DialogFooter className="flex flex-1 justify-between w-full">
                    <Button
                        variant="default"
                        onClick={() => onOpenChange(false)}
                        className="bg-gray-400 hover:bg-gray-300 text-white w-full rounded"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteTransaction}
                        disabled={loading}
                        className="bg-red-800 hover:bg-red-700 text-white w-full rounded"
                    >
                        Remover
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}