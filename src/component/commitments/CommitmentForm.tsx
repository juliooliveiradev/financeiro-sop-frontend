'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { createCommitment } from '@/store/commitments/commitmentsSlice'

interface CommitmentFormProps {
  despesaId: string
  onSuccess: () => void
}

export default function CommitmentForm({ despesaId, onSuccess }: CommitmentFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error, commitments } = useAppSelector((state) => state.commitments)

  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataEmpenho, setDataEmpenho] = useState('')

  // Salvar quantidade anterior de empenhos para detectar adição
  const prevLength = useRef(commitments.length)

  useEffect(() => {
    if (!loading && !error && commitments.length > prevLength.current) {
      onSuccess()
      setValor('')
      setDescricao('')
      setDataEmpenho('')
    }
    prevLength.current = commitments.length
  }, [loading, error, commitments, onSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    dispatch(
      createCommitment({
        valor: parseFloat(valor),
        descricao,
        dataEmpenho,
        despesaId,
      })
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white">
      <div>
        <label className="block mb-1 font-medium">Despesa (ID)</label>
        <input
          type="text"
          value={despesaId}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Valor</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Data do Empenho</label>
        <input
          type="date"
          value={dataEmpenho}
          onChange={(e) => setDataEmpenho(e.target.value)}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-600">Erro: {error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Salvando...' : 'Salvar Empenho'}
      </button>
    </form>
  )
}
