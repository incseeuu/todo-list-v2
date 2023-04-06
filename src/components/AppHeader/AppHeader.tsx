import {useState} from 'react';
import {Burger, Button, Container, createStyles, Group, Header, rem,} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useAppDispatch} from "../../bll/store";
import {logoutThunk} from "../../bll/slices/Auth/auth-slice";
import {useSelector} from "react-redux";
import {authSelector} from "../../bll/slices/Auth/auth-selector";
import FetchLoader from "../../common/components/FetchLoader/FetchLoader";
import {appSelector} from "../../bll/slices/App/app-selector";
import logo from "../../assets/logo-color.png"


const HEADER_HEIGHT = rem(60);



const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
        zIndex: 1,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    }
}));

interface HeaderResponsiveProps {
    links: { link: string; label: string }[];
}

export function AppHeader({ links }: HeaderResponsiveProps) {
    const dispatch = useAppDispatch()
    const {isAuth} = useSelector(authSelector)
    const {isFetching} = useSelector(appSelector)

    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            target='_blank'
            className={cx(classes.link)}
        >
            {link.label}
        </a>
    ));

    const logOutHandler = () => {
        dispatch(logoutThunk())
    }

    return (
        <Header height={HEADER_HEIGHT} mb={60} className={classes.root}>
            <Container className={classes.header}>
                <img src={logo} alt={'logo'} style={{width: '150px', height: '120px'}}/>
                <Group spacing={5} className={classes.links}>
                    {items}
                    {isAuth && <Button onClick={logOutHandler}>Logout</Button>}
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
            </Container>
            {isFetching && <FetchLoader/>}
        </Header>
    );
}