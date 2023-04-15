import {CloseButton, Group, Paper, Text} from '@mantine/core';
import {useSelector} from "react-redux";

import {useEffect} from "react";
import {appSelector} from "src/app/app-selector";
import {useAppDispatch} from "src/app/store";
import {appActions} from "src/app/app-slice";


export function AlertMessage() {

    const {errorMessageWhenFetching} = useSelector(appSelector)
    const dispatch = useAppDispatch()

    const onClickCloseHandler = () => {
        dispatch(appActions.changeErrorMessage({value: null}))
    }
    useEffect(() => {
        if(errorMessageWhenFetching){
            setTimeout(() => {
                dispatch(appActions.changeErrorMessage({value: null}))
            }, 4000)
        }
    }, [errorMessageWhenFetching])

    return ( errorMessageWhenFetching !== null ?
        <Paper withBorder p="lg" radius="md" shadow="md" mb={20} style={{minWidth: '30%', position: 'fixed', bottom: '0'}}>
            <Group position="apart" mb="xs">
                <Text fz="md" fw={500} color='red'>
                    {errorMessageWhenFetching}
                </Text>
                <CloseButton mr={-9} onClick={onClickCloseHandler}/>
            </Group>
        </Paper>
            : null
    );
}