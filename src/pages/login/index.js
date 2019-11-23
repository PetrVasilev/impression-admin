import './style.scss'

import React, { useState } from 'react'
import { Card, Form, Button } from 'tabler-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const LOGIN_MUTATION = gql`
    mutation login($login: String!, $password: String!) {
        login(login: $login, password: $password) {
            token
        }
    }
`

const Login = ({ history }) => {
    const [loginModerator, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ login: { token } }) => {
            localStorage.setItem('token', token)
            history.replace('/')
        }
    })
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        loginModerator({ variables: { login, password } })
    }

    return (
        <div className="login-page">
            <img className="logo" src="/logo.png" alt="inVoyager" />
            <Card>
                <div className="card-title">Войти в панель модератора</div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group label="Логин">
                        <Form.Input
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            name="login"
                            placeholder="Введите логин..."
                            required
                        />
                    </Form.Group>
                    <Form.Group label="Пароль">
                        <Form.Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            name="password"
                            type="password"
                            placeholder="Введите пароль..."
                            required
                            feedback={error ? 'Неправильный пароль' : null}
                            invalid={error ? true : false}
                        />
                    </Form.Group>
                    <Form.Footer>
                        <Button
                            loading={loading}
                            type="submit"
                            className="login-button"
                            color="primary"
                        >
                            Войти
                        </Button>
                    </Form.Footer>
                </Form>
            </Card>
        </div>
    )
}

export default Login
