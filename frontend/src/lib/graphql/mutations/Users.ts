import {gql} from '@apollo/client'

export const UPDATE_USER = gql`
    mutation UpdateUser($id: String!, $data: UpdateUserInput!) {
        updateUser(id: $id, data: $data) {
            id
            name
            email
            createdAt
            updatedAt
        }
    }
`