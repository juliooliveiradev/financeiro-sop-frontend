'use client'

import { useState } from 'react'
import api from '@/services/api'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/reduxHooks' // Importa o hook para despachar ações
import { login } from '@/store/auth/authSlice' // Importa a ação de login

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const router = useRouter()
  const dispatch = useAppDispatch() // Instancia o dispatcher

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', form)

      // Salvamos o token no localStorage
      localStorage.setItem('token', res.data.token)
      // E salvamos o nome do usuário para poder restaurar o estado mais tarde
      localStorage.setItem('userNome', res.data.nome)

      // Despacha a ação de login para atualizar o estado global do Redux
      dispatch(login({ nome: res.data.nome }))

      router.push('/')
    } catch {
      alert('Login inválido')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        name="username"
        placeholder="Usuário"
        onChange={e => setForm({ ...form, username: e.target.value })}
        required
        className="border p-2 w-full mb-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Senha"
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full">
        Entrar
      </button>
    </form>
  )
}