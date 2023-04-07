import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GeneralResponseType, GetTodolistType, todolistApi} from "src/api/todolist-api";
import {AxiosResponse} from "axios";
import {createAppAsyncThunk} from "src/bll/slices/common/create-app-async-thunk";
import {appActions} from "src/bll/slices/App/app-slice";
import {handleServerNetworkError} from "src/utils/network-error-handler";
import {clearAction} from "src/bll/slices/common/clear-action";
import {statusCodeFromServer} from "src/api/api-common-types";
import {handleErrorFromServer} from "src/utils/server-error-handler";


const fetchTodolist = createAppAsyncThunk<GetTodolistType[], void>(
    'todolist/fetchTodolist', async (_, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GetTodolistType[]> = await todolistApi.getTodolist()
            // dispatch(taskActions.addTasksWhenFetchingTodolist(res.data))
            return res.data
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.changeIsFetching({isFetching: false}))
        }
    }
)

const addTodolist = createAppAsyncThunk<GetTodolistType, string>(
    'todolist/addTodolist', async (title, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{
                item: GetTodolistType
            }>> = await todolistApi.createTodolist(title)
            if (res.data.resultCode === statusCodeFromServer.ok) {
                return res.data.data.item
            } else {
                handleErrorFromServer(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.changeIsFetching({isFetching: false}))
        }
    }
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, any>(
    'todolist/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{}>> = await todolistApi.removeTodolist(todolistId)
            if (res.data.resultCode === statusCodeFromServer.ok) {
                return {todolistId}
            } else {
                handleErrorFromServer(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.changeIsFetching({isFetching: false}))
        }
    }
)

type ChangeTodolistThunkType = {
    todolistId: string,
    title: string
}

const changeTodolist = createAppAsyncThunk<ChangeTodolistThunkType, ChangeTodolistThunkType>(
    'todolist/changeTodolist', async (arg, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{}>> = await todolistApi.changeTodolist(arg.todolistId, arg.title)
            if (res.data.resultCode === statusCodeFromServer.ok) {
                return arg
            } else {
                handleErrorFromServer(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.changeIsFetching({isFetching: false}))
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
        changeFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterType }>) => {
            const todolist = state.find(el => el.id === action.payload.todolistId)
            if (todolist) todolist.filter = action.payload.filter
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolist.fulfilled, (state, action) => {
                return action.payload.map(el => ({...el, filter: 'All'}))
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload, filter: 'All'})
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(el => el.id === action.payload.todolistId)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(changeTodolist.fulfilled, (state, action) => {
                const item = state.find(el => el.id === action.payload.todolistId)
                if (item) item.title = action.payload.title
            })
            .addCase(clearAction, () => {
                return []
            })
    }
})

export const todoListActions = slice.actions
export const todolistReducer = slice.reducer
export const todoListThunks = {fetchTodolist, addTodolist, removeTodolist, changeTodolist}