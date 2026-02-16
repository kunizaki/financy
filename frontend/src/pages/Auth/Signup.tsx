import { useState } from "react"
import logo from "@/assets/logo.svg"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet} from "@/components/ui/field";
import {Eye, EyeOff, LucideLock, LucideLogIn, LucideMail, User2} from "lucide-react"
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";

export function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const loginMutate = await login({
                email,
                password,
            })
            if (loginMutate) {
                toast.success("Login realizado com sucesso!")
            }
        } catch (error) {
            console.log(error)
            toast.success("Falha ao realizar o login!")
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="flex flex-col gap-4">
                                    <Field className="gap-2">
                                        <FieldLabel htmlFor="name" className="text-sm text-gray-700">
                                            Nome completo
                                        </FieldLabel>
                                        <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                            <InputGroupAddon>
                                                <User2 className="text-gray-500" />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                id="name"
                                                type="name"
                                                placeholder="Seu nome completo"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="px-3 py-3.5 text-gray-500"
                                            />
                                        </InputGroup>
                                    </Field>
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="px-3 py-3.5 text-gray-500"
                                            />
                                        </InputGroup>
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
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                        <FieldDescription className="text-gray-500 text-xs">A senha deve ter no mínimo 8 caracteres</FieldDescription>
                                    </Field>
                                    <Button type="submit" className="w-full h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a]" disabled={loading}>
                                        Cadastrar
                                    </Button>
                                </FieldGroup>
                            </FieldSet>
                            <div className="flex flex-row justify-between">
                                <div className="flex-1 border-b border-gray-500 mb-2.5" />
                                <p className="mx-2 text-gray-500 text-md">ou</p>
                                <div className="flex-1 border-b border-gray-500 mb-2.5" />
                            </div>
                            <FieldSeparator className="text-gray-600">Já tem conta?</FieldSeparator>
                            <Button variant="outline" className="flex flex-row w-full h-12 py-3 px-4 rounded-[8px]">
                                <LucideLogIn className="w-5 h-5" />
                                <Link to="/" className="text-sm">Fazer login</Link>
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}