// app/Provider.tsx

'use client';

import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { AuthInitializer } from '@/component/AuthInitializer'; // Importe aqui

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer> {/* Adicione o AuthInitializer aqui */}
        {children}
      </AuthInitializer>
    </Provider>
  );
}