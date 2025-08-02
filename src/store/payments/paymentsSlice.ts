import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/services/api'


export interface PaymentCreateDTO {
  data: string
  valor: number
  observacao: string
  empenhoId: string
}


export interface Payment {
  numero: string
  dataPagamentoFormatado: string
  valorPagoFormatado: string
  observacao: string
  empenhoId: string
}

interface PaymentsState {
  payments: Payment[]
  loading: boolean
  error: string | null
}

const initialState: PaymentsState = {
  payments: [],
  loading: false,
  error: null,
}


export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (newPaymentData: PaymentCreateDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<Payment>('/pagamentos', newPaymentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao criar pagamento')
    }
  }
)


export const fetchPaymentsByCommitment = createAsyncThunk(
  'payments/fetchByCommitment',
  async (commitmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Payment[]>(`/pagamentos/empenho/${commitmentId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar pagamentos')
    }
  }
)

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.payments.push(action.payload)
      })
      .addCase(fetchPaymentsByCommitment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentsByCommitment.fulfilled, (state, action: PayloadAction<Payment[]>) => {
        state.loading = false
        state.payments = action.payload
      })
      .addCase(fetchPaymentsByCommitment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default paymentsSlice.reducer
