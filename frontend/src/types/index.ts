import type {IconName} from "lucide-react/dynamic"

export interface User {
    id: string
    name: string
    email: string
    createdAt?: string
    updatedAt?: string
}


export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface UpdateUserInput {
    name: string
    email: string
    password?: string
}


export interface LoginInput {
    email: string
    password: string
    remember?: boolean
}

export interface Category {
    id: string
    userId: string
    title: string
    description?: string
    icon: IconName
    color: string
    createdAt?: string
    updatedAt?: string
    transactionsCount: number
}

export enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit"
}

export interface Transaction {
    id: string
    userId: string
    description: string
    transactionType: TransactionType.CREDIT | TransactionType.DEBIT
    date: string
    value: number
    categoryId: string
    createdAt?: string
    updatedAt?: string
    category: Category
}

