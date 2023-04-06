import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
} from '@mantine/core';
import {SubmitHandler, useForm } from 'react-hook-form';
import  * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import {ErrorMessage} from "@hookform/error-message";
import './Login.module.css'
import {Navigate} from "react-router-dom";
import React from "react";
import {useSelector} from "react-redux";
import {authSelector} from "../../bll/slices/Auth/auth-selector";
import {useAppDispatch} from "../../bll/store";
import {loginThunk} from "../../bll/slices/Auth/auth-slice";

const useStyles = createStyles((theme) => ({
    wrapper: {
        maxHeight: '100vh',
        maxWidth: '100vw',
        backgroundSize: "70%",
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
            'url(https://wallpapercrafter.com/sizes/2560x1440/74537-artist-artwork-digital-art-hd-artstation.jpg)',
    },

    form: {
        borderRight: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
        maxHeight: '100vh',
        minHeight: '70vh',
        maxWidth: rem(450),
        paddingTop: rem(80),

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));


const schema = yup.object({
    email: yup.string().email('Не допустимый email адрес').required('Это поле обязательное!'),
    password: yup.string()
        .required('Это поле обязательное!')
        .min(8, 'Пароль должен состоять минимум из 8 символов')
        .max(16, 'Пароль может быть больше 16 символов :(')
        .matches(/^(?=.*[A-Z])[a-zA-Z0-9]*$/, 'Некорректный пароль :('),
    rememberMe: yup.boolean()
})
type FormData = {
    email: string,
    password: string,
    rememberMe: boolean
}

export const Login = () => {

    const {isAuth} = useSelector(authSelector)
    const dispatch = useAppDispatch()

    const { classes } = useStyles();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        mode: "onBlur",
        resolver: yupResolver(schema)
    });
    const onSubmit: SubmitHandler<FormData> = (data) => dispatch(loginThunk(data));

    if(isAuth){
        return <Navigate to={'/'}/>
    }

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Welcome back to In-TodoList!
                </Title>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput label="Email address" placeholder="hello@gmail.com" size="md" {...register('email')} />
                    <ErrorMessage errors={errors} name='email' as='p' />

                    <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" {...register('password')} />
                    <ErrorMessage errors={errors} name='password' as='p' />

                    <Checkbox label="Keep me logged in" mt="xl" size="md" color='violet' {...register('rememberMe')}/>
                    <Button type='submit' fullWidth mt="xl" size="md" color='violet' >
                        Login
                    </Button>
                </form>

                <Text ta="center" mt="md">
                    Don&apos;t have an account?{' '}
                    <Anchor<'a'> href="https://social-network.samuraijs.com/signUp" target='_blank' weight={500}>
                        Register
                    </Anchor>
                </Text>
            </Paper>
        </div>
    );
}