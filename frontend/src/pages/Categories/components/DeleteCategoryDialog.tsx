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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Exclusão de Categoria</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Tem certeza que deseja remover
                    <span className="font-medium"> {category?.description}</span>? Essa ação não
                    poderá ser desfeita.
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteCategory}
                        disabled={loading}
                    >
                        Remover
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}