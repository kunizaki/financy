import {Navigate, Route, Routes} from "react-router-dom"
import {useAuthStore} from "./stores/auth"
import {Layout} from "@/components/Layout"
import {Login} from "@/pages/Auth/Login"
import {Signup} from "@/pages/Auth/Signup"
import {Categories} from "@/pages/Categories";
import {Dashboard} from "@/pages/Dashboard";
import {Transactions} from "@/pages/Transactions";
import {UpdateUser} from "@/pages/Auth/UpdateUser.tsx";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
    return (
        <Layout>
            <Routes>
                <Route
                    path="/login"
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
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <UpdateUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <Categories />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Layout>
    )
}

export default App