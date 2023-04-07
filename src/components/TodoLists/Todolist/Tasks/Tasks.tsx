import React from 'react';
import {Button, Checkbox} from "@mantine/core";
import s from './Task.module.css'
import {TaskStatuses} from "src/api/tasks-api";
import VariableSpan from "../../../../common/components/variableSpan";

type PropsType = {
    title: string
    id: string
    status: TaskStatuses
    removeCallback: (taskId: string) => void
    changeStatusCallback: (status: TaskStatuses, taskId: string) => void
    changeTitleCallback: (taskId: string, newTitle: string) => void
}

export const Tasks: React.FC<PropsType> = ({title, removeCallback, id, status, changeStatusCallback, changeTitleCallback}) => {



    const onClickRemoveHandler = () => {
        removeCallback(id)
    }

    const onChangeStatusHandler = () => {
        const newStatus: TaskStatuses = status === TaskStatuses.New ? TaskStatuses.Completed : TaskStatuses.New
        changeStatusCallback(newStatus, id)
    }

    const changeTitleHandler = (newTitle: string) => {
        changeTitleCallback(id, newTitle)
    }

    return (
        <div className={s.taskContainer}>
            <Checkbox checked={status === 2} onChange={onChangeStatusHandler}/>
            <VariableSpan currentTitle={title} onChangeCallback={changeTitleHandler}/>
            <Button
                p={4}
                style={{height: '20px'}}
                variant={'white'}
                onClick={onClickRemoveHandler}
            >x</Button>
        </div>
    );
};
