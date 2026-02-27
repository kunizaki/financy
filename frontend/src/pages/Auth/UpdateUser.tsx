import {useEffect, useState} from "react"

import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import {getInitials} from "@/lib/utils.ts";

import {Eye, EyeOff, LucideLock, LucideLogOut, LucideMail, User2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Label} from "@/components/ui/label.tsx";
import {useAuthStore} from "@/stores/auth.ts";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {toast} from "sonner";

const handleUserName = (nameInput: string) => {
    const nameLowerCase = nameInput.toLowerCase()
    const nameFormated = nameLowerCase
        .split(' ')
        .map((word) => {
            if (/^[a-zA-ZÀ-ÿ]/.test(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
            return word
        })
        .join(' ')
    const prepositionsTarget = ['Da', 'De', 'Do', 'Das', 'Dos']
    return nameFormated
        .split(' ')
        .map((word: string) => {
            if (prepositionsTarget.includes(word)) {
                return word.toLowerCase()
            }
            return word
        })
        .join(' ')
}

const updateValidationSchema = z.object({
    name: z.string().min(10, { message: 'Nome precisa possuir pelo menos 10 caracteres' }),
    email: z.email({ message: 'Email inválido' }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não são iguais',
})
    .transform((data) => ({
        ...data,
        name: handleUserName(data.name.trim()),
        email: data.email.toLowerCase().trim(),
    }))

type UpdateFormData = z.infer<typeof updateValidationSchema>

export function UpdateUser() {
    const { user, logout, updateUser } = useAuthStore()

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateFormData>({
        resolver: zodResolver(updateValidationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateSubmit = async (formData: UpdateFormData) => {
        try {
            setLoading(true)
            const updateUserMutate = await updateUser({
                name: formData.name,
                email: formData.email,
                password: formData?.password || undefined,
            })
            if (updateUserMutate) {
                toast.success('Cadastro atualizado com sucesso!')
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao atualizar cadastro')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            setValue('name', user.name)
            setValue('email', user.email)
        }
    }, [user])

    return (
        <div className="flex flex-col justify-center items-center pt-20 gap-6">
            {user && (
                <Card className="w-full max-w-md rounded-xl bg-white shadow-xl gap-8 p-2 border border-gray-200">
                    <CardHeader className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarFallback className="bg-gray-300 text-primary-foreground text-3xl font-bold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">
                            {user.name}
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            {user.email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(updateSubmit)} className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Nome completo</Label>
                                <InputGroup className="py-3.5 rounded-[8px] border-gray-300">
                                    <InputGroupAddon>
                                        <User2 className="text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="name"
                                        type="name"
                                        placeholder="Seu nome completo"
                                        {...register('name', { required: true })}
                                        className="px-3 py-3.5 text-gray-800"
                                    />
                                </InputGroup>
                                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">E-mail</Label>
                                <InputGroup className="py-3.5 rounded-[8px] border-gray-300 ">
                                    <InputGroupAddon>
                                        <LucideMail className="text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="email"
                                        type="email"
                                        placeholder="mail@example.com"
                                        {...register('email', { required: true })}
                                        className="px-3 py-3.5 text-gray-800"
                                    />
                                </InputGroup>
                                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Senha</Label>
                                <InputGroup className="py-3.5 rounded-[8px] border-gray-300 ">
                                    <InputGroupAddon>
                                        <LucideLock className="text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="password"
                                        type={ visiblePassword ? "text" : "password" }
                                        placeholder="Digite sua senha"
                                        {...register('password')}
                                        className="px-3 py-3.5 text-gray-800"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        {visiblePassword ? (
                                            <Eye className="text-gray-500 cursor-pointer" onClick={() => setVisiblePassword(false)} />
                                        ) : (
                                            <EyeOff className="text-gray-500 cursor-pointer" onClick={() => setVisiblePassword(true)} />
                                        )}
                                    </InputGroupAddon>
                                    {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                                </InputGroup>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Confirme a senha</Label>
                                <InputGroup className="py-3.5 rounded-[8px] border-gray-300 ">
                                    <InputGroupAddon>
                                        <LucideLock className="text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="confirmPassword"
                                        type={ visiblePassword ? "text" : "password" }
                                        placeholder="Confirme sua senha"
                                        {...register('confirmPassword')}
                                        className="px-3 py-3.5 text-gray-800"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        {visiblePassword ? (
                                            <Eye className="text-gray-500 cursor-pointer" onClick={() => setVisiblePassword(false)} />
                                        ) : (
                                            <EyeOff className="text-gray-500 cursor-pointer" onClick={() => setVisiblePassword(true)} />
                                        )}
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                            </div>
                            <div className="h-3" />
                            <Button
                                type="submit"
                                className="w-full h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a]"
                                disabled={loading}
                            >
                                Salvar Alterações
                            </Button>
                        </form>
                        <Button
                            variant="outline"
                            className="flex flex-row w-full h-12 py-3 px-4 rounded-[8px] mt-3 border-gray-300"
                            onClick={() => logout()}
                            disabled={loading}
                        >
                            <LucideLogOut className="w-5 h-5 text-red-700" />
                            Sair da conta
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}