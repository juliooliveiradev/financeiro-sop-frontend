import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';


export interface Expense {
  protocolo: string;
  tipo: 'Obra de Edificação' | 'Obra de Rodovias' | 'Outros';
  dataProtocoloFormatado: string;
  dataVencimentoFormatado: string;
  credor: string;
  descricao: string;
  valorFormatado: string;
  status?: string;
}

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
};

export interface ExpenseInput {
  protocolo: string;
  tipo: 'Obra de Edificação' | 'Obra de Rodovias' | 'Outros';
  dataProtocolo: string;
  dataVencimento: string;
  credor: string;
  descricao: string;
  valor: string;
}


export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  const response = await api.get<Expense[]>('/despesas');
  return response.data;
});


export const createExpense = createAsyncThunk(
  'expenses/create',
  async (newExpense: ExpenseInput, { rejectWithValue }) => {
    try {
      const response = await api.post<Expense>('/despesas', newExpense);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (protocolo: string, { rejectWithValue }) => {
    try {
      await api.get(`/despesas?protocolo=${encodeURIComponent(protocolo)}`);
      return protocolo;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchById',
  async (protocolo: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Expense[]>('/despesas/buscar', {
        params: { protocolo }
      });

      if (!response.data.length) throw new Error('Despesa não encontrada');
      return response.data[0]; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar despesa');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao buscar despesas.';
      })
      .addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.expenses.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<string>) => {
        state.expenses = state.expenses.filter((d) => d.protocolo !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default expensesSlice.reducer;
