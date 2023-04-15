import {RootState} from "src/app/store";
import {EntityTodoType} from "src/features/TodoLists/todolist-slice";


export const todolistSelector = (state: RootState): EntityTodoType[] => state.todolistReducer