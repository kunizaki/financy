import { useState } from "react"
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from "@/stores/auth"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import logo from "@/assets/logo.svg"
import { LucideMail, LucideLock, UserPlus2, Eye, EyeOff } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.tsx";

const loginValidationSchema = z.object({
    email: z.email({ message: 'Email inválido' }),
    password: z.string().min(8, { message: 'Senha inválida' }),
    remember: z.boolean(),
})

type LoginFormData = z.infer<typeof loginValidationSchema>

export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginValidationSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    })

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const login = useAuthStore((state) => state.login)

    const loginSubmit = async (formData: LoginFormData) => {
        try {
            setLoading(true)
            const loginMutate = await login({
                email: formData.email,
                password: formData.password,
                remember: formData.remember
            })
            if (loginMutate) {
                toast.success("Login realizado com sucesso!")
            }
        } catch (error) {
            console.error(error)
            toast.error("Falha ao realizar o login!")
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
                        Fazer Login
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Entre na sua conta para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(loginSubmit)} className="space-y-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="flex flex-col gap-4">
                                    <Field className="gap-2">
                                        <FieldLabel htmlFor="email" className="text-sm text-gray-700">
                                            E-mail
                                        </FieldLabel>
                                        <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300 ">
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
                                        <FieldError>
                                            {errors?.email && <span>{errors.email.message}</span>}
                                        </FieldError>
                                    </Field>
                                    <Field className="gap-2">
                                        <FieldLabel htmlFor="password" className="text-sm text-gray-700">
                                            Senha
                                        </FieldLabel>
                                        <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300 ">
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
                                        <FieldError>
                                            {errors?.password && <span>{errors.password.message}</span>}
                                        </FieldError>
                                    </Field>
                                    <Field orientation="horizontal" className="flex flex-row content-between w-full">
                                        <FieldGroup>
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    id="rememberMe"
                                                    {...register('remember')}
                                                    className="w-4 h-4 border-gray-500" aria-label="Lembrar-me"
                                                />
                                                <FieldLabel htmlFor="rememberMe" className="text-gray-500">
                                                    Lembrar-me
                                                </FieldLabel>
                                            </Field>
                                        </FieldGroup>
                                        <Link to="/forgot-password" className="w-auto text-nowrap text-sm text-gray-500">Recuperar senha</Link>
                                    </Field>
                                    <Button type="submit" className="w-full h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a]" disabled={loading}>
                                        Entrar
                                    </Button>
                                </FieldGroup>
                            </FieldSet>
                            <div className="flex flex-row justify-between">
                                <div className="flex-1 border-b border-gray-500 mb-2.5" />
                                <p className="mx-2 text-gray-500 text-md">ou</p>
                                <div className="flex-1 border-b border-gray-500 mb-2.5" />
                            </div>
                            <FieldSeparator className="text-gray-600">Ainda não tem conta?</FieldSeparator>
                            <Button variant="outline" className="flex flex-row w-full h-12 py-3 px-4 rounded-[8px]">
                                <UserPlus2 className="w-5 h-5" />
                                <Link to="/signup" className="text-sm"> Criar conta </Link>
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}