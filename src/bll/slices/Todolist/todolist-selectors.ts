import {RootState} from "src/bll/store";
import {EntityTodoType} from "src/bll/slices/Todolist/todolist-slice";

export const todolistSelector = (state: RootState): EntityTodoType[] => state.todolistReducer