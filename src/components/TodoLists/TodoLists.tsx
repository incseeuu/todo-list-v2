import React, {useEffect} from 'react';
import {todolistSelector} from "src/bll/slices/Todolist/todolist-selectors";
import {useSelector} from "react-redux";
import {useAppDispatch} from "src/bll/store";
import {Container, Grid, Skeleton} from '@mantine/core';
import {Todolist} from './Todolist/Todolist';
import {SuperInput} from "src/common/components/SuperInput";
import s from './Todolists.module.css'
import {authSelector} from "src/bll/slices/Auth/auth-selector";
import {Navigate} from "react-router-dom";
import {todoListThunks} from "src/bll/slices/Todolist/todolist-slice";
import {authThunks} from "src/bll/slices/Auth/auth-slice";

const TodoLists = () => {

    const todoLists = useSelector(todolistSelector)
    const {isAuth} = useSelector(authSelector)
    const dispatch = useAppDispatch()



    useEffect(() => {
        if(isAuth){
            dispatch(todoListThunks.fetchTodolist())
        } else {
            dispatch(authThunks.authMe())
        }
    }, [])


    const onChangeCallbackForNewTodolistTitle = (value: string) => {
        dispatch(todoListThunks.addTodolist(value))
    }
    console.log(isAuth)


    const mappingTodoLists = todoLists.map((el, index) => {
        return todoLists.length === 0
            ? <Grid.Col key={el.id} xs={4}><Skeleton height={140} radius="md" animate={true}/></Grid.Col>
            : <Grid.Col key={el.id} xs={4}><Todolist key={index} todolistId={el.id} title={el.title} filter={el.filter}/></Grid.Col>
    })


    if(!isAuth){
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <div className={s.addContainer}>
                <SuperInput onChangeCallback={onChangeCallbackForNewTodolistTitle} btnTitle={'Add ToDo'} btnSize={12} label={'Title for new todo'}/>
            </div>
            <Container my="md">
                <Grid>
                    {mappingTodoLists}
                </Grid>
            </Container>
        </>


    );
};

export default TodoLists;