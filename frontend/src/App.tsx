import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Login } from "./pages/Auth/Login"
import { Signup } from "./pages/Auth/Signup"
import { useAuthStore } from "./stores/auth"
import {Categories} from "@/pages/System/Categories.tsx";
import {Dashboard} from "@/pages/System/Dashboard.tsx";
import {Transactions} from "@/pages/System/Transactions.tsx";

/*function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}*/

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
    return (
        <Layout>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PublicRoute>
                            <Dashboard />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <PublicRoute>
                            <Categories />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <PublicRoute>
                            <Transactions />
                        </PublicRoute>
                    }
                />
                {/*<Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <IdeasPage />
                        </ProtectedRoute>
                    }
                />*/}
            </Routes>
        </Layout>
    )
}

export default App