import { Dispatch } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import {appActions} from "src/app/app-slice";


export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(appActions.changeErrorMessage({value: error}))
    } else {
        dispatch(appActions.changeErrorMessage({value: `Native error ${err.message}`}))
    }
    dispatch(appActions.changeErrorMessage({value: 'failed'}))
}