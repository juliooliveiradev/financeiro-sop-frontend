import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expenses/expensesSlice';
import commitmentsReducer from './commitments/commitmentsSlice';
import paymentsReducer from './payments/paymentsSlice';
import authReducer from './auth/authSlice'

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    commitments: commitmentsReducer,
    payments: paymentsReducer,
     auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;