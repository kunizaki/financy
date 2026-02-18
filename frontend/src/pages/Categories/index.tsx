import {Button} from "@/components/ui/button.tsx";
import { ArrowRightLeftIcon, Plus, SquarePenIcon, Tag, Trash2 } from "lucide-react"
import {Card} from "@/components/ui/card.tsx";
import {DynamicIcon} from "lucide-react/dynamic";
import {Category} from "@/types";
import {useMemo, useState} from "react";
import {CreateCategoryDialog} from "@/pages/Categories/components/CreateCategoryDialog.tsx";
import {LIST_CATEGORIES} from "@/lib/graphql/queries/Categories.ts";
import {useQuery} from "@apollo/client/react";
import {Spinner} from "@/components/ui/spinner.tsx";

export function Categories() {
    const [openDialog, setOpenDialog] = useState(false)
    const { data, loading, refetch } = useQuery<{ categories: Category[] }>(LIST_CATEGORIES)

    const categories = data?.categories || []

    const featuredCategory = useMemo(() => {
        if (categories.length > 0) {
            //Busca a categoria mais utilizada
            return [...categories].sort((a, b) => b.transactionsCount - a.transactionsCount)[0]
        }
        return null
    }, [categories])

    return (
        <>
            {loading && (
                <div className="flex flex-col items-center justify-center w-full h-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
                    <Spinner className="size-10" />
                </div>
            )}
            {!loading && (
                <div className="flex flex-col min-h-screen md:p-12 justify-start gap-8">
                    <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex-1 w-full">
                            <h1 className="text-xl font-bold">Categorias</h1>
                            <span className="text-xs">Organize suas transações por categorias</span>
                        </div>
                        <Button className="flex flex-row h-12 py-3 px-3.5 rounded-[8px] text-white bg-[#1F6F43] hover:bg-[#1a5f3a] gap-2" onClick={ () => setOpenDialog(true)}>
                            <Plus />
                            Nova Categoria
                        </Button>

                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card className="flex flex-row w-full rounded-xl bg-white p-6 border border-gray-200 gap-4">
                            <div className="flex justify-center items-center w-8 h-10">
                                <Tag className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[28px] font-bold text-gray-800">8</span>
                                <span className="text-xs text-gray-500">TOTAL DE CATEGORIAS</span>
                            </div>
                        </Card>
                        <Card className="flex flex-row w-full rounded-xl bg-white p-6 border border-gray-200 gap-4">
                            <div className="flex justify-center items-center w-8 h-10">
                                <ArrowRightLeftIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[28px] font-bold text-gray-800">27</span>
                                <span className="text-xs text-gray-500">TOTAL DE TRANSAÇÕES</span>
                            </div>
                        </Card>
                        <Card className="flex flex-row w-full rounded-xl bg-white p-6 border border-gray-200 gap-4">
                            {featuredCategory && (
                                <>
                                    <div className="flex justify-center items-center w-8 h-10">
                                        <DynamicIcon name={featuredCategory.icon} color={featuredCategory.color} size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[28px] font-bold text-gray-800">{featuredCategory.title}</span>
                                        <span className="text-xs text-gray-500">CATEGORIA MAIS UTILIZADA</span>
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>
                    <div className="flex flex-row flex-wrap items-center justify-between md:justify-normal w-full gap-6">
                        {categories.length > 0 && categories.map((category) => (
                            <Card key={category.id} className="flex flex-col w-[284px] h-[226px] rounded-xl bg-white p-6 border border-gray-200 gap-4">
                                <div className="flex flex-row justify-between items-center w-full h-10">
                                    <div className="flex-1 h-10">
                                        <div className="flex justify-center items-center w-10 h-10 rounded-[8px]" style={{ backgroundColor: `${category.color}20` }}>
                                            <DynamicIcon name={category.icon} color={category.color} size={24} />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Button variant="outline" className="w-8 h-8 p-2 rounded-[8px] border-gray-300">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                        <Button variant="outline" className="w-8 h-8 p-2 rounded-[8px] border-gray-300">
                                            <SquarePenIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl text-gray-800">{category.title}</h3>
                                    <span className="text-xs text-gray-600">{category?.description}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center w-full h-10">
                                    <div className="flex justify-center items-center px-3 py-1 rounded-full" style={{ backgroundColor: `${category.color}20` }}>
                                        <span className="text-sm" style={{ color: category.color }}>{category.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{category.transactionsCount} itens</span>
                                </div>
                            </Card>
                        ))}
                        {categories.length === 0 && (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <span className="text-xl text-gray-600">Nenhuma categoria cadastrada</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <CreateCategoryDialog open={openDialog} onOpenChange={setOpenDialog} onCreated={() => refetch()} />
        </>
    )
}