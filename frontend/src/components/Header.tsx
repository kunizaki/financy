import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import logo from "../assets/logo.svg"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function Header() {
    const { user, isAuthenticated } = useAuthStore()
    const location = useLocation()
    const isDashboardPage = location.pathname === "/dashboard"
    const isTransactionsPage = location.pathname === "/transactions"
    const isCategoriesPage = location.pathname === "/categories"

    return (
        <>
            {!isAuthenticated && (
                <div className="flex flex-row justify-between content-center items-center w-full px-12 py-4 bg-white border-b-gray-700">
                        <img src={logo} alt="logomarca" className="h-6" />
                        <div className="hidden md:flex items-center gap-4 cursor-pointer">
                            {isDashboardPage ? (
                                <span className="font-bold text-sm">Dashboard</span>
                            ) : (
                                <Link to="/dashboard">
                                    <span
                                        className="font-light text-sm"
                                    >
                                        Dashboard
                                    </span>
                                </Link>
                            )}
                            {isTransactionsPage ? (
                                <span className="font-bold text-sm">Transações</span>
                            ) : (
                                <Link to="/transactions">
                                    <span
                                        className="font-light text-sm"
                                    >
                                        Transações
                                    </span>
                                </Link>
                            )}
                            {isCategoriesPage ? (
                                <span className="font-bold text-sm">Categorias</span>
                            ) : (
                                <Link to="/categories">
                                    <span
                                        className="font-light text-sm"
                                    >
                                        Categorias
                                    </span>
                                </Link>
                            )}
                        </div>
                        <Avatar>
                            <AvatarFallback className="bg-gray-300 text-primary-foreground">
                                {user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                    </div>
                )}
        </>
    )
}