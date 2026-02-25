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
import {Category} from "@/types";
import {DELETE_CATEGORY} from "@/lib/graphql/mutations/Categories.ts";
import {LIST_CATEGORIES} from "@/lib/graphql/queries/Categories.ts";

interface DeleteCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: Category | null
    onDeleted?: () => void
}

export function DeleteCategoryDialog({
                                       open,
                                       onOpenChange,
                                       category,
                                         onDeleted,
                                   }: DeleteCategoryDialogProps) {
    const [deleteCategoryMutation, { loading }] = useMutation(DELETE_CATEGORY, {
        onCompleted: () => {
            toast.success("Categoria removida com sucesso")
            onOpenChange(false)
            onDeleted?.()
        },
        onError: (error) => {
            toast.error(getErrorMessage(error))
        },
        refetchQueries: [LIST_CATEGORIES],
    })

    const handleDeleteCategory = async () => {
        if (!category) return
        await deleteCategoryMutation({
            variables: {
                id: category.id,
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-md bg-white sm:rounded-xl border border-gray-200"
            >

                <DialogHeader>
                    <DialogTitle className="text-xl font-bold h-5">Exclusão de Categoria</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 text-center">
                    <p className="text-sm text-muted-foreground">
                        Tem certeza que deseja remover a categoria abaixo?
                    </p>
                    <p className="text-md font-bold">
                        {category?.title}
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
                        onClick={handleDeleteCategory}
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