import {useEffect, useState} from "react"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog.tsx"
import {Button} from "@/components/ui/button.tsx"
import {useMutation} from "@apollo/client/react"
import {UPDATE_CATEGORY} from "@/lib/graphql/mutations/Categories.ts"
import {toast} from "sonner"
import {getErrorMessage} from "@/lib/utils.ts"
import {DynamicIcon, type IconName} from "lucide-react/dynamic"
import {Category} from "@/types";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

interface EditCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: Category
    onUpdated?: () => void
}

const iconsAvailable: IconName[] = [
  "briefcase-business",
  "car-front",
  "heart-pulse",
  "piggy-bank",
  "shopping-cart",
  "ticket",
  "tool-case",
  "utensils",
  "paw-print",
  "house",
  "gift",
  "dumbbell",
  "book-open",
  "baggage-claim",
  "mailbox",
  "receipt-text",
]

const colorsAvailable = [
    '#16A34A',
    '#2563EB',
    '#9333EA',
    '#DB2777',
    '#DC2626',
    '#EA580C',
    '#CA8A04'
]

const categoryValidationSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categoryValidationSchema>

export function EditCategoryDialog({ open, onOpenChange, category, onUpdated }: EditCategoryDialogProps) {

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categoryValidationSchema),
        defaultValues: {
            title: "",
            description: "",
        }
    })

    const title = watch("title")
    const description = watch("description")

    const [iconSelected, setIconSelected] = useState<string>(iconsAvailable[0])
    const [colorSelected, setColorSelected] = useState<string>(colorsAvailable[0])

    const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria atualizada com sucesso")
            onOpenChange(false)
            reset()
            onUpdated?.()
        },
        onError(error: unknown) {
            toast.error(getErrorMessage(error))
        },
    })

    const updateCategorySubmit = async (formData: CategoryFormData) => {
        if (!category?.id) return;
        await updateCategory({
            variables: {
                id: category.id,
                data: {
                    title: formData.title,
                    description: formData?.description,
                    icon: iconSelected,
                    color: colorSelected
                },
            },
        })
    }

    useEffect(() => {
        if (category) {
            setValue('title', category.title)
            setValue('description', category.description)
            setIconSelected(category.icon)
            setColorSelected(category.color)
        }
    }, [category]);

    useEffect(() => {
        reset()
    }, [open])
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="bg-white sm:rounded-xl border border-gray-200"
            >
                <DialogHeader className="flex flex-col">
                    <DialogTitle className="text-xl font-bold h-5">
                        Atualização de categoria
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Atualize as informações da categorias
                    </DialogDescription>
                </DialogHeader>
                {category && (
                    <form onSubmit={handleSubmit(updateCategorySubmit)} className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                placeholder="Ex. Alimentação"
                                {...register('title')}
                                className={[
                                    errors.title ? "border-red-500" : "border-gray-300",
                                    title && title.length > 0 ? "text-black" : "text-gray-400",
                                    "rounded"
                                ].join(" ")}
                            />
                            {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                placeholder="Descrição da categoria"
                                {...register('description')}
                                className={[
                                    errors.description ? "border-red-500" : "border-gray-300",
                                    description && description.length > 0 ? "text-black" : "text-gray-400",
                                    "rounded"
                                ].join(" ")}
                            />
                            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="icon">Ícone</Label>
                            <div className="flex flex-row justify-between flex-wrap gap-2">
                                {iconsAvailable.map((icon) => (
                                    <div
                                        key={icon}
                                        className="flex justify-center items-center w-12 h-12 rounded-[8px] border-2 cursor-pointer"
                                        style={{ borderColor: icon === iconSelected ? 'black' : '#f3f4f6' }}
                                        onClick={() => setIconSelected(icon)}
                                    >
                                        <DynamicIcon name={icon} key={icon} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="color">Cor</Label>
                            <div className="flex flex-row justify-between flex-wrap gap-2">
                                {colorsAvailable.map((color) => (
                                    <div
                                        key={color}
                                        className="w-12 h-7 rounded-[8px] border-2 p-[2px] cursor-pointer"
                                        style={{ borderColor: color === colorSelected ? 'black' : '#f3f4f6' }}
                                        onClick={() => setColorSelected(color)}
                                    >
                                        <div className="rounded-[5px] h-full" style={{ backgroundColor: color }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="bg-[#1F6F43] hover:bg-[#1a5f3a] text-white w-full rounded"
                                disabled={loading}
                            >
                                {loading ? "Atualizando..." : "Atualizar"}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}