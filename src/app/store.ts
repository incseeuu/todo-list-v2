import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {appReducer} from "src/app/app-slice";
import {authReducer} from "src/features/Login/auth-slice";
import {tasksReducer} from "src/features/Tasks/task-slice";
import {todolistReducer} from "src/features/TodoLists/todolist-slice";

export const store = configureStore({
    reducer: {todolistReducer, tasksReducer, authReducer, appReducer}
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

//@ts-ignore
window.store = store