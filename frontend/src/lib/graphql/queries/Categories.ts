import { gql } from '@apollo/client'

export const LIST_CATEGORIES = gql`
  query ListCategories {
    listCategories {
        id
        title
        description
        icon
        color
        transactionsCount
    }
  }
`

export const GET_CATEGORY = gql`
query GetCategory($id: String!) {
    getCategory(id: $id) {
        id
        userId
        title
        description
        icon
        color
        transactionsCount
    }
}
`