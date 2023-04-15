import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {Container, Grid, Skeleton} from '@mantine/core';
import {Todolist} from 'src/features/TodoLists/Todolist/Todolist';
import s from 'src/features/TodoLists/Todolist/Todolists.module.css'
import {Navigate} from "react-router-dom";
import {todolistSelector} from "src/features/TodoLists/todolist-selectors";
import {authSelector} from "src/features/Login/auth-selector";
import {useAppDispatch} from "src/app/store";
import {todoListThunks} from "src/features/TodoLists/todolist-slice";
import {authThunks} from "src/features/Login/auth-slice";
import {SuperInput} from "src/common/components/SuperInput";



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