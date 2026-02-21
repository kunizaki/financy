import {useEffect, useState} from "react"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog.tsx"
import {Button} from "@/components/ui/button.tsx"
import {useMutation} from "@apollo/client/react"
import {UPDATE_CATEGORY} from "@/lib/graphql/mutations/Categories.ts"
import {toast} from "sonner"

import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field.tsx";
import {InputGroup, InputGroupInput} from "@/components/ui/input-group.tsx"
import {DynamicIcon, type IconName} from "lucide-react/dynamic"
import {Category} from "@/types";

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
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categoryValidationSchema),
        defaultValues: {
            title: "",
            description: "",
        }
    })

    const [iconSelected, setIconSelected] = useState<string>(iconsAvailable[0])
    const [colorSelected, setColorSelected] = useState<string>(colorsAvailable[0])

    const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria atualizada com sucesso")
            onOpenChange(false)
            onUpdated?.()
        },
        onError() {
            toast.error("Falha ao atualizar a categoria")
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            <DialogContent className="bg-white dark:bg-zinc-900">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold leading-tight">
                        Atualização de categoria
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Atualize as informaçÕes da categorias
                    </DialogDescription>
                </DialogHeader>
                {category && (
                    <form onSubmit={handleSubmit(updateCategorySubmit)} className="">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="flex flex-col gap-5">
                                    <Field className="gap-1">
                                        <FieldLabel htmlFor="title" className="text-sm text-gray-700">
                                            Título
                                        </FieldLabel>
                                        <InputGroup className="px-3 rounded-[8px] border-gray-300">
                                            <InputGroupInput
                                                id="title"
                                                type="title"
                                                placeholder="Ex. Alimentação"
                                                {...register('title', { required: true })}
                                                className="px-3 py-3.5 text-gray-500"
                                                disabled={loading}
                                            />
                                        </InputGroup>
                                        <FieldError>
                                            {errors?.title && <span>{errors.title.message}</span> }
                                        </FieldError>
                                    </Field>
                                    <Field className="gap-1">
                                        <FieldLabel htmlFor="description" className="text-sm text-gray-700">
                                            Descrição
                                        </FieldLabel>
                                        <InputGroup className="px-3 rounded-[8px] border-gray-300">
                                            <InputGroupInput
                                                id="description"
                                                type="description"
                                                placeholder="Descrição da categoria"
                                                {...register('description')}
                                                className="px-3 py-3.5 text-gray-500"
                                                disabled={loading}
                                            />
                                        </InputGroup>
                                        <FieldDescription>
                                            <span className="text-gray-500">Opcional</span>
                                        </FieldDescription>
                                    </Field>
                                    <Field className="gap-1">
                                        <FieldLabel htmlFor="icon" className="text-sm text-gray-700">
                                            Ícone
                                        </FieldLabel>
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
                                    </Field>
                                    <Field className="gap-1">
                                        <FieldLabel htmlFor="color" className="text-sm text-gray-700">
                                            Cor
                                        </FieldLabel>
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
                                    </Field>
                                    <Field className="gap-2">
                                        <Button type="submit" className="flex flex-row h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a] gap-2" disabled={loading}>
                                            Atualizar
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>

                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}