import {useMemo, useState} from "react";
import {Card} from "@/components/ui/card.tsx";
import {useQuery} from "@apollo/client/react";
import {useNavigate} from "react-router-dom";
import {LIST_TRANSACTIONS} from "@/lib/graphql/queries/Transactions.ts";

import {DynamicIcon} from "lucide-react/dynamic";
import {ArrowDownCircle, ArrowUpCircle, ChevronRight, Wallet} from "lucide-react"

import {CreateTransactionDialog} from "@/pages/Transactions/components/CreateTransactionDialog.tsx";

import {Transaction, TransactionType} from "@/types";

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('pt-br')

type CategoryTransaction = {
    title: string,
    totalAmount: number,
    color: string,
    transactionsCount: number
}

type ListTransactionsResponse = {
    listTransactions: {
        totalCredit: number;
        totalDebit: number;
        transactions: Transaction[];
    };
};

export function Dashboard() {
    const navigate = useNavigate()

    const [openDialog, setOpenDialog] = useState(false)
    const [monthCredits, setMonthCredits] = useState(0)
    const [monthDebits, setMonthDebits] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)
    const [categoriesFromTransactions, setCategoriesFromTransactions] = useState<CategoryTransaction[]>([])

    const { data: transactionsData, refetch } = useQuery<ListTransactionsResponse>(
        LIST_TRANSACTIONS,
        {
            variables: {
                data: {
                    period: dayjs().tz('America/Sao_Paulo').format('YYYY-MM'),
                }
            },
            fetchPolicy: "cache-and-network",
        }
    );

    const lastTransactions = transactionsData?.listTransactions || null;

    useMemo(() => {
        if (!lastTransactions) return
        const calculatedCategoriesFromTransactions = Array.from(
            lastTransactions.transactions
                .filter((t) => t.transactionType !== TransactionType.CREDIT)
                .reduce((map, transaction) => {
                    const categoryId = transaction.category.id

                    const current = map.get(categoryId)
                    if (!current) {
                        map.set(categoryId, {
                            title: transaction.category.title,
                            totalAmount: transaction.value,
                            color: transaction.category.color,
                            transactionsCount: 1,
                        })
                    } else {
                        map.set(categoryId, {
                            ...current,
                            totalAmount: current.totalAmount + transaction.value,
                            transactionsCount: current.transactionsCount + 1,
                        })
                    }

                    return map
                }, new Map<string, { title: string; totalAmount: number; color: string; transactionsCount: number }>())
                .values()
        )

        setCategoriesFromTransactions(calculatedCategoriesFromTransactions)
        setMonthCredits(lastTransactions.totalCredit)
        setMonthDebits(lastTransactions.totalDebit)
        setTotalBalance(lastTransactions.totalCredit - lastTransactions.totalDebit)
    }, [lastTransactions])

    return (
        <div className="flex flex-col min-h-screen justify-start p-0 gap-3 lg:p-12 lg:gap-8">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-6">
                <Card className="flex flex-col items-start rounded-xl bg-white p-6 border border-gray-200 gap-4">
                    <div className="flex flex-row justify-center items-center gap-3">
                        <Wallet className="w-6 h-6 text-purple-600" />
                        <span className="font-extralight text-xs text-gray-500">SALDO TOTAL</span>
                    </div>
                    <span className="text-[28px] font-bold text-gray-800">{totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </Card>
                <Card className="flex flex-col items-start rounded-xl bg-white p-6 border border-gray-200 gap-4">
                    <div className="flex flex-row justify-center items-center gap-3">
                        <ArrowUpCircle className="w-6 h-6 text-green-900" />
                        <span className="font-extralight text-xs text-gray-500">RECEITAS DO MÊS</span>
                    </div>
                    <span className="text-[28px] font-bold text-gray-800">{monthCredits.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </Card>
                <Card className="flex flex-col items-start rounded-xl bg-white p-6 border border-gray-200 gap-4">
                    <div className="flex flex-row justify-center items-center gap-3">
                        <ArrowDownCircle className="w-6 h-6 text-red-600" />
                        <span className="font-extralight text-xs text-gray-500">DESPESAS DO MÊS</span>
                    </div>
                    <span className="text-[28px] font-bold text-gray-800">{monthDebits.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-6">
                <Card className="flex flex-col rounded-xl bg-white border border-gray-200 gap-4 md:col-span-2">
                    <div className="flex flex-row justify-between items-center w-full p-5 border-b border-gray-200">
                        <span className="text-xs text-gray-500">TRANSAÇÕES RECENTES</span>
                        <div className="flex flex-row cursor-pointer" onClick={() => navigate('/transactions')}>
                            <span className="text-sm text-green-950">Ver todas</span>
                            <ChevronRight className="text-green-950 ml-1 w-5 h-5" />
                        </div>
                    </div>
                    {lastTransactions?.transactions && lastTransactions.transactions.map((transaction) => (
                        <div key={transaction.id} className="grid grid-cols-1 px-4 pb-4 border-b border-gray-200 gap-4 xl:grid-cols-2">
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex justify-center items-center w-10 h-10 rounded-[8px]" style={{ backgroundColor: `${transaction.category.color}20` }}>
                                    <DynamicIcon name={transaction.category.icon} color={transaction.category.color} size={24} />
                                </div>
                                <div className="flex flex-col flex-1 items-start">
                                    <span className="text-lg text-gray-800">{transaction.description}</span>
                                    <span className="text-xs text-gray-500">{dayjs(transaction.date).tz('America/Sao_Paulo').format('DD/MM/YYYY')}</span>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-4">
                                <div className="flex w-56 justify-center items-center">
                                    <div className="flex justify-center w-fit items-center px-3 py-1 rounded-full" style={{ backgroundColor: `${transaction.category.color}20` }}>
                                        <span className="text-sm" style={{ color: transaction.category.color }}>{transaction.category.title}</span>
                                    </div>
                                </div>
                                <div className="w-40 text-end">
                                    <span className="text-lg text-gray-800 font-bold text-nowrap">{transaction.transactionType === TransactionType.CREDIT ? "+ " : "- "}{transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                <div className="flex w-fit items-center">
                                    <DynamicIcon name={transaction.transactionType === TransactionType.CREDIT ? 'circle-arrow-up' : 'circle-arrow-down'} color={transaction.transactionType === TransactionType.CREDIT ? 'green' : 'red'} size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-row justify-center items-center w-full pb-5">
                        <span className="text-green-950 cursor-pointer" onClick={() => setOpenDialog(true)}>+ Nova transação</span>
                    </div>
                </Card>

                <Card className="flex flex-col rounded-xl bg-white border border-gray-200 gap-4 md:col-span-1">
                    <div className="flex flex-row justify-between items-center w-full p-5 border-b border-gray-200">
                        <span className="text-xs text-gray-500">CATEGORIAS</span>
                        <div className="flex flex-row cursor-pointer" onClick={() => navigate('/categories')}>
                            <span className="text-sm text-green-950">Gerenciar</span>
                            <ChevronRight className="text-green-950 ml-1 w-5 h-5" />
                        </div>
                    </div>
                    {categoriesFromTransactions.map((categoryTransaction) => (
                        <div key={categoryTransaction.title} className="grid grid-cols-1 px-4 pb-4 border-b border-gray-200 gap-4 xl:grid-cols-3">
                            <div className="flex justify-center items-center lg:justify-start">
                                <div className="flex justify-center w-fit items-center px-3 py-1 rounded-full" style={{ backgroundColor: `${categoryTransaction.color}20` }}>
                                    <span className="text-sm" style={{ color: categoryTransaction.color }}>{categoryTransaction.title}</span>
                                </div>
                            </div>
                            <div className="flex justify-center items-center lg:justify-end">
                                <span className="text-sm text-gray-500">{categoryTransaction.transactionsCount} itens</span>
                            </div>
                            <div className="flex justify-center items-center lg:justify-end">
                                <span className="text-sm text-gray-500">{categoryTransaction.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            <CreateTransactionDialog open={openDialog} onOpenChange={setOpenDialog} onCreated={() => refetch()} />
        </div>
    )
}