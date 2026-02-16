import { Toaster } from "@/components/ui/sonner"
import { Header } from "./Header"

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="mx-auto px-4 py-4 lg:px-16">{children}</main>
            <Toaster />
        </div>
    )
}