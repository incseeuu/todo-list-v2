import React, { ChangeEvent } from 'react';
import {TextInput} from "@mantine/core";

type PropsType = {
    currentTitle: string
    onChangeCallback: (newTitle: string) => void
}

const VariableSpan: React.FC<PropsType> = ({currentTitle,onChangeCallback}) => {

    const [newTitle, setNewTitle] = React.useState(currentTitle)
    const [editMode, setEditMode] = React.useState(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    const onDoubleClickHandler = () => {
        setEditMode(true)
    }

    const onBlurHandler = () => {
        onChangeCallback(newTitle)
        setEditMode(false)
    }

    return ( !editMode
            ? <span onDoubleClick={onDoubleClickHandler}>{currentTitle}</span>
            : <TextInput value={newTitle} onChange={onChangeHandler} onBlur={onBlurHandler} autoFocus/>
    );
};

export default VariableSpan;