import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expenses/expensesSlice';
import commitmentsReducer from './commitments/commitmentsSlice';
import paymentsReducer from './payments/paymentsSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    commitments: commitmentsReducer,
    payments: paymentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;