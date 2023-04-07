import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authApi, AuthGetResponseType, GeneralResponseType} from "../../../api/auth-api";
import {AxiosResponse} from "axios";
import {changeInitialized} from "../App/app-slice";
import {boolean} from "yup";
import {clearAction} from "../common/clear-action";


export const authMeThunk = createAsyncThunk(
    'auth/authMe', async (_, {dispatch}) => {
        try {
            const res: AxiosResponse<GeneralResponseType<AuthGetResponseType>> = await authApi.me()
            if (res.data.resultCode === 0) {
                dispatch(changeIsAuth({isAuth: true}))
            }
        } catch (e) {

        } finally {
            dispatch(changeInitialized({value: true}))
        }
    }
)

export const loginThunk = createAsyncThunk(
    'auth/login', async (arg: AboutUserType, {dispatch}) => {
        try {
            const res: AxiosResponse<GeneralResponseType<{ userId: number }>> = await authApi.login(arg)
            if (res.data.resultCode === 0) {
                dispatch(changeInitialized({value: false}))
                dispatch(changeIsAuth({isAuth: true}))
            }
        } catch (e) {

        } finally {
            setTimeout(() => {
                dispatch(changeInitialized({value: true}))
            }, 1000)
        }

    }
)

export const logoutThunk = createAsyncThunk(
    'auth/logout', async (_, {dispatch}) => {
        try {
            const res = await authApi.logout()
            dispatch(changeIsAuth({isAuth: false}))
            dispatch(changeInitialized({value: false}))
            dispatch(clearAction())
        } catch (e) {

        } finally {
            setTimeout(() => {
                dispatch(changeInitialized({value: true}))
            }, 1000)
        }
    }
)


export type AboutUserType = {
    email: string,
    password: string,
    rememberMe: boolean
}

const initialState = {
    aboutUser: {} as AboutUserType,
    isAuth: false
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeIsAuth: (state, action: PayloadAction<{ isAuth: boolean }>) => {
            state.isAuth = action.payload.isAuth
        }
    }
})

export const authReducer = slice.reducer
export const {changeIsAuth} = slice.actions

