'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks'
import {
  Commitment,
  deleteCommitment,
  fetchCommitmentsByExpense,
} from '@/store/commitments/commitmentsSlice'
import PaymentList from '../payments/PaymentList'

interface Props {
  expenseId: string
}

export default function CommitmentList({ expenseId }: Props) {
  const dispatch = useAppDispatch()
  const { commitments, loading, error } = useAppSelector((state) => state.commitments)

  const [expandedCommitment, setExpandedCommitment] = useState<string | null>(null)

  useEffect(() => {
    if (expenseId) {
      dispatch(fetchCommitmentsByExpense(expenseId))
    }
  }, [expenseId, dispatch])

  const filtered = commitments.filter((c) => c.despesaId === expenseId)

  const toggleExpand = (numero: string) => {
    setExpandedCommitment((prev) => (prev === numero ? null : numero))
  }

  if (loading) return <p>Carregando empenhos...</p>
  if (error) return <p className="text-red-500">Erro: {error}</p>

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-bold">Empenhos</h3>
      {filtered.length === 0 ? (
        <p>Nenhum empenho registrado.</p>
      ) : (
        <ul className="divide-y">
          {filtered.map((commitment: Commitment) => (
            <li key={commitment.numero} className="py-2">
              <div
                onClick={() => toggleExpand(commitment.numero)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded transition"
              >
                <p className="font-semibold">{commitment.numero}</p>
                <p>Data: {commitment.dataEmpenhoFormatado}</p>
                <p>Valor: {commitment.valorEmpenhadoFormatado}</p>
                <p>Obs: {commitment.descricao}</p>
              </div>

              <div className="text-right mt-1">
                <button
                  onClick={() => dispatch(deleteCommitment(commitment.numero))}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </div>

              {expandedCommitment === commitment.numero && (
                <div className="mt-2 ml-4">
                  <PaymentList empenhoId={commitment.numero} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
