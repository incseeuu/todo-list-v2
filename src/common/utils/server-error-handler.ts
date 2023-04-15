import {Dispatch} from "@reduxjs/toolkit";
import {GeneralResponseType} from "src/features/Login/auth-api";
import {appActions} from "src/app/app-slice";



export const handleErrorFromServer = <T>(data: GeneralResponseType<T>, dispatch: Dispatch) => {
    if(data.messages.length){
        dispatch(appActions.changeErrorMessage({value: data.messages[0]}))
    } else {
        dispatch(appActions.changeErrorMessage({value: 'Something went wrong'}))
    }
    dispatch(appActions.changeIsFetching({isFetching: false}))
}