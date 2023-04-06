import React, {ChangeEvent, useState} from 'react';
import {Button, createStyles, rem, TextInput} from '@mantine/core';

type PropsType = {
    onChangeCallback: (value: string) => void
    label: string
    btnTitle: string
    btnSize: number
}

const useStyles = createStyles((theme, {floating}: { floating: boolean }) => ({
    root: {
        position: 'relative',
        maxWidth: '400px',
    },

    label: {
        position: 'absolute',
        zIndex: 2,
        top: rem(7),
        left: theme.spacing.sm,
        pointerEvents: 'none',
        color: floating
            ? theme.colorScheme === 'dark'
                ? theme.white
                : theme.black
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[3]
                : theme.colors.gray[5],
        transition: 'transform 150ms ease, color 150ms ease, font-size 150ms ease',
        transform: floating ? `translate(-${theme.spacing.sm}, ${rem(-28)})` : 'none',
        fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
        fontWeight: floating ? 500 : 400,
    },

    required: {
        transition: 'opacity 150ms ease',
        opacity: floating ? 1 : 0,
    },

    input: {
        '&::placeholder': {
            transition: 'color 150ms ease',
            color: !floating ? 'transparent' : undefined,
        },
    },
}));

export const SuperInput: React.FC<PropsType> = ({onChangeCallback, label, btnSize,btnTitle}) => {

    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');
    const [error, setError] = useState<null | string>(null)
    const {classes} = useStyles({floating: value.trim().length !== 0 || focused});

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
        setError(null)
    }

    const onClickHandler = () => {
        if(value.trim() === ''){
            setError('Need to write something')
        } else {
            onChangeCallback(value)
            setValue('')
        }
    }

    return (
        <div style={{display: 'flex', gap: '10px', minHeight: '56px', margin: '20px'}}>
            <TextInput
                label={label}
                error={error}
                placeholder={error ? undefined : "Write something..."}
                required
                classNames={classes}
                value={value}
                onChange={onChangeHandler}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                mt="md"
                autoComplete="nope"
                style={{margin: 0}}
            />
            <Button p={btnSize} onClick={onClickHandler}>
                {btnTitle}
            </Button>
        </div>
    );
}





