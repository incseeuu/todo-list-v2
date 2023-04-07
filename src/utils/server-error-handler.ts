import {GeneralResponseType} from "src/api/auth-api";
import {Dispatch} from "@reduxjs/toolkit";
import {appActions} from "src/bll/slices/App/app-slice";

export const handleErrorFromServer = <T>(data: GeneralResponseType<T>, dispatch: Dispatch) => {
    if(data.messages.length){
        dispatch(appActions.changeErrorMessage({value: data.messages[0]}))
    } else {
        dispatch(appActions.changeErrorMessage({value: 'Something went wrong'}))
    }
    dispatch(appActions.changeIsFetching({isFetching: false}))
}