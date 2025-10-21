import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@services/auth';
import { AuthBody, User } from 'types/user';
import Cookies from 'js-cookie';

// Estado inicial
interface AuthState {
  token: string;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: Cookies.get('token') || '',
  user: (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  })(),
  loading: false,
  error: null,
};

// Async thunk para login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (body: AuthBody, { rejectWithValue }) => {
    try {
      const response = await authService.login(body);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = '';
      state.user = null;
      state.error = null;
      state.loading = false;
      
      // Limpiar almacenamiento
      Cookies.remove('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          email: action.payload.email,
          name: action.payload.name,
        };
        
        // Persistir datos
        localStorage.setItem('user', JSON.stringify({
          email: action.payload.email,
          name: action.payload.name,
        }));
        Cookies.set('token', action.payload.token, { expires: 7 });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
