'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { fetchPaymentsByCommitment } from '@/store/payments/paymentsSlice'
import PaymentCreate from './PaymentCreate'

interface PaymentListProps {
  empenhoId: string
}

export default function PaymentList({ empenhoId }: PaymentListProps) {
  const dispatch = useAppDispatch()
  const { payments, loading, error } = useAppSelector((state) => state.payments)

  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    dispatch(fetchPaymentsByCommitment(empenhoId))
  }, [dispatch, empenhoId])

  const handleOpenForm = () => setShowCreateForm(true)
  const handleCloseForm = () => setShowCreateForm(false)

  const handleGeneratePaymentReport = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`http://localhost:8080/api/relatorios/pagamentos?numero=${encodeURIComponent(empenhoId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `relatorio-pagamentos-${empenhoId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error(err)
      alert('Erro ao gerar relatório de pagamentos.')
    }
  }

  return (
    <div className="mt-6 p-4 border rounded-md shadow bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pagamentos Registrados</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleOpenForm}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Novo Pagamento
          </button>
          <button
            onClick={handleGeneratePaymentReport}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Gerar Relatório PDF
          </button>
        </div>
      </div>

      {showCreateForm && (
        <PaymentCreate empenhoId={empenhoId} onSuccess={handleCloseForm} />
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="text-red-500">Erro: {error}</p>
      ) : payments.length === 0 ? (
        <p>Nenhum pagamento registrado ainda.</p>
      ) : (
        <table className="w-full text-left border-collapse bg-black text-white">
          <thead>
            <tr>
              <th className="border-b p-2">Número</th>
              <th className="border-b p-2">Data</th>
              <th className="border-b p-2">Valor</th>
              <th className="border-b p-2">Observação</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.numero}>
                <td className="border-b p-2">{p.numero}</td>
                <td className="border-b p-2">{p.dataPagamentoFormatado}</td>
                <td className="border-b p-2">{p.valorPagoFormatado}</td>
                <td className="border-b p-2">{p.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
