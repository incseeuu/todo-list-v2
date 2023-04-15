import 'src/App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import {appSelector} from "src/app/app-selector";
import {useAppDispatch} from "src/app/store";
import {authThunks} from "src/features/Login/auth-slice";
import {AppHeader} from "src/common/components/AppHeader/AppHeader";
import {useEffect} from "react";
import {AlertMessage} from "src/common/components/alertMessage";
import TodoLists from "src/features/TodoLists/TodoLists";
import {Login} from "src/features/Login/Login";
import {NotFoundImage} from "src/common/components/PageNotFound";
import Preloader from "src/common/components/Preloader/Preloader";




const App = () => {

    const {isInitialized, errorMessageWhenFetching} = useSelector(appSelector)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setTimeout(() => {
            dispatch(authThunks.authMe())
        }, 1000)
    }, [])

    return (
        <div className="App">

            <AppHeader links={[
                {
                    "link": "https://habr.com/ru/news/",
                    "label": "It-News"
                }
            ]}/>
            <AlertMessage/>

            {isInitialized ?
                <Routes>
                    <Route path={'/'} element={<TodoLists/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<NotFoundImage/>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
                : <Preloader/>
            }
        </div>
    )
}

export default App
