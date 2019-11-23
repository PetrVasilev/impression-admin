import './style.scss'

import React, { useState } from 'react'
import gql from 'graphql-tag'
import moment from 'moment'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Loader, Card, ContactCard, Badge, Button, Alert, Form } from 'tabler-react'

import { host } from '../../apollo'

const GET_CONFIRM = gql`
    query confirm($id: ID!) {
        confirm(where: { id: $id }) {
            id
            user {
                id
                name
                phone
                image
            }
            status
            comment
            createdAt
            document
        }
    }
`

const UPDATE_CONFIRM = gql`
    mutation updateConfirm($id: ID!, $status: String!, $comment: String) {
        updateConfirm(where: { id: $id }, data: { status: $status, comment: $comment }) {
            id
            user {
                id
                name
                phone
                image
            }
            status
            comment
            createdAt
            document
        }
    }
`

const getStatusNode = status => {
    switch (status) {
        case 'confirmed':
            return <Badge color="success">Подтвержден</Badge>
        case 'rejected':
            return <Badge color="danger">Отклонен</Badge>
        default:
            return <Badge color="warning">Не подтвержден</Badge>
    }
}

const Confirm = ({ match }) => {
    const { id } = match.params
    const { loading, data } = useQuery(GET_CONFIRM, {
        variables: { id }
    })
    const [alert, setAlert] = useState({
        visible: false
    })
    const [visibleReject, setVisibleReject] = useState(false)
    const [comment, setComment] = useState('')
    const [confirmUser, { loading: confirming }] = useMutation(UPDATE_CONFIRM)
    const [rejectUser, { loading: rejecting }] = useMutation(UPDATE_CONFIRM)

    const confirm = data ? data.confirm : {}

    const user = confirm.user ? confirm.user : {}

    const image = user.image ? `${host}/images/${user.image}` : '/default-user.jpg'

    const handleConfirm = async () => {
        try {
            setAlert({ visible: false })
            await confirmUser({ variables: { id, status: 'confirmed', comment: '' } })
            setAlert({
                visible: true,
                type: 'success',
                message: 'Пользователь успешно подтвержден'
            })
        } catch (err) {
            console.error(err)
            setAlert({
                visible: true,
                type: 'danger',
                message: 'Не удалось подтвердить пользователя'
            })
        }
    }

    const handleReject = async e => {
        e.preventDefault()
        try {
            setAlert({ visible: false })
            await rejectUser({ variables: { id, status: 'rejected', comment } })
            setAlert({
                visible: true,
                type: 'success',
                message: 'Пользователь успешно отклонен'
            })
            setVisibleReject(false)
        } catch (err) {
            console.error(err)
            setAlert({
                visible: true,
                type: 'danger',
                message: 'Не удалось отклонить пользователя'
            })
        }
    }

    return (
        <Card className="confirm-card">
            {loading ? (
                <div className="confirm-loading">
                    <Loader className="confirm-loader" />
                </div>
            ) : (
                <>
                    <ContactCard
                        cardTitle="Пользователь"
                        rounded
                        objectURL={image}
                        alt={image}
                        details={[
                            { title: 'Имя', content: user.name },
                            { title: 'Номер телефона', content: '+' + user.phone },
                            { title: 'Статус', content: getStatusNode(confirm.status) },
                            {
                                title: 'Комментарий к статусу',
                                content: confirm.comment ? confirm.comment : '-'
                            },
                            {
                                title: 'Документ',
                                content: (
                                    <img
                                        className="document-image"
                                        src={`${host}/images/${confirm.document}`}
                                        alt={confirm.document}
                                    />
                                )
                            },
                            {
                                title: 'Дата запроса',
                                content: moment(confirm.createdAt).format('DD.MM.YYYY HH:mm')
                            }
                        ]}
                    />
                    {alert.visible && (
                        <Alert isDismissible type={alert.type}>
                            {alert.message}
                        </Alert>
                    )}
                    <div className="confirm-actions">
                        <Button onClick={handleConfirm} loading={confirming} color="success">
                            Подтвердить
                        </Button>
                        <Button onClick={() => setVisibleReject(prev => !prev)} color="danger">
                            Отклонить
                        </Button>
                    </div>
                    {visibleReject && (
                        <Form className="comment-form" onSubmit={handleReject}>
                            <Form.Group label="Комментарий">
                                <Form.Input
                                    required
                                    name="comment"
                                    placeholder="Введите комментарий..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                            </Form.Group>
                            <Button loading={rejecting} type="submit" color="info">
                                Сохранить
                            </Button>
                        </Form>
                    )}
                </>
            )}
        </Card>
    )
}

export default Confirm
