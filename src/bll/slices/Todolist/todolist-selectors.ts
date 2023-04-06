import {GetTodolistType} from "../../../api/todolist-api";
import {RootState} from "../../store";
import {EntityTodoType} from "./todolist-slice";

export const todolistSelector = (state: RootState): EntityTodoType[] => state.todolistReducer