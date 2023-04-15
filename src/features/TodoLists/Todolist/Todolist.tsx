import React, {useEffect} from 'react';
import {RootState, useAppDispatch} from "src/app/store";
import {useSelector} from "react-redux";
import {FetchTaskType, TaskStatuses} from "src/features/Tasks/tasks-api";
import s from 'src/features/TodoLists/Todolist/Todolist.module.css'
import {Button} from "@mantine/core";

import {SuperInput} from "src/common/components/SuperInput";
import {Tasks} from 'src/features/Tasks/Tasks';
import {FilterType, todoListActions, todoListThunks} from "src/features/TodoLists/todolist-slice";
import {taskThunks} from "src/features/Tasks/task-slice";
import VariableSpan from "src/common/components/variableSpan";


type PropsType = {
    title: string
    todolistId: string
    filter: FilterType
}

export const Todolist: React.FC<PropsType> = ({todolistId, title, filter}) => {

    useEffect(() => {
        dispatch(taskThunks.fetchingTasks(todolistId))
    }, [])

    const dispatch = useAppDispatch()
    const tasks = useSelector<RootState, FetchTaskType[]>((state) => state.tasksReducer[todolistId])

    const removeTodoHandler = () => {
        dispatch(todoListThunks.removeTodolist(todolistId))
    }

    const removeTaskCallback = (taskId: string) => {
        dispatch(taskThunks.removeTask({todolistId, taskId}))
    }

    const changeTodolistCallback = (newTitle: string) => {
        dispatch(todoListThunks.changeTodolist({todolistId, title: newTitle}))
    }

    const addTaskHandler = (newTitle: string) => {
        dispatch(taskThunks.addTask({todolistId, newTitle}))
    }

    const changeTaskStatus = (status: TaskStatuses, taskId: string) => {
        dispatch(taskThunks.changeTask({todolistId, taskId, taskModel: {status}}))
    }

    const changeTaskTitleCallback = (taskId: string, newTitle: string) => {
        dispatch(taskThunks.changeTask({todolistId, taskId, taskModel: {title: newTitle}}))
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
                <Button p={12} variant={filter === 'All' ? 'filled' : 'outline'} onClick={() => dispatch(todoListActions.changeFilter({todolistId, filter: 'All'}))}>All</Button>
                <Button p={12} variant={filter === 'InProgress' ? 'filled' : 'outline'} onClick={() => dispatch(todoListActions.changeFilter({todolistId, filter: 'InProgress'}))}>Active</Button>
                <Button p={12} variant={filter === 'Completed' ? 'filled' : 'outline'} onClick={() => dispatch(todoListActions.changeFilter({todolistId, filter: 'Completed'}))}>Completed</Button>
            </div>
        </div>
    )
}