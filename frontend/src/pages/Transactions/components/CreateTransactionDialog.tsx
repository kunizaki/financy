import {z} from "zod"
import {Controller, SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'

import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog.tsx"
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import {Button} from "@/components/ui/button.tsx"
import {useMutation, useQuery} from "@apollo/client/react"
import {CREATE_TRANSACTION} from "@/lib/graphql/mutations/Transactions.ts"
import {LIST_CATEGORIES} from "@/lib/graphql/queries/Categories.ts"
import {toast} from "sonner"

import {ArrowDownCircle, ArrowUpCircle, X} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx"
import {Category, TransactionType} from "@/types"

interface CreateTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

const transactionValidationSchema = z.object({
    description: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres"),
    transactionType: z.nativeEnum(TransactionType),
    value: z.number().min(0, "O valor deve ser maior ou igual a 0"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
    categoryId: z.string().min(1, "A categoria é obrigatória"),
})

type TransactionFormData = z.infer<typeof transactionValidationSchema>

export function CreateTransactionDialog({
                                            open,
                                            onOpenChange,
                                            onCreated,
                                        }: CreateTransactionDialogProps) {

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionValidationSchema),
        defaultValues: {
            description: "",
            transactionType: TransactionType.DEBIT,
            value: 0,
            date: new Date().toISOString().split('T')[0],
            categoryId: "",
        }
    })

    const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES);
    const categories = categoriesData?.listCategories || [];

    const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação criada com sucesso")
            reset()
            onOpenChange(false)
            onCreated?.()
        },
        onError(error) {
            toast.error(error.message || "Falha ao criar a transação")
        },
    })

    const createTransactionSubmit: SubmitHandler<TransactionFormData> = (formData) => {
        return createTransaction({
            variables: {
                data: formData,
            },
        })
    }

    const handleCancel = () => {
        reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-2xl font-bold">
                        Nova transação
                    </DialogTitle>
                    <X className="w-6 h-6 cursor-pointer" onClick={handleCancel} />
                </DialogHeader>

                <form onSubmit={handleSubmit(createTransactionSubmit)} className="space-y-4 mt-4">
                    <div className="flex flex-col gap-2">
                        <Label>Tipo de transação</Label>
                        <Controller
                            name="transactionType"
                            control={control}
                            render={({ field }) => (
                                <ToggleGroup
                                    type="single"
                                    className="justify-start gap-4"
                                    value={field.value}
                                    onValueChange={(val) => val && field.onChange(val)}
                                >
                                    <ToggleGroupItem
                                        value={TransactionType.CREDIT}
                                        className="flex-1 gap-2 data-[state=on]:bg-green-100 data-[state=on]:text-green-800 data-[state=on]:border-green-800"
                                        variant="outline"
                                    >
                                        <ArrowUpCircle className="w-4 h-4" />
                                        Entrada
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value={TransactionType.DEBIT}
                                        className="flex-1 gap-2 data-[state=on]:bg-red-100 data-[state=on]:text-red-800 data-[state=on]:border-red-800"
                                        variant="outline"
                                    >
                                        <ArrowDownCircle className="w-4 h-4" />
                                        Saída
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            )}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            placeholder="Ex: Aluguel, Salário..."
                            {...register('description')}
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="value">Valor</Label>
                        <Input
                            id="value"
                            type="number"
                            step="0.01"
                            placeholder="R$ 0,00"
                            {...register('value', { valueAsNumber: true })}
                            className={errors.value ? "border-red-500" : ""}
                        />
                        {errors.value && <span className="text-xs text-red-500">{errors.value.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="date">Data</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register('date')}
                            className={errors.date ? "border-red-500" : ""}
                        />
                        {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <Label>Categoria</Label>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId.message}</span>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#1F6F43] hover:bg-[#1a5f3a] text-white"
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}