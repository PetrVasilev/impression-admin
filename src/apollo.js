import ApolloClient from 'apollo-boost'

export const host = 'http://185.125.218.12:1119'

const GraphQL = `${host}/graphql`

const client = new ApolloClient({
    uri: GraphQL,
    request: operation => {
        const token = localStorage.getItem('token')
        operation.setContext({
            headers: {
                authorization: token ? token : ''
            }
        })
    }
})

export default client
