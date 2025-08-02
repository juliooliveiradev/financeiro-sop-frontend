import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/services/api'


export interface Commitment {
  numero: string
  dataEmpenhoFormatado: string
  valorEmpenhadoFormatado: string
  valor: number
  descricao: string
  despesaId: string
}


export interface CommitmentInput {
  valor: number
  descricao: string
  dataEmpenho: string 
  despesaId: string
}

interface CommitmentsState {
  commitments: Commitment[]
  loading: boolean
  error: string | null
}

const initialState: CommitmentsState = {
  commitments: [],
  loading: false,
  error: null,
}


export const fetchCommitmentsByExpense = createAsyncThunk<
  Commitment[],
  string,
  { rejectValue: string }
>(
  'commitments/fetchByExpense',
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await api.get<Commitment[]>(`/empenhos/despesa?protocolo=${expenseId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar empenhos')
    }
  }
)


export const createCommitment = createAsyncThunk<
  Commitment,
  CommitmentInput,
  { rejectValue: string }
>(
  'commitments/create',
  async (newCommitmentData, { rejectWithValue }) => {
    try {
      const response = await api.post<Commitment>('/empenhos', newCommitmentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao criar empenho')
    }
  }
)


export const deleteCommitment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'commitments/delete',
  async (commitmentId, { rejectWithValue }) => {
    try {
      await api.delete(`/empenhos/${commitmentId}`)
      return commitmentId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao deletar empenho')
    }
  }
)

const commitmentsSlice = createSlice({
  name: 'commitments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommitmentsByExpense.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommitmentsByExpense.fulfilled, (state, action: PayloadAction<Commitment[]>) => {
        state.commitments = action.payload
        state.loading = false
      })
      .addCase(fetchCommitmentsByExpense.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Erro desconhecido ao buscar empenhos'
      })
      .addCase(createCommitment.fulfilled, (state, action: PayloadAction<Commitment>) => {
        state.commitments.push(action.payload)
        state.error = null
      })
      .addCase(createCommitment.rejected, (state, action) => {
        state.error = action.payload ?? 'Erro desconhecido ao criar empenho'
      })
      .addCase(deleteCommitment.fulfilled, (state, action: PayloadAction<string>) => {
        state.commitments = state.commitments.filter((c) => c.numero !== action.payload)
        state.error = null
      })
      .addCase(deleteCommitment.rejected, (state, action) => {
        state.error = action.payload ?? 'Erro desconhecido ao deletar empenho'
      })
  },
})

export default commitmentsSlice.reducer
