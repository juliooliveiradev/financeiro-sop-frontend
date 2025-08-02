'use client'

import { useEffect, useState } from 'react'
import api from '@/services/api'
import { ExpenseInput } from '@/store/expenses/expensesSlice'

interface ExpenseEditProps {
  protocolo: string;
}

export default function ExpenseDetailPage({ protocolo }: ExpenseEditProps) {
  
  const [expense, setExpense] = useState<ExpenseInput | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const fetchData = async () => {
  try {
    const res = await api.get('/despesas/buscar', { params: { protocolo } });

    const data = Array.isArray(res.data) ? res.data[0] : res.data;

    if (!data) {
      alert('Despesa não encontrada');
      return;
    }

    setExpense({
      protocolo: data.protocolo,
      tipo: data.tipo,
      credor: data.credor,
      descricao: data.descricao,
      valor: String(data.valor ?? data.valorFormatado?.replace(/[^\d,.-]+/g, '').replace(',', '.')),
      dataProtocolo: data.dataProtocolo, // deve estar em formato ISO
      dataVencimento: data.dataVencimento, // idem
    });
  } catch (error) {
    console.error('Erro ao buscar despesa:', error);
    alert('Erro ao carregar despesa');
  }
};


  useEffect(() => {
    if (protocolo) fetchData()
  }, [protocolo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExpense((prev) => prev ? { ...prev, [name]: value } : prev)
  }

  const handleEdit = () => setIsEditing(true)

  const handleSave = async () => {
    if (!expense) return

    try {
      await api.put(`/despesas?protocolo=${encodeURIComponent(protocolo)}`, {
        ...expense,
        valor: parseFloat(expense.valor),
        dataProtocolo: new Date(expense.dataProtocolo).toISOString(),
        dataVencimento: new Date(expense.dataVencimento).toISOString(),
      })

      alert('Despesa atualizada com sucesso!')
      setIsEditing(false)
      fetchData()
    } catch (error) {
      alert('Erro ao atualizar despesa')
    }
  }

  if (!expense) return <div className="p-4">Carregando...</div>

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Detalhes da Despesa</h2>
      <div className="grid grid-cols-2 gap-4">
        <input name="protocolo" value={expense.protocolo} disabled className="border p-2 bg-gray-100" />
        <select name="tipo" value={expense.tipo} disabled={!isEditing} onChange={handleChange} className="border p-2">
          <option>Obra de Edificação</option>
          <option>Obra de Rodovias</option>
          <option>Outros</option>
        </select>
        <input
          type="datetime-local"
          name="dataProtocolo"
          value={expense.dataProtocolo?.slice(0, 16) || ''}
          disabled={!isEditing}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="date"
          name="dataVencimento"
          value={expense.dataVencimento?.slice(0, 10) || ''}
          disabled={!isEditing}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="credor"
          value={expense.credor}
          disabled={!isEditing}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="valor"
          value={expense.valor}
          type="number"
          step="0.01"
          disabled={!isEditing}
          onChange={handleChange}
          className="border p-2"
        />
        <textarea
          name="descricao"
          value={expense.descricao}
          disabled={!isEditing}
          onChange={handleChange}
          className="border p-2 col-span-2"
        />
      </div>
      <div className="flex justify-end mt-4 gap-2">
        {!isEditing && (
          <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Editar
          </button>
        )}
        {isEditing && (
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
            Salvar
          </button>
        )}
      </div>
    </div>
  )
}
