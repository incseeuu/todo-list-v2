import './App.css'
import {Route, Routes} from "react-router-dom";
import TodoLists from "./components/TodoLists/TodoLists";
import {AppHeader} from "./components/AppHeader/AppHeader";
import {Login} from './components/Login/Login';
import {useSelector} from "react-redux";
import {appSelector} from "./bll/slices/App/app-selector";
import Preloader from "./common/components/Preloader/Preloader";
import {useEffect} from "react";
import {useAppDispatch} from "./bll/store";
import {authThunks} from "src/bll/slices/Auth/auth-slice";

const App = () => {

    const {isInitialized} = useSelector(appSelector)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setTimeout(() => {
            dispatch(authThunks.authMe())
        }, 1000)
    }, [])

    return (
        <div className="App">
            <AppHeader links={[
                {"link": "https://habr.com/ru/news/",
                "label": "It-News"}
            ]}/>

            {isInitialized ?
                <Routes>
                <Route path={'/'} element={<TodoLists/>}/>
                <Route path={'/login'} element={<Login/>}/>
            </Routes>
            : <Preloader/>
            }


        </div>
    )
}

export default App
