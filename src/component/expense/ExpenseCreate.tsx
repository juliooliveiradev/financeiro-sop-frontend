'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function NewExpensePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    tipo: '',
    dataVencimento: '',
    credor: '',
    descricao: '',
    valor: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/despesas', {
        tipo: form.tipo,
        dataVencimento: formatDateToDDMMYYYY(form.dataVencimento),
        credor: form.credor,
        descricao: form.descricao,
        valor: parseFloat(form.valor)
      });
      alert('Despesa criada com sucesso!');
      router.push('/');
    } catch (err) {
      alert('Erro ao criar despesa');
      console.error(err);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 bg-black rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Cadastrar Nova Despesa</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <select name="tipo" value={form.tipo} onChange={handleChange} className="border p-2" required>
          <option value="">Selecione o tipo</option>
          <option value="Serviço">Serviço</option>
          <option value="Obra de Edificação">Obra de Edificação</option>
          <option value="Obra de Rodovias">Obra de Rodovias</option>
          <option value="Outros">Outros</option>
        </select>
        <input
          type="date"
          name="dataVencimento"
          required
          value={form.dataVencimento}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="credor"
          placeholder="Credor"
          required
          value={form.credor}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="number"
          name="valor"
          step="0.01"
          placeholder="Valor"
          required
          value={form.valor}
          onChange={handleChange}
          className="border p-2"
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          required
          value={form.descricao}
          onChange={handleChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Salvar</button>
      </form>
    </main>
  );
}
