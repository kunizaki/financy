import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($data: ListTransactionInput!) {
      listTransactions(data: $data) {
          totalCredit
          totalDebit
          transactions {
              id
              description
              transactionType
              date
              value
              category {
                  id
                  title
                  description
                  icon
                  color
                  transactionsCount
              }
              createdAt
              updatedAt
          }
      }
  }
`

export const GET_TRANSACTION = gql`
  query GetTransaction($id: String!) {
      getTransaction(id: $id) {
          id
          description
          transactionType
          date
          value
          category {
              id
              title
              description
              icon
              color
              transactionsCount
          }
      }
  }
`