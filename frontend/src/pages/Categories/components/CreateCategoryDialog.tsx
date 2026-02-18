
import {z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogContent,
} from "@/components/ui/dialog.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/Categories.ts"
import { toast } from "sonner"

import {X} from "lucide-react"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field.tsx";
import {InputGroup, InputGroupInput} from "@/components/ui/input-group.tsx"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

interface CreateCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
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

const categoryValidationSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    description: z.string().optional(),
    icon: z.string().min(1, "O ícone é obrigatório"),
    color: z.string().min(1, "A cor é obrigatória"),
})

type CategoryFormData = z.infer<typeof categoryValidationSchema>

export function CreateCategoryDialog({
                                     open,
                                     onOpenChange,
                                     onCreated,
                                 }: CreateCategoryDialogProps) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categoryValidationSchema),
        defaultValues: {
            title: "",
            description: "",
            icon: "",
            color: "",
        }
    })

    const colorsAvailable = [
        '#16A34A',
        '#2563EB',
        '#9333EA',
        '#DB2777',
        '#DC2626',
        '#EA580C',
        '#CA8A04'
    ]


    const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria criada com sucesso")
            onOpenChange(false)
            onCreated?.()
        },
        onError() {
            toast.error("Falha ao criar a categoria")
        },
    })

    const createCategorySubmit = (formData: CategoryFormData) => {
        return createCategory({
            variables: {
                data: {
                    title: formData.title,
                    description: formData?.description,
                    icon: formData.icon,
                    color: formData.color
                },
            },
        })
    }

    const handleCancel = () => {
        reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="space-y-2">
                    <div className="flex flex-1 justify-center">
                        <DialogTitle className="text-2xl font-bold leading-tight">
                            Nova categoria
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Organize suas transações com categorias
                        </DialogDescription>
                    </div>
                    <div className="flex justify-end">
                        <X onClick={handleCancel} />
                    </div>
                </DialogHeader>
                <DialogContent>
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup className="flex flex-col gap-4">
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="title" className="text-sm text-gray-700">
                                        Título
                                    </FieldLabel>
                                    <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                        <InputGroupInput
                                            id="title"
                                            type="title"
                                            placeholder="Ex. Alimentação"
                                            {...register('title', { required: true })}
                                            className="px-3 py-3.5 text-gray-500"
                                        />
                                    </InputGroup>
                                    <FieldError>
                                        {errors?.title && <span>{errors.title.message}</span> }
                                    </FieldError>
                                </Field>
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="description" className="text-sm text-gray-700">
                                        Descrição
                                    </FieldLabel>
                                    <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                        <InputGroupInput
                                            id="description"
                                            type="description"
                                            placeholder="Descrição da categoria"
                                            {...register('description')}
                                            className="px-3 py-3.5 text-gray-500"
                                        />
                                    </InputGroup>
                                    <FieldDescription>
                                        <span className="text-gray-500">Opcional</span>
                                    </FieldDescription>
                                </Field>
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="icon" className="text-sm text-gray-700">
                                        Ícone
                                    </FieldLabel>
                                    <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                        <div className="flex flex-row gap-2">
                                            {iconsAvailable.map((icon) => (
                                                <DynamicIcon name={icon} key={icon} />
                                            ))}
                                        </div>
                                    </InputGroup>
                                    <FieldError>
                                        {errors?.icon && <span>{errors.icon.message}</span> }
                                    </FieldError>
                                </Field>
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="color" className="text-sm text-gray-700">
                                        Cor
                                    </FieldLabel>
                                    <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                        <div className="flex flex-row gap-2">
                                            {colorsAvailable.map((color, index) => (
                                                <div key={index} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
                                            ))}
                                        </div>
                                    </InputGroup>
                                    <FieldError>
                                        {errors?.color && <span>{errors.color.message}</span> }
                                    </FieldError>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </DialogContent>
                <form onSubmit={handleSubmit(createCategorySubmit)} className="space-y-5 mt-6">
                    <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-normal">
                            Título
                        </Label>
                        <Input
                            id="title"
                            placeholder="Dê um nome para a sua ideia"
                            {...register('title', { required: true })}
                            className="w-full"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-sm font-normal">
                            Descrição
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva sua ideia"
                            {...register('description')}
                            className="w-full"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            Salvar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}