import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isInitialized: false,
    isFetching: false,
    errorMessageWhenFetching: null as null | string
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        changeInitialized: (state, action: PayloadAction<{value: boolean}>) => {
            state.isInitialized = action.payload.value
        },
        changeIsFetching: (state, action: PayloadAction<{isFetching: boolean}>) => {
            state.isFetching = action.payload.isFetching
        },
        changeErrorMessage: (state, action: PayloadAction<{value: string | null}>) => {
            state.errorMessageWhenFetching = action.payload.value
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions