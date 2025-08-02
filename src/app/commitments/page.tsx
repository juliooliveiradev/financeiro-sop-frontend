'use client'

import { useSearchParams } from 'next/navigation'
import CommitmentList from '@/component/commitments/CommitmentList'

export default function CommitmentPage() {
  const searchParams = useSearchParams()
  const expenseId = searchParams?.get('despesaId')

  if (!expenseId) {
    return <p className="p-4 text-red-500">Despesa não informada na URL</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Empenhos da Despesa</h1>
      <CommitmentList expenseId={expenseId} />
    </div>
  )
}
