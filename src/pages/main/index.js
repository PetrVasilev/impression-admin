import './style.scss'

import React from 'react'
import gql from 'graphql-tag'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { Card, Table, Loader, Badge } from 'tabler-react'
import { Link } from 'react-router-dom'

const GET_CONFIRMS = gql`
    {
        confirms {
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

const Main = () => {
    const { loading, data } = useQuery(GET_CONFIRMS)

    const confirms = data ? data.confirms : []

    return (
        <Card className="table-card">
            <Table>
                <Table.Header>
                    <tr>
                        <Table.ColHeader>Имя</Table.ColHeader>
                        <Table.ColHeader>Номер телефона</Table.ColHeader>
                        <Table.ColHeader>Статус</Table.ColHeader>
                        <Table.ColHeader>Создан</Table.ColHeader>
                    </tr>
                </Table.Header>
                {confirms.length > 0 && (
                    <Table.Body>
                        {confirms.map(item => (
                            <Table.Row key={item.id}>
                                <Table.Col>
                                    <Link to={`/confirm/${item.id}`}>{item.user.name}</Link>
                                </Table.Col>
                                <Table.Col>+{item.user.phone}</Table.Col>
                                <Table.Col>{getStatusNode(item.status)}</Table.Col>
                                <Table.Col>
                                    {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
                                </Table.Col>
                            </Table.Row>
                        ))}
                    </Table.Body>
                )}
            </Table>
            {loading && (
                <div className="table-loading">
                    <Loader className="table-loader" />
                </div>
            )}
        </Card>
    )
}

export default Main
