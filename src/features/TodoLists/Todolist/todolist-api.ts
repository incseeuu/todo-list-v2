import axios, {AxiosResponse} from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/todo-lists/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c86fcc47-e583-4484-828e-83b5a5d8bf0d'
    }
})

export type GeneralResponseType <T>= {
    resultCode: number
    messages: string[],
    data: T
}

export type GetTodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}



export const todolistApi = {
    getTodolist (){
        return instance.get<GetTodolistType[], AxiosResponse>('')
    },
    createTodolist (title: string){
        return instance.post<GeneralResponseType<{item: GetTodolistType}>, AxiosResponse>('', {title})
    },
    changeTodolist (todolistId: string, newTitle: string){
        return instance.put<GeneralResponseType<{}>, AxiosResponse>(`${todolistId}`, {title: newTitle})
    },
    removeTodolist (todolistId: string){
        return instance.delete<GeneralResponseType<{}>, AxiosResponse>(`${todolistId}`)
    }
}