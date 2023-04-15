import axios, { AxiosResponse } from 'axios'
import {AboutUserType} from "src/features/Login/auth-slice";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/auth/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c86fcc47-e583-4484-828e-83b5a5d8bf0d'
    }
})

export type AuthGetResponseType = {
    id: number
    email: string
    login: string
}

export type GeneralResponseType <T>= {
    resultCode: number
    messages: string[],
    data: T
}

export const authApi = {
    me(){
        return instance.get<GeneralResponseType<AuthGetResponseType>, AxiosResponse>('me')
    },
    login(obj: AboutUserType){
        return instance.post<GeneralResponseType<{ userId: number }>, AxiosResponse, AboutUserType>('login', obj)
    },
    logout(){
        return instance.delete<GeneralResponseType<{}>, AxiosResponse>('login')
    }
}