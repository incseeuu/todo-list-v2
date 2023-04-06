import React, {useEffect} from 'react';
import {todolistSelector} from "../../bll/slices/Todolist/todolist-selectors";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../bll/store";
import {addTodolistThunk, fetchTodolist} from "../../bll/slices/Todolist/todolist-slice";
import {Container, Grid, Skeleton} from '@mantine/core';
import {Todolist} from './Todolist/Todolist';
import {SuperInput} from "../../common/components/SuperInput";
import s from './Todolists.module.css'
import {authSelector} from "../../bll/slices/Auth/auth-selector";
import {authMeThunk} from "../../bll/slices/Auth/auth-slice";
import {Navigate, useNavigate} from "react-router-dom";

const TodoLists = () => {

    const todoLists = useSelector(todolistSelector)
    const {isAuth} = useSelector(authSelector)
    const dispatch = useAppDispatch()



    useEffect(() => {
        if(isAuth){
            dispatch(fetchTodolist())
        } else {
            dispatch(authMeThunk())
        }
    }, [])


    const onChangeCallbackForNewTodolistTitle = (value: string) => {
        dispatch(addTodolistThunk(value))
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