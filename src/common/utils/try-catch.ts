import {appActions} from "src/app/app-slice";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, RootState} from "src/app/store";
import {handleServerNetworkError} from "src/common/utils/network-error-handler";

export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<RootState, any, AppDispatch, null>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.changeIsFetching({isFetching: true}))
    try {
        return await logic()
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        // в handleServerNetworkError можно удалить убирани крутилки
        dispatch(appActions.changeIsFetching({isFetching: false}))
    }
}