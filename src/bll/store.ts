import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "src/bll/slices/Auth/auth-slice";
import {appReducer} from "src/bll/slices/App/app-slice";
import {tasksReducer} from "src/bll/slices/Task/task-slice";
import {todolistReducer} from "src/bll/slices/Todolist/todolist-slice";
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: {todolistReducer, tasksReducer, authReducer, appReducer}
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

//@ts-ignore
window.store = store