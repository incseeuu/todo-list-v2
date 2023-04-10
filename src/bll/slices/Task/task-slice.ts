import {createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {createAppAsyncThunk} from "src/bll/slices/common/create-app-async-thunk";
import {FetchTaskType, GetTasksType, TaskItem, tasksApi} from "src/api/tasks-api";
import {appActions} from "src/bll/slices/App/app-slice";
import {handleServerNetworkError} from "src/utils/network-error-handler";
import {GeneralResponseType} from "src/api/todolist-api";
import {statusCodeFromServer} from "src/api/api-common-types";
import {handleErrorFromServer} from "src/utils/server-error-handler";
import {clearAction} from "src/bll/slices/common/clear-action";
import {RootState} from "src/bll/store";
import {todoListThunks} from "src/bll/slices/Todolist/todolist-slice";


const fetchingTasks = createAppAsyncThunk<{ tasks: FetchTaskType[], todolistId: string }, string>(
    'tasks/fetchingTasks', async (todolistId, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GetTasksType> = await tasksApi.getTasks(todolistId)
            if (res.data.error) {
                handleServerNetworkError(res.data.error, dispatch)
                return rejectWithValue(null)
            } else {
                return {tasks: res.data.items, todolistId: todolistId}
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.changeIsFetching({isFetching: false}))
        }
    }
)

const addTask = createAppAsyncThunk<{ todolistId: string, task: FetchTaskType }, {
    todolistId: string,
    newTitle: string
}>(
    'tasks/addTask', async (arg, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<TaskItem>> = await tasksApi.createTask(arg.todolistId, arg.newTitle)
            if(res.data.resultCode === statusCodeFromServer.ok){
                return {todolistId: arg.todolistId, task: res.data.data.item}
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

const removeTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, {
    todolistId: string,
    taskId: string
}>(
    'tasks/removeTask', async (arg, {dispatch, rejectWithValue}) => {
        dispatch(appActions.changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<{}>> = await tasksApi.removeTask(arg.todolistId, arg.taskId)
            if(res.data.resultCode === statusCodeFromServer.ok){
                return {todolistId: arg.todolistId, taskId: arg.taskId}
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

export type DemoModelTaskTypeForServer = {
    title?: string
    description?: string | null
    deadline?: string | null
    completed?: boolean
    priority?: number
    startDate?: string | null
    status?: number
}

type UpdateTaskThunkType = {
    todolistId: string,
    taskId: string,
    taskModel: DemoModelTaskTypeForServer
}

const changeTask =
    createAppAsyncThunk<UpdateTaskThunkType, UpdateTaskThunkType>(
        'tasks/changeTask', async (arg, {getState, rejectWithValue}) => {

            const {tasksReducer} = getState() as RootState
            const task = tasksReducer[arg.todolistId].find(el => el.id === arg.taskId)

            if (task) {
                let modelTask
                modelTask = {
                    title: task.title,
                    status: task.status,
                    deadline: task.deadline,
                    priority: task.priority,
                    startDate: task.startDate,
                    description: task.description,
                    completed: task.completed,
                    ...arg.taskModel
                }

                const res: AxiosResponse<GeneralResponseType<TaskItem>> = await tasksApi.changeTask(arg.todolistId, arg.taskId, modelTask)
                return {todolistId: arg.todolistId, taskId: arg.taskId, taskModel: res.data.data.item}
            } else {
                return rejectWithValue(null)
            }
        }
    )

export type InitialTaskStateType = {
    [key: string]: FetchTaskType[]
}
const initialState: InitialTaskStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(todoListThunks.fetchTodolist.fulfilled, (state, action) => {
                action.payload.forEach((el) => {
                    state[el.id] = []
                })
            })
            .addCase(todoListThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(todoListThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(fetchingTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const task = state[action.payload.todolistId]
                task.unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
                if (index !== -1) state[action.payload.todolistId].splice(index, 1)
            })
            .addCase(changeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(el => el.id === action.payload.taskId)
                if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.taskModel}
            })
            .addCase(clearAction, () => {
                return {}
            })

    }
})

export const tasksReducer = slice.reducer
export const taskThunks = {fetchingTasks, addTask, removeTask, changeTask}