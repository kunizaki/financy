import {Button} from "@/components/ui/button.tsx";
import { ArrowDownCircle, ArrowLeftSquare, ArrowRightSquare, ArrowUpCircle, Plus, Search, SquarePenIcon, Trash2} from "lucide-react"
import {Card} from "@/components/ui/card.tsx";
import {DynamicIcon} from "lucide-react/dynamic";
import {Transaction, TrasactionType} from "@/types";
import {useCallback, useEffect, useState} from "react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/pt-br'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.locale('pt-br')

export function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [transactionsList, setTransactionsList] = useState<Transaction[]>([])
    const [searchByDescription, setSearchByDescription] = useState('')
    const [searchByTransactionType, setSearchByTransactionType] = useState('all')
    const [searchByCategory, setSearchByCategory] = useState('all')
    const [searchByPeriod, setSearchByPeriod] = useState(dayjs().format('YYYY-MM'))

    const [categoriesAvailable, setCategoriesAvailable] = useState<string[]>([])

    const [actualPage, setActualPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [perPage] = useState(10)

    const periodsAvailable: string[] = Array.from({ length: 12 }, (_, i) =>
        dayjs().subtract(i, "month").format("YYYY-MM")
    )

    const getTransactions = useCallback(async () => {
        const searchPeriodDefined = searchByPeriod !== '' ? dayjs(searchByPeriod, 'YYYY-MM') : dayjs().startOf('month')
        const transactionsInfos = {
            totalCredit: 9000.00,
            totalDebit: 1500.00,
            transactions: [
                {
                    id: '1',
                    userId: '1',
                    description: 'Recebimento de Salário',
                    transactionType: TrasactionType.CREDIT,
                    date: '2026-02-08T12:00:00.000Z',
                    value: 9000.00,
                    categoryId: '1',
                    createdAt: '2026-02-08T12:00:00.000Z',
                    category: {
                        id: '1',
                        userId: '1',
                        title: 'Salário',
                        description: 'Recebimento de salário mensal.',
                        icon: 'wallet',
                        color: '#095c00',
                        transactionsCount: 2
                    }
                },
                {
                    id: '2',
                    userId: '1',
                    description: 'Compra de alimentos',
                    transactionType: TrasactionType.DEBIT,
                    date: '2026-02-10T12:00:00.000Z',
                    value: 1000.00,
                    categoryId: '1',
                    createdAt: '2026-02-10T12:00:00.000Z',
                    category: {
                        id: '2',
                        userId: '1',
                        title: 'Alimentação',
                        description: 'Descrição da categoria alimentação',
                        icon: 'fork-knife',
                        color: '#7a0000',
                        transactionsCount: 8
                    }
                },
                {
                    id: '3',
                    userId: '1',
                    description: 'Plano de Saúde',
                    transactionType: TrasactionType.DEBIT,
                    date: '2026-02-10T12:00:00.000Z',
                    value: 500.00,
                    categoryId: '3',
                    createdAt: '2026-02-10T12:00:00.000Z',
                    category: {
                        id: '4',
                        userId: '1',
                        title: 'Saúde',
                        description: 'Descrição da categoria saúde',
                        icon: 'heart',
                        color: '#001bd3',
                        transactionsCount: 30
                    }
                },
                {
                    id: '4',
                    userId: '1',
                    description: 'Lanchonete',
                    transactionType: TrasactionType.DEBIT,
                    date: '2026-02-11T12:00:00.000Z',
                    value: 200.00,
                    categoryId: '1',
                    createdAt: '2026-02-11T12:00:00.000Z',
                    category: {
                        id: '2',
                        userId: '1',
                        title: 'Alimentação',
                        description: 'Descrição da categoria alimentação',
                        icon: 'fork-knife',
                        color: '#7a0000',
                        transactionsCount: 8
                    }
                },
            ]
        } satisfies {
            totalCredit: number
            totalDebit: number
            transactions: Transaction[]
        }

        let transactionsFiltered = transactionsInfos.transactions.filter((transaction) => dayjs(transaction.date).isBetween(dayjs(searchPeriodDefined).startOf('month').startOf('day'), dayjs(searchPeriodDefined).endOf('month').endOf('day')))

        const categories = transactionsFiltered.map((t) => t.category.title)
        const uniqueSorted = Array.from(new Set(categories)).sort((a, b) => a.localeCompare(b, 'pt-BR'))
        setCategoriesAvailable(uniqueSorted)

        if (searchByDescription !== '') {
            transactionsFiltered = transactionsFiltered.filter((transaction) => transaction.description.toLowerCase().includes(searchByDescription.toLowerCase()))
        }
        if (searchByTransactionType !== 'all') {
            transactionsFiltered = transactionsFiltered.filter((transaction) => transaction.transactionType === searchByTransactionType as TrasactionType)
        }
        if (searchByCategory !== 'all') {
            transactionsFiltered = transactionsFiltered.filter((transaction) => transaction.category.title === searchByCategory)
        }

        setTransactions(transactionsFiltered)
        setActualPage(1)
        setTotalPages(Math.ceil(transactionsFiltered.length / perPage))
    }, [searchByDescription, searchByTransactionType, searchByCategory, searchByPeriod])

    useEffect(() => {
        setTransactionsList(transactions.slice((actualPage - 1) * perPage, actualPage * perPage))
    }, [actualPage, transactions]);
    useEffect(() => {
        getTransactions()
    }, [getTransactions]);
    return (
        <div className="flex flex-col min-h-screen md:p-12 justify-start gap-2">
            <div className="flex flex-col md:flex-row justify-between md:justify-center items-center w-full gap-4">
                <div className="flex-1 w-full text-center md:text-start">
                    <h1 className="text-xl font-bold">Transações</h1>
                    <span className="text-xs">Gerencie todas as suas transações financeiras</span>
                </div>
                <Button className="flex flex-row h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a] gap-2">
                    <Plus />
                    Nova transação
                </Button>
            </div>
            <Card className="flex flex-col md:flex-row w-full rounded-xl bg-white p-6 border border-gray-200 gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col col-span-1 lg:col-span-3">
                        <span className="text-sm text-gray-700">Buscar</span>
                        <InputGroup className="px-3 py-3.5 rounded-[8px] border-gray-300">
                            <InputGroupAddon>
                                <Search className="text-gray-500" />
                            </InputGroupAddon>
                            <InputGroupInput
                                id="searchByDescription"
                                type="searchByDescription"
                                placeholder="Buscar por descrição"
                                value={searchByDescription}
                                onChange={(e) => setSearchByDescription(e.target.value)}
                                required
                                className="px-3 py-3.5 text-gray-500"
                            />
                        </InputGroup>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col col-span-1 lg:col-span-3">
                        <span className="text-sm text-gray-700">Tipo</span>
                        <Select
                            value={searchByTransactionType}
                            onValueChange={(value) => setSearchByTransactionType(value)}
                        >
                            <SelectTrigger className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                <SelectValue placeholder="Todos" className="text-gray-500" />
                            </SelectTrigger>
                            <SelectContent defaultValue="all" className="bg-white">
                                <SelectGroup >
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="credit">Crédito</SelectItem>
                                    <SelectItem value="debit">Débito</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col col-span-1 lg:col-span-3">
                        <span className="text-sm text-gray-700">Categoria</span>
                        <Select value={searchByCategory} onValueChange={(value) => setSearchByCategory(value)}>
                            <SelectTrigger className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                <SelectValue placeholder="Todas" className="text-gray-500" />
                            </SelectTrigger>
                            <SelectContent defaultValue="all" className="bg-white">
                                <SelectItem value="all">Todas</SelectItem>
                                {categoriesAvailable.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col col-span-1 lg:col-span-3">
                        <span className="text-sm text-gray-700">Período</span>
                        <Select value={searchByPeriod} onValueChange={(value) => setSearchByPeriod(value)}>
                            <SelectTrigger className="px-3 py-3.5 rounded-[8px] border-gray-300">
                                <SelectValue defaultValue={searchByPeriod} className="text-gray-500" />
                            </SelectTrigger>
                            <SelectContent defaultValue={searchByPeriod} className="bg-white">
                                {periodsAvailable.map((period) => (
                                    <SelectItem key={period} value={period}>{dayjs(period, 'YYYY-MM', true).format('MMMM/YYYY').replace(/^./, (c) => c.toUpperCase())}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
            <Table className="hidden md:flex flex-col flex-1 rounded-xl bg-white border border-gray-200 gap-4">
                <TableHeader className="flex flex-row justify-between items-center w-full border-b px-6 pt-6">
                    <TableRow className="flex flex-row justify-between items-center w-full">
                        <TableHead className="text-xs text-gray-500 w-2/12 xl:w-6/12">DESCRIÇÃO</TableHead>
                        <TableHead className="text-xs text-gray-500 w-2/12 xl:w-1/12 text-center">DATA</TableHead>
                        <TableHead className="text-xs text-gray-500 w-2/12 xl:w-2/12 text-center">CATEGORIA</TableHead>
                        <TableHead className="text-xs text-gray-500 w-2/12 xl:w-1/12 text-center">TIPO</TableHead>
                        <TableHead className="text-xs text-gray-500 w-2/12 xl:w-1/12 text-end">VALOR</TableHead>
                        <TableHead className="text-xs text-gray-500 w-2/12 xl:w-1/12 text-end">AÇÕES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >
                    {transactionsList.map((transaction) => (
                        <TableRow key={transaction.id} className="flex flex-row justify-between items-center w-full px-6 py-1">
                            <TableCell className="flex flex-row items-center gap-4 w-2/12 xl:w-6/12">
                                <div className="flex justify-center items-center w-10 h-10 rounded-[8px]" style={{ backgroundColor: `${transaction.category.color}20` }}>
                                    <DynamicIcon name={transaction.category.icon} color={transaction.category.color} size={24} />
                                </div>
                                <span className="text-xs text-gray-800">{transaction.description}</span>
                            </TableCell>
                            <TableCell className="text-xs text-gray-800 w-2/12 xl:w-1/12 text-center">{dayjs(transaction.date).format('DD/MM/YYYY')}</TableCell>
                            <TableCell className="flex flex-1 justify-center w-2/12 xl:w-2/12">
                                <div className="flex justify-center w-fit items-center px-3 py-1 rounded-full" style={{ backgroundColor: `${transaction.category.color}20` }}>
                                    <span className="text-sm" style={{ color: transaction.category.color }}>{transaction.category.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="flex justify-center text-xs text-gray-800 w-2/12 xl:w-1/12 text-center">
                                    {transaction.transactionType === TrasactionType.CREDIT ? (
                                        <div className="flex flex-row items-center gap-2 w-fit">
                                            <ArrowUpCircle className="w-4 h-4 text-green-800" />
                                            <span className="text-xs text-green-800">Entrada</span>
                                        </div>
                                    ):(
                                        <div className="flex flex-row items-center gap-2 w-fit">
                                            <ArrowDownCircle className="w-4 h-4 text-red-700" />
                                            <span className="text-xs text-red-700">Saída</span>
                                        </div>
                                    )}
                            </TableCell>
                            <TableCell className="text-xs text-gray-800 w-2/12 xl:w-1/12 text-end text-nowrap">{transaction.transactionType === TrasactionType.CREDIT ? '+' : '-'} {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell className="w-2/12 xl:w-1/12">
                                <div className="flex flex-row justify-end gap-2">
                                    <Button variant="outline" className="w-8 h-8 p-2 rounded-[8px] border-gray-300">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                    <Button variant="outline" className="w-8 h-8 p-2 rounded-[8px] border-gray-300">
                                        <SquarePenIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="flex flex-row justify-between items-center w-full p-6">
                        <TableCell colSpan={1} className="text-center">
                            {actualPage === 1 ? 1 : actualPage * perPage - perPage + 1} a {actualPage * perPage > transactions.length ? transactions.length : actualPage * perPage} de {transactions.length} resultados
                        </TableCell>
                        <TableCell className="flex flex-row items-center gap-1">
                            <ArrowLeftSquare className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => setActualPage((p) => Math.max(1, p - 1))} />
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setActualPage(page)}
                                        className={
                                            page === actualPage
                                                ? "px-2 py-1 text-xs rounded bg-gray-900 text-white"
                                                : "px-2 py-1 text-xs rounded border border-gray-300 text-gray-700"
                                        }
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <ArrowRightSquare className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => setActualPage((p) => Math.min(totalPages, p + 1))} />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <Card className="flex md:hidden flex-col justify-center items-center w-full rounded-xl bg-white p-6 border border-gray-200 gap-4">
                <span className="text-red-700 font-bold">Resolução de tela incompatível para exibir os resultados.</span>
                <span className="text-sm">Você precisa de uma resolução superior a 768px para exibir os resultados.</span>
            </Card>
        </div>
    )
}