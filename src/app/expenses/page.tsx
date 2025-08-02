'use client';

import ExpenseEdit from '@/component/expense/ExpenseEdit';
import { useSearchParams } from 'next/navigation';

export default function ExpenseDetailPage() {
  const searchParams = useSearchParams();
  const protocolo = searchParams?.get('protocolo') ?? '';
  if (!protocolo) return <div>Protocolo inválido</div>;

  return <ExpenseEdit protocolo={protocolo} />;
}