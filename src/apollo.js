import ApolloClient from 'apollo-boost'

export const host = 'http://192.168.31.184:1119'

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
