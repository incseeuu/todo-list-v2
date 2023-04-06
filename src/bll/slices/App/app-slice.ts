import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {boolean} from "yup";

const initialState = {
    isInitialized: false,
    isFetching: false
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        changeInitialized: (state, action: PayloadAction<{value: boolean}>) => {
            state.isInitialized = action.payload.value
        },
        changeIsFetching: (state, action: PayloadAction<{ isFetching: boolean }>) => {
            state.isFetching = action.payload.isFetching
        }
    }
})

export const appReducer = slice.reducer
export const { changeInitialized, changeIsFetching} = slice.actions