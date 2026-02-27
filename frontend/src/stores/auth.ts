import {create} from "zustand"
import {persist} from "zustand/middleware"
import {apolloClient} from "@/lib/graphql/apollo"
import {LoginInput, RegisterInput, UpdateUserInput, User} from '@/types'
import {REGISTER} from '@/lib/graphql/mutations/Register'
import {LOGIN} from '@/lib/graphql/mutations/Login'
import {UPDATE_USER} from "@/lib/graphql/mutations/Users.ts";

type RegisterMutationData = {
    register: {
        token: string
        refreshToken: string
        user: User
    }
}

type UpdateUserMutationData = {
    updateUser: User
}

type LoginMutationData = {
    login: {
        token: string
        refreshToken: string
        user: User
    }
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    signup: (data: RegisterInput) => Promise<boolean>
    login: (data: LoginInput) => Promise<boolean>
    logout: () => void
    updateUser: (data: UpdateUserInput) => Promise<boolean>
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (loginData: LoginInput) => {
                try{
                    const {data} = await apolloClient.mutate<LoginMutationData, { data: LoginInput }>({
                        mutation: LOGIN,
                        variables: {
                            data: {
                                email: loginData.email,
                                password: loginData.password,
                            }
                        }
                    })

                    if(data?.login){
                        const { user, token } = data.login
                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt
                            },
                            token,
                            isAuthenticated: true
                        })
                        if (loginData.remember) {
                            localStorage.setItem('token', token)
                            localStorage.setItem('user', JSON.stringify(user))
                        }
                        return true
                    }
                    return false
                }catch(error){
                    console.error("Erro ao fazer o login")
                    throw error
                }
            },
            signup: async (registerData: RegisterInput) => {
                try{
                    const { data } = await apolloClient.mutate<
                        RegisterMutationData,
                        {data: RegisterInput}
                    >({
                        mutation: REGISTER,
                        variables: {
                            data: {
                                name: registerData.name,
                                email: registerData.email,
                                password: registerData.password
                            }
                        }
                    })
                    if(data?.register){
                        const { token, user } = data.register
                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt
                            },
                            token,
                            isAuthenticated: true
                        })
                        return true
                    }
                    return false
                }catch(error){
                    console.error("Erro ao fazer o cadastro")
                    throw error
                }
            },
            updateUser: async (userUpdateInfos: UpdateUserInput) => {
                const userInfos = get().user
                console.log("user: ", userInfos)
                const userId = userInfos?.id
                if (!userId) {
                    throw new Error("Usuário não autenticado")
                }
                try {
                    const { data } = await apolloClient.mutate<
                        UpdateUserMutationData,
                        { id: string; data: UpdateUserInput }
                    >({
                        mutation: UPDATE_USER,
                        variables: {
                            id: userId,
                            data: userUpdateInfos
                        }
                    })
                    if (data?.updateUser) {
                        const user = data.updateUser
                        console.log("userUpdated: ", user)
                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt
                            },
                            token: get().token,
                            isAuthenticated: true
                        })
                        return true
                    }
                    return false
                } catch (error) {
                    console.error("Erro ao atualizar cadastro")
                    throw error
                }
            },
            logout: () => {
                set({
                    user:null,
                    token: null,
                    isAuthenticated: false
                })
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                apolloClient.clearStore()
            },
        }),
        {
            name: 'auth-storage'
        }
    )
)