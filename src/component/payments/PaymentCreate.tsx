'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { createPayment } from '@/store/payments/paymentsSlice'

interface PaymentCreateProps {
  empenhoId: string
  onSuccess: () => void
}

export default function PaymentCreate({ empenhoId, onSuccess }: PaymentCreateProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.payments)

  const [paymentDate, setPaymentDate] = useState('')
  const [value, setValue] = useState('')
  const [observation, setObservation] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
    await dispatch(
      createPayment({
        data: paymentDate,
        valor: parseFloat(value),
        observacao: observation,
        empenhoId: empenhoId, // já está correto aqui
      })
    ).unwrap()

    setPaymentDate('')
    setValue('')
    setObservation('')
    onSuccess()
  } catch {
      // erro tratado no slice
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-gray-50">
      <div className="mb-2">
        <label className="block font-semibold mb-1">Número do Empenho</label>
        <input
          type="text"
          value={empenhoId}
          disabled
          className="w-full border p-2 rounded bg-gray-200 cursor-not-allowed"
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold mb-1">Data do Pagamento</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold mb-1">Valor</label>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold mb-1">Observação</label>
        <input
          type="text"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-600 mb-2">Erro: {error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Salvando...' : 'Salvar Pagamento'}
      </button>
    </form>
  )
}
