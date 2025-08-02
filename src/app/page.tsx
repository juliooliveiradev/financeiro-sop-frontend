import ExpensesList from '@/component/expense/ExpensesList';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">SOP Financeiro</h1>
        <Link href="/expenses/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
          Nova Despesa
        </Link>
      </nav>
      <ExpensesList />
    </main>
  );
}