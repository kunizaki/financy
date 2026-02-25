import {z} from "zod"
import {Controller, SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation, useQuery} from "@apollo/client/react"
import {ArrowDownCircle, ArrowUpCircle} from "lucide-react"

import {toast} from "sonner"
import {getErrorMessage} from "@/lib/utils.ts"

import {CREATE_TRANSACTION} from "@/lib/graphql/mutations/Transactions.ts"
import {LIST_CATEGORIES} from "@/lib/graphql/queries/Categories.ts"

import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"
import {Button} from "@/components/ui/button.tsx"
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx"
import {InputGroup, InputGroupAddon, InputGroupInput, InputGroupText} from "@/components/ui/input-group.tsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog.tsx"

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
            toast.error(getErrorMessage(error))
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
            <DialogContent
                className="max-w-md bg-white sm:rounded-xl border border-gray-200"
            >
                <DialogHeader className="flex flex-col">
                    <DialogTitle className="text-xl font-bold h-5">
                        Nova transação
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Registre sua despesa ou receita
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(createTransactionSubmit)} className="space-y-4 mt-4">
                    <div className="p-2 border border-gray-300 rounded-xl">
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
                                        value={TransactionType.DEBIT}
                                        className="flex-1 gap-2 data-[state=on]:text-red-800 data-[state=off]:text-gray-400 data-[state=on]:border-red-800 sm:rounded data-[state=on]:border data-[state=off]:border-none shadow-none"
                                        variant="outline"
                                    >
                                        <ArrowDownCircle className="w-4 h-4" />
                                        Despesa
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value={TransactionType.CREDIT}
                                        className="flex-1 gap-2 data-[state=on]:text-[#1F6F43] data-[state=off]:text-gray-400 data-[state=on]:border-[#1F6F43] sm:rounded data-[state=on]:border data-[state=off]:border-none shadow-none"
                                        variant="outline"
                                    >
                                        <ArrowUpCircle className="w-4 h-4" />
                                        Receita
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
                            className={[
                                errors.description ? "border-red-500" : "border-gray-300",
                                "rounded"
                            ].join(" ")}
                        />
                        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                    </div>

                    <div className="flex flex-row space-x-4 w-full">
                        <div className="space-y-1 w-full">
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register('date')}
                                className={[
                                    errors.date ? "border-red-500" : "border-gray-300",
                                    "rounded"
                                ].join(" ")}
                            />
                            {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
                        </div>
                        <div className="space-y-1 w-full">
                            <Label htmlFor="value">Valor</Label>
                            <InputGroup className={[
                                errors.value ? "border-red-500" : "border-gray-300",
                                "rounded"
                            ].join(" ")}
                            >
                                <InputGroupInput
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    {...register('value', { valueAsNumber: true })}
                                />
                                <InputGroupAddon>
                                    <InputGroupText>R$</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {errors.value && <span className="text-xs text-red-500">{errors.value.message}</span>}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Categoria</Label>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={[
                                        errors.categoryId ? "border-red-500" : "border-gray-300",
                                        "rounded"
                                    ].join(" ")}
                                    >
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
                            className="bg-[#1F6F43] hover:bg-[#1a5f3a] text-white w-full rounded"
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