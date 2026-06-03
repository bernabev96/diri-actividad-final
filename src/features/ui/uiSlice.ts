import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Locale = 'es' | 'en';

type UiState = {
  locale: Locale;
  globalError: string | null;
};

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en';
}

function getInitialLocale(): Locale {
  const storedLocale = localStorage.getItem('gymqueue.locale');
  return isLocale(storedLocale) ? storedLocale : 'es';
}

const initialState: UiState = {
  locale: getInitialLocale(),
  globalError: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
    },
    setGlobalError(state, action: PayloadAction<string | null>) {
      state.globalError = action.payload;
    },
  },
});

export const { setLocale, setGlobalError } = uiSlice.actions;
export default uiSlice.reducer;
