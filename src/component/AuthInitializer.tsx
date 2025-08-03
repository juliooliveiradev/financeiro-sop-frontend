// src/components/AuthInitializer.tsx
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { login } from '@/store/auth/authSlice'

interface AuthInitializerProps {
  children: React.ReactNode
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userNome = localStorage.getItem('userNome')

    // Se houver um token e nome no localStorage, o usuário estava logado.
    // Restauramos o estado do Redux para que a UI seja renderizada corretamente.
    if (token && userNome) {
      dispatch(login({ nome: userNome }))
    }
  }, [dispatch])

  return <>{children}</>
}