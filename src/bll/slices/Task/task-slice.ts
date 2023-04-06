import {FetchTaskType, GetTasksType, ModelTaskForChangeRequest, TaskItem, tasksApi} from "../../../api/tasks-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, removeTodolist} from "../Todolist/todolist-slice";
import {GeneralResponseType, GetTodolistType} from "../../../api/todolist-api";
import {AxiosResponse} from "axios";
import {RootState} from "../../store";
import {changeIsFetching} from "../App/app-slice";


export const fetchingTasksThunk = createAsyncThunk(
    'tasks/fetchingTasks', async (todolistId: string, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GetTasksType> = await tasksApi.getTasks(todolistId)
            return {tasks: res.data.items, todolistId: todolistId}

        } catch (e) {
            return {tasks: [], todolistId: ''}
        } finally {
            dispatch(changeIsFetching({isFetching: false}))
        }
    }
)

export const addTaskThunk = createAsyncThunk(
    'tasks/addTask', async (arg: {todolistId: string, newTitle: string}, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res: AxiosResponse<GeneralResponseType<TaskItem>> = await tasksApi.createTask(arg.todolistId, arg.newTitle)
            return {todolistId: arg.todolistId, task: res.data.data.item}
        } catch (e) {
            return {todolistId: '', task: {} as FetchTaskType}
        } finally {
            dispatch(changeIsFetching({isFetching: true}))
        }
    }
)

export const removeTaskThunk = createAsyncThunk(
    'tasks/removeTask', async (arg: {todolistId: string, taskId: string}, {dispatch}) => {
        dispatch(changeIsFetching({isFetching: true}))
        try {
            const res = await tasksApi.removeTask(arg.todolistId, arg.taskId)
            return {todolistId: arg.todolistId, taskId: arg.taskId}
        } catch (e) {
            return {todolistId: '', taskId: ''}
        } finally {
            dispatch(changeIsFetching({isFetching: false}))
        }
    }
)

export type DemoModelTaskForChangeRequest = {
    title?: string
    description?: string | null
    deadline?: string | null
    completed?: boolean
    priority?: number
    startDate?: string | null
    status?: number
}

export const changeTaskThunk = createAsyncThunk(
    'tasks/changeTask', async (arg: {todolistId: string, taskId: string ,taskModel: DemoModelTaskForChangeRequest}, {getState}) => {

        const {tasksReducer} = getState() as RootState
        const task = tasksReducer[arg.todolistId].find(el => el.id === arg.taskId)
        let modelTask
        if (task) {
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
            return {todolistId: arg.todolistId, taskId: arg.taskId, taskModel: arg.taskModel}
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
    reducers: {
        addTasksWhenFetchingTodolist: (state, action: PayloadAction<GetTodolistType[]>) => {
            action.payload.forEach((el) => {
                state[el.id] = []
            })
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addTodolist, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(fetchingTasksThunk.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTaskThunk.fulfilled, (state, action) => {
                const task = state[action.payload.todolistId]
                task.unshift(action.payload.task)
            })
            .addCase(removeTaskThunk.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
                if(index !== -1) state[action.payload.todolistId].splice(index, 1)
            })
            .addCase(changeTaskThunk.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(el => el.id === action.payload.taskId)
                if(index !== -1) tasks[index] = {...tasks[index], ...action.payload.taskModel}
            })

    }
})

export const tasksReducer = slice.reducer
export const {addTasksWhenFetchingTodolist} = slice.actions