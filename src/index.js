import './styles/global.scss'
import 'moment/locale/ru'

import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'

import * as serviceWorker from './serviceWorker'
import withLayout from './layout'
import apolloClient from './apollo'
import { Main, Confirm, Login } from './pages'

moment.locale('ru')

const App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={props => withLayout(props, Main)} />
                    <Route
                        path="/confirm/:id"
                        exact
                        component={props => withLayout(props, Confirm)}
                    />
                    <Route path="/login" exact component={Login} />
                </Switch>
            </BrowserRouter>
        </ApolloProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
