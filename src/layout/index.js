import React from 'react'
import { Container, Loader } from 'tabler-react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import Header from './header'

export const GET_MODERATOR = gql`
    {
        moderator {
            id
            login
        }
    }
`

const Layout = ({ children, history, ...props }) => {
    const { data, loading } = useQuery(GET_MODERATOR, {
        onError: () => {
            history.replace('/login')
        }
    })
    if (loading) {
        return (
            <div className="loading-container">
                <Loader />
            </div>
        )
    }
    const moderator = data ? data.moderator : {}
    return (
        <>
            <Header moderator={moderator} {...props} />
            <Container className="content">{children}</Container>
        </>
    )
}

const withLayout = (props, Component) => {
    return (
        <Layout {...props}>
            <Component {...props} />
        </Layout>
    )
}

export default withLayout
