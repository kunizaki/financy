import {useMutation} from "@apollo/client/react"
import {Button} from "@/components/ui/button.tsx"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog.tsx"
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
            onOpenChange(false)
            onDeleted?.()
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
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Exclusão de Categoria</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Tem certeza que deseja remover
                    <span className="font-bold"> {category?.description}</span>?
                </p>
                <p className="text-sm text-muted-foreground">
                    Essa ação não poderá ser desfeita.
                </p>
                <DialogFooter>
                    <Button variant="default" onClick={() => onOpenChange(false)} className="bg-gray-400 hover:bg-gray-300 text-white">
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteCategory}
                        disabled={loading}
                        className="bg-red-800 hover:bg-red-700 text-white"
                    >
                        Remover
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}