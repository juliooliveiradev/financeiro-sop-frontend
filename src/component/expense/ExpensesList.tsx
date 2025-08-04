'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { fetchExpenses, deleteExpense, Expense } from '@/store/expenses/expensesSlice'
import Link from 'next/link'

const ExpensesList = () => {
  const dispatch = useAppDispatch()
  const { expenses, loading, error } = useAppSelector((state) => state.expenses)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchExpenses())
  }, [dispatch])

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      dispatch(deleteExpense(id))
    }
  }

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'Paga':
        return 'text-green-500'
      case 'Parcialmente Paga':
        return 'text-yellow-500'
      case 'Aguardando Pagamento':
      case 'Parcialmente Empenhada':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const handleGenerateReport = async () => {
  const token = localStorage.getItem('token') // ou onde você armazena o JWT

  const response = await fetch('http://localhost:8080/api/relatorios/despesas', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'relatorio-despesas.pdf')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

  if (loading) return <div className="text-center p-4">Carregando...</div>
  if (error) return <div className="text-center p-4 text-red-500">Erro: {error}</div>

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Despesas</h2>
          <a
          
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleGenerateReport}
          >
        Gerar Relatório PDF
        </a>
      </div>
      <table className="min-w-full bg-black border border-gray-700">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Protocolo</th>
            <th className="py-2 px-4 border-b">Credor</th>
            <th className="py-2 px-4 border-b">Valor</th>
            <th className="py-2 px-4 border-b">Status</th>
            {isAuthenticated && <th className="py-2 px-4 border-b">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense: Expense) => (
            <tr key={expense.protocolo} className="hover:bg-black-50">
              <td className="py-2 px-4 border-b text-sm sm:text-base">{expense.protocolo}</td>
              <td className="py-2 px-4 border-b text-sm sm:text-base">{expense.credor}</td>
              <td className="py-2 px-4 border-b text-sm sm:text-base">R$ {expense.valorFormatado}</td>
              <td className={`py-2 px-4 border-b text-sm sm:text-base ${getStatusClass(expense.status)}`}>
                {expense.status || 'N/A'}
              </td>
              {isAuthenticated && (
                <td className="py-2 px-4 border-b text-sm">
                  <button
                    onClick={() => handleDelete(expense.protocolo)}
                    className="text-red-600 hover:text-red-900 mr-2"
                  >
                    Excluir
                  </button>
                  <Link
                    href={`/expenses?protocolo=${encodeURIComponent(expense.protocolo)}`}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Detalhes
                  </Link>
                  <Link
                    href={`/commitments?despesaId=${encodeURIComponent(expense.protocolo)}`}
                    className="text-green-600 hover:text-green-900"
                  >
                    Empenhos
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpensesList
