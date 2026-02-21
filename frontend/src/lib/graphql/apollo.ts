import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client"
import {ErrorLink} from "@apollo/client/link/error"
import {CombinedGraphQLErrors, ServerError} from "@apollo/client/errors"
import {SetContextLink} from "@apollo/client/link/context"
import {useAuthStore} from '@/stores/auth.ts'


const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql"
})

const authLink = new SetContextLink((prevContext) => {
    const token = useAuthStore.getState().token
    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
        for (const err of error.errors) {
            if (err.extensions?.code === 'UNAUTHENTICATED') {
                useAuthStore.getState().logout()
                window.location.href = '/login'
            }
        }
    }

    if (ServerError.is(error) && error.statusCode === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
    }
})

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache()
})