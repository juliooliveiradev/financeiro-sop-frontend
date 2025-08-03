'use client'

import ExpensesList from '@/component/expense/ExpensesList'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-500 p-4">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">SOP Financeiro</h1>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Bem-vindo, {user?.nome}</span>
            <Link
              href="/expenses/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Nova Despesa
            </Link>
          </div>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          >
            Login
          </button>
        )}
      </nav>

      <ExpensesList />
    </main>
  )
}
