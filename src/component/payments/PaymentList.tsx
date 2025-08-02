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

  return (
    <div className="mt-6 p-4 border rounded-md shadow bg-white">
      <h2 className="text-xl font-bold mb-4 flex justify-between items-center bg-black">
        Pagamentos Registrados
        <button
          onClick={handleOpenForm}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Novo Pagamento
        </button>
      </h2>

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
        <table className="w-full text-left border-collapse bg-black">
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
                <td className="border-b p-2">{p.dataPagamentoFormatado || p.dataPagamentoFormatado}</td>
                <td className="border-b p-2">{p.valorPagoFormatado || p.valorPagoFormatado}</td>
                <td className="border-b p-2">{p.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
