import {gql} from '@apollo/client'

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
      createCategory(data: $data) {
          title
          description
          icon
          color
      }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
        updateCategory(id: $id, data: $data) {
            id
            title
            description
            icon
            color
            transactionsCount
            createdAt
            updatedAt
        }   
    }
`