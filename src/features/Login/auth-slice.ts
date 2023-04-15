import {createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {createAppAsyncThunk} from "src/common/slices/create-app-async-thunk";
import {authApi, AuthGetResponseType, GeneralResponseType} from "src/features/Login/auth-api";
import {statusCodeFromServer} from "src/common/api/api-common-types";
import {handleServerNetworkError} from "src/common/utils/network-error-handler";
import {appActions} from "src/app/app-slice";
import {handleErrorFromServer} from "src/common/utils/server-error-handler";
import {clearAction} from "src/common/slices/clear-action";



type ReturnValueAuthThunks = {
    isAuth: boolean
}

const authMe = createAppAsyncThunk<ReturnValueAuthThunks, void>(
    'auth/authMe', async (_, {dispatch, rejectWithValue}) => {
        try {
            const res: AxiosResponse<GeneralResponseType<AuthGetResponseType>> = await authApi.me()
            if (res.data.resultCode === statusCodeFromServer.ok) {
                return {isAuth: true}
            } else {
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.changeInitialized({value: true}))
        }
    }
)

export const login = createAppAsyncThunk<ReturnValueAuthThunks, AboutUserType>(
    'auth/login', async (arg, {dispatch, rejectWithValue}) => {
        try {
            const res: AxiosResponse<GeneralResponseType<{ userId: number }>> = await authApi.login(arg)
            if (res.data.resultCode === statusCodeFromServer.ok) {
                dispatch(appActions.changeInitialized({value: false}))
                return {isAuth: true}
            } else {
                handleErrorFromServer(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            setTimeout(() => {
                dispatch(appActions.changeInitialized({value: true}))
            }, 1000)
        }

    }
)

export const logout = createAppAsyncThunk<ReturnValueAuthThunks, void>(
    'auth/logout', async (_, {dispatch, rejectWithValue}) => {
        try {
            const res: AxiosResponse<GeneralResponseType<{}>> = await authApi.logout()
            if (res.data.resultCode === statusCodeFromServer.ok) {
                dispatch(appActions.changeInitialized({value: false}))
                dispatch(clearAction())
                return {isAuth: false}
            } else {
                handleErrorFromServer(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            setTimeout(() => {
                dispatch(appActions.changeInitialized({value: true}))
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
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(authMe.fulfilled, (state, action) => {
                state.isAuth = action.payload.isAuth
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuth = action.payload.isAuth
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isAuth = action.payload.isAuth
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {authMe, login, logout}
