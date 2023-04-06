import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GeneralResponseType, GetTodolistType, todolistApi} from "../../../api/todolist-api";
import {AxiosResponse} from "axios";
import {addTasksWhenFetchingTodolist} from "../Task/task-slice";
import {changeIsFetching} from "../App/app-slice";

export const fetchTodolist = createAsyncThunk(
    'todolist/fetchTodolist', async (_, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GetTodolistType[]> = await todolistApi.getTodolist()
            dispatch(addTasksWhenFetchingTodolist(res.data))
            return res.data

        } catch (e) {
            return []
        } finally {
            dispatch(changeIsFetching({isFetching: false}))
        }
    }
)

export const addTodolistThunk = createAsyncThunk(
    'todolist/addTodolist', async (title: string, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{
                item: GetTodolistType
            }>> = await todolistApi.createTodolist(title)
            dispatch(addTodolist(res.data.data.item))
        } catch (e) {

        } finally {
            dispatch(changeIsFetching({isFetching: false}))
        }
    }
)

export const removeTodolistThunk = createAsyncThunk(
    'todolist/removeTodolist', async (todolistId: string, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{}>> = await todolistApi.removeTodolist(todolistId)
            dispatch(removeTodolist({todolistId}))
        } catch (e) {

        } finally {
            dispatch(changeIsFetching({isFetching: false}))
        }
    }
)

export const changeTodolistThunk = createAsyncThunk(
    'todolist/changeTodolist', async (arg: { todolistId: string, title: string }, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{}>> = await todolistApi.changeTodolist(arg.todolistId, arg.title)
            dispatch(changeTodolist(arg))
        } catch (e) {

        } finally {
            dispatch(changeIsFetching({isFetching: false}))
        }
    }
)

export type FilterType = 'All' | 'Completed' | 'InProgress'

export type EntityTodoType = GetTodolistType & {
    filter: FilterType
}

const initialState: EntityTodoType[] = []

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {
        addTodolist: (state, action: PayloadAction<GetTodolistType>) => {
            state.unshift({...action.payload, filter: 'All'})
        },
        removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)

        },
        changeTodolist: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            const item = state.find(el => el.id === action.payload.todolistId)
            if (item) item.title = action.payload.title
        },
        changeFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterType }>) => {
            const todolist = state.find(el => el.id === action.payload.todolistId)
            if (todolist) todolist.filter = action.payload.filter
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolist.fulfilled, (state, action: PayloadAction<GetTodolistType[]>) => {
            return action.payload.map(el => ({...el, filter: 'All'}))
        })
    }
})

export const {addTodolist, changeFilter, removeTodolist, changeTodolist} = slice.actions
export const todolistReducer = slice.reducer