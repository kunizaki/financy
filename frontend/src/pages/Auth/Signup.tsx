import {useState} from "react"

import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import {Link} from "react-router-dom"

import {toast} from "sonner"
import {useAuthStore} from "@/stores/auth"
import {getErrorMessage} from "@/lib/utils.ts";

import logo from "@/assets/logo.svg"

import {Eye, EyeOff, LucideLock, LucideLogIn, LucideMail, User2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Label} from "@/components/ui/label.tsx";

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

const registerValidationSchema = z.object({
    name: z.string().min(10, { message: 'Nome precisa possuir pelo menos 10 caracteres' }),
    email: z.email({ message: 'Email inválido' }),
    password: z.string().min(8, { message: 'Senha precisa possuir pelo menos 8 caracteres' }),
    confirmPassword: z.string().min(8, { message: 'Senha precisa possuir pelo menos 8 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não são iguais',
})
    .transform((data) => ({
        ...data,
        name: handleUserName(data.name.trim()),
        email: data.email.toLowerCase().trim(),
    }))

type RegisterFormData = z.infer<typeof registerValidationSchema>

export function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerValidationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const registerUser = useAuthStore((state) => state.signup)

    const registerSubmit = async (formData: RegisterFormData) => {
        try {
            setLoading(true)
            const registerMutate = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            })
            if (registerMutate) {
                toast.success("Registro realizado com sucesso!")
            }
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center gap-6">
            <img src={logo} alt="Logomarca" className="w-36 h-8" />
            <Card className="w-full max-w-md rounded-xl bg-white shadow-xl gap-8 p-2 border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        Criar conta
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Comece a controlar suas finanças ainda hoje
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
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
                                    className="px-3 py-3.5 text-gray-500"
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
                                    className="px-3 py-3.5 text-gray-500"
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
                                    {...register('password', { required: true })}
                                    className="px-3 py-3.5 text-gray-500"
                                />
                                <InputGroupAddon align="inline-end">
                                    {visiblePassword ? (
                                        <Eye className="text-gray-500 cursor-pointer" onClick={() => setVisiblePassword(false)} />
                                    ) : (
                                        <EyeOff className="text-gray-500 cursor-pointer" onClick={() => setVisiblePassword(true)} />
                                    )}
                                </InputGroupAddon>
                            </InputGroup>
                            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
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
                                    {...register('confirmPassword', { required: true })}
                                    required
                                    className="px-3 py-3.5 text-gray-500"
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
                        <Button type="submit" className="w-full h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a]" disabled={loading}>
                            Cadastrar
                        </Button>
                    </form>
                    <div className="flex flex-col gap-3 py-3">
                        <div className="flex flex-row justify-between">
                            <div className="flex-1 border-b border-gray-500 mb-2.5" />
                            <p className="mx-2 text-gray-500 text-md">ou</p>
                            <div className="flex-1 border-b border-gray-500 mb-2.5" />
                        </div>
                        <span className="flex justify-center text-gray-600">Já tem conta?</span>
                        <Button variant="outline" className="flex flex-row w-full h-12 py-3 px-4 rounded-[8px]">
                            <LucideLogIn className="w-5 h-5" />
                            <Link to="/" className="text-sm">Fazer login</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}