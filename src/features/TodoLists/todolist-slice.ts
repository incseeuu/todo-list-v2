import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {createAppAsyncThunk} from "src/common/slices/create-app-async-thunk";
import {GetTodolistType, todolistApi} from "src/features/TodoLists/Todolist/todolist-api";
import {GeneralResponseType} from "src/features/Login/auth-api";
import {statusCodeFromServer} from "src/common/api/api-common-types";
import {handleErrorFromServer} from "src/common/utils/server-error-handler";
import {clearAction} from "src/common/slices/clear-action";
import {thunkTryCatch} from "src/common/utils/try-catch";


const fetchTodolist = createAppAsyncThunk<GetTodolistType[], void>(
    'todolist/fetchTodolist', async (_, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const res: AxiosResponse<GetTodolistType[]> = await todolistApi.getTodolist()
                return res.data
        })
    }
)

const addTodolist = createAppAsyncThunk<GetTodolistType, string>(
    'todolist/addTodolist', async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res: AxiosResponse<GeneralResponseType<{
                        item: GetTodolistType
                    }>> = await todolistApi.createTodolist(title)
                    if (res.data.resultCode === statusCodeFromServer.ok) {
                        return res.data.data.item
                    } else {
                        handleErrorFromServer(res.data, dispatch)
                        return rejectWithValue(null)
                    }
        })
    }
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, any>(
    'todolist/removeTodolist', async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res: AxiosResponse<GeneralResponseType<{}>> = await todolistApi.removeTodolist(todolistId)
                if (res.data.resultCode === statusCodeFromServer.ok) {
                    return {todolistId}
                } else {
                    handleErrorFromServer(res.data, dispatch)
                    return rejectWithValue(null)
                }
        })
    }
)

type ChangeTodolistThunkType = {
    todolistId: string,
    title: string
}

const changeTodolist = createAppAsyncThunk<ChangeTodolistThunkType, ChangeTodolistThunkType>(
    'todolist/changeTodolist', async (arg, thunkAPI) => {
       const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res: AxiosResponse<GeneralResponseType<{}>> = await todolistApi.changeTodolist(arg.todolistId, arg.title)
                if (res.data.resultCode === statusCodeFromServer.ok) {
                    return arg
                } else {
                    handleErrorFromServer(res.data, dispatch)
                    return rejectWithValue(null)
                }
        })
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