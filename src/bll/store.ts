import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {authReducer} from "./slices/Auth/auth-slice";
import {tasksReducer} from "./slices/Task/task-slice";
import {todolistReducer} from "./slices/Todolist/todolist-slice";
import {appReducer} from "./slices/App/app-slice";

export const store = configureStore({
    reducer: {todolistReducer, tasksReducer, authReducer, appReducer}
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

//@ts-ignore
window.store = store