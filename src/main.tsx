import React from 'react'
import ReactDOM from 'react-dom/client'
import App from 'src/app/App'
import './index.css'
import {Provider} from "react-redux";
import {HashRouter} from "react-router-dom";
import {store} from "src/app/store"
import {MantineProvider} from "@mantine/core";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <HashRouter>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <App/>
            </MantineProvider>
        </HashRouter>
    </Provider>
)
