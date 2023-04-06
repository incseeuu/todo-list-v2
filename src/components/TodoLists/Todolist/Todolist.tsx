import React, {useEffect} from 'react';
import {RootState, useAppDispatch} from "../../../bll/store";
import {addTaskThunk, changeTaskThunk, fetchingTasksThunk, removeTaskThunk} from "../../../bll/slices/Task/task-slice";
import {useSelector} from "react-redux";
import {FetchTaskType, TaskStatuses} from "../../../api/tasks-api";
import s from './Todolist.module.css'
import {Button} from "@mantine/core";
import {
    changeFilter,
    changeTodolistThunk,
    FilterType,
    removeTodolistThunk
} from "../../../bll/slices/Todolist/todolist-slice";
import {SuperInput} from "../../../common/components/SuperInput";
import VariableSpan from "../../../common/components/variableSpan";
import {Tasks} from './Tasks/Tasks';


type PropsType = {
    title: string
    todolistId: string
    filter: FilterType
}

export const Todolist: React.FC<PropsType> = ({todolistId, title, filter}) => {

    useEffect(() => {
        dispatch(fetchingTasksThunk(todolistId))
    }, [])

    const dispatch = useAppDispatch()
    const tasks = useSelector<RootState, FetchTaskType[]>((state) => state.tasksReducer[todolistId])

    const removeTodoHandler = () => {
        dispatch(removeTodolistThunk(todolistId))
    }

    const removeTaskCallback = (taskId: string) => {
        dispatch(removeTaskThunk({todolistId, taskId}))
    }

    const changeTodolistCallback = (newTitle: string) => {
        dispatch(changeTodolistThunk({todolistId, title: newTitle}))
    }

    const addTaskHandler = (newTitle: string) => {
        dispatch(addTaskThunk({todolistId, newTitle}))
    }

    const changeTaskStatus = (status: TaskStatuses, taskId: string) => {
        dispatch(changeTaskThunk({todolistId, taskId, taskModel: {status}}))
    }

    const changeTaskTitleCallback = (taskId: string, newTitle: string) => {
        dispatch(changeTaskThunk({todolistId, taskId, taskModel: {title: newTitle}}))
    }

    const filteredTask = () => {
        switch (filter){
            case "InProgress":
                return tasks.filter(el => el.status === TaskStatuses.New)
            case "Completed":
                return tasks.filter(el => el.status === TaskStatuses.Completed)
            default:
                return tasks
        }
        return tasks
    }

    const mappingTasks = filteredTask().map(el => <Tasks key={el.id} removeCallback={removeTaskCallback}
                                                changeStatusCallback={changeTaskStatus} changeTitleCallback={changeTaskTitleCallback} {...el}/>)

    return (
        <div className={s.container}>
            <VariableSpan currentTitle={title} onChangeCallback={changeTodolistCallback}/>
            <Button p={4} style={{height: '20px'}} variant={'white'} onClick={removeTodoHandler}>Remove</Button>
            <SuperInput onChangeCallback={addTaskHandler} btnSize={2} btnTitle={'Add task'}
                        label={'Title for new task'}/>
            {mappingTasks}
            <div className={s.filter}>
                <Button p={12} variant={filter === 'All' ? 'filled' : 'outline'} onClick={() => dispatch(changeFilter({todolistId, filter: 'All'}))}>All</Button>
                <Button p={12} variant={filter === 'InProgress' ? 'filled' : 'outline'} onClick={() => dispatch(changeFilter({todolistId, filter: 'InProgress'}))}>Active</Button>
                <Button p={12} variant={filter === 'Completed' ? 'filled' : 'outline'} onClick={() => dispatch(changeFilter({todolistId, filter: 'Completed'}))}>Completed</Button>
            </div>
        </div>
    )
}