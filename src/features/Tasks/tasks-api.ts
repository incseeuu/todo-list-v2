import axios, {AxiosResponse} from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/todo-lists/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c86fcc47-e583-4484-828e-83b5a5d8bf0d'
    }
})

export type GetTasksType = {
    error: null | string
    items: FetchTaskType[]
    totalCount: number
}

export type FetchTaskType = {
    description: string | null
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: null | string
    deadline: null | string
    id: string
    todoListId: string
    order: number
    addedDate: string
    completed: boolean
}

export type ModelTaskForChangeRequest = {
    title: string
    description: string | null
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
    completed: boolean
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

type GeneralResponseType <T>= {
    resultCode: number
    messages: string[],
    data: T
}
export type TaskItem = {
    item: FetchTaskType
}

export const tasksApi = {
    getTasks (todolistId: string){
        return instance.get<GetTasksType, AxiosResponse>(`${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string){
      return instance.post<GeneralResponseType<TaskItem>, AxiosResponse, {title: string}>(`${todolistId}/tasks`, {title})
    },
    changeTask(todolistId: string, taskId: string, updTask: ModelTaskForChangeRequest){
        return instance.put<GeneralResponseType<TaskItem>, AxiosResponse, ModelTaskForChangeRequest>(`${todolistId}/tasks/${taskId}`, updTask)
    },
    removeTask (todolistId: string, taskId: string){
        return instance.delete<GeneralResponseType<{}>, AxiosResponse>(`${todolistId}/tasks/${taskId}`)
    }
}