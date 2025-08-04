'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks'
import {
  Commitment,
  deleteCommitment,
  fetchCommitmentsByExpense,
} from '@/store/commitments/commitmentsSlice'
import PaymentList from '../payments/PaymentList'
import CommitmentForm from './CommitmentForm'

interface Props {
  expenseId: string
}

export default function CommitmentList({ expenseId }: Props) {
  const dispatch = useAppDispatch()
  const { commitments, loading, error } = useAppSelector((state) => state.commitments)

  const [expandedCommitment, setExpandedCommitment] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (expenseId) {
      dispatch(fetchCommitmentsByExpense(expenseId))
    }
  }, [expenseId, dispatch])

  const filtered = commitments.filter((c) => c.despesaId === expenseId)

  const toggleExpand = (numero: string) => {
    setExpandedCommitment((prev) => (prev === numero ? null : numero))
  }

  const toggleForm = () => setShowForm((prev) => !prev)

  const handleGenerateCommitmentReport = async () => {
    if (filtered.length === 0) return

    const protocolo = filtered[0].despesaId // supondo que todos os empenhos da despesa compartilham o mesmo protocolo
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`http://localhost:8080/api/relatorios/empenhos?protocolo=${encodeURIComponent(protocolo)}`, {
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
      link.setAttribute('download', `relatorio-empenhos-${protocolo}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error(err)
      alert('Erro ao gerar relatório de empenhos.')
    }
  }

  if (loading) return <p>Carregando empenhos...</p>
  if (error) return <p className="text-red-500">Erro: {error}</p>

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Empenhos</h3>
        <div className="space-x-2">
          <button
            onClick={toggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : 'Criar Empenho'}
          </button>

          {filtered.length > 0 && (
            <button
              onClick={handleGenerateCommitmentReport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Gerar Relatório PDF
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <CommitmentForm
          despesaId={expenseId}
          onSuccess={() => {
            setShowForm(false)
            setExpandedCommitment(null)
          }}
        />
      )}

      {filtered.length === 0 ? (
        <p>Nenhum empenho registrado.</p>
      ) : (
        <ul className="divide-y">
          {filtered.map((commitment: Commitment) => (
            <li key={commitment.numero} className="py-2">
              <div
                onClick={() => toggleExpand(commitment.numero)}
                className="cursor-pointer hover:bg-blue-500 p-2 rounded transition"
              >
                <p className="font-semibold">{commitment.numero}</p>
                <p>Data: {commitment.dataEmpenhoFormatado}</p>
                <p>Valor: {commitment.valorEmpenhadoFormatado}</p>
                <p>Obs: {commitment.descricao || '-'}</p>
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
