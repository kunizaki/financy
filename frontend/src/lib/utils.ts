import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null
}

function asArray(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null
}

type ValidationErrorNode = {
  constraints?: Record<string, string>
  children?: ValidationErrorNode[]
}

function isValidationErrorNode(value: unknown): value is ValidationErrorNode {
  if (!isRecord(value)) return false
  const constraintsOk =
    value.constraints === undefined ||
    (isRecord(value.constraints) &&
      Object.values(value.constraints).every((v) => typeof v === "string"))

  const childrenOk =
    value.children === undefined ||
    (Array.isArray(value.children) && value.children.every(isValidationErrorNode))

  return constraintsOk && childrenOk
}

type GraphQLErrorLike = {
  message?: string
  extensions?: {
    validationErrors?: unknown
  }
}

function isGraphQLErrorLike(value: unknown): value is GraphQLErrorLike {
  if (!isRecord(value)) return false
  if (value.message !== undefined && typeof value.message !== "string") return false

  if (value.extensions !== undefined) {
    if (!isRecord(value.extensions)) return false
    // validationErrors pode ser qualquer coisa; vamos validar depois
  }
  return true
}

function extractFirstConstraint(errors: ValidationErrorNode[]): string | null {
  for (const err of errors) {
    if (err.constraints) {
      const constraints = Object.values(err.constraints)
      if (constraints.length > 0) return constraints[0] ?? null
    }
    if (err.children && err.children.length > 0) {
      const childError = extractFirstConstraint(err.children)
      if (childError) return childError
    }
  }
  return null
}

export function getErrorMessage(error: unknown): string {
  const candidateErrorsSources: unknown[] = []

  if (isRecord(error)) {
    candidateErrorsSources.push(
      error.graphQLErrors,
      (isRecord(error.response) ? error.response.errors : undefined),
      error.errors,
      // networkError?.result?.errors
      (isRecord(error.networkError) &&
      isRecord(error.networkError.result)
        ? error.networkError.result.errors
        : undefined),
    )
  }

  const graphQLErrors =
    candidateErrorsSources
      .map(asArray)
      .find((arr): arr is unknown[] => Array.isArray(arr) && arr.length > 0) ?? null

  if (graphQLErrors) {
    for (const gqlErr of graphQLErrors) {
      if (!isGraphQLErrorLike(gqlErr)) continue

      const maybeValidationErrors = gqlErr.extensions?.validationErrors
      const validationArray = asArray(maybeValidationErrors)

      if (validationArray) {
        const nodes = validationArray.filter(isValidationErrorNode)
        if (nodes.length > 0) {
          const msg = extractFirstConstraint(nodes)
          if (msg) return msg
        }
      }

      // Se não for erro de validação, mas tiver mensagem no graphQLError
      if (
        typeof gqlErr.message === "string" &&
        !gqlErr.message.includes("Argument Validation Error")
      ) {
        return gqlErr.message
      }
    }
  }

  // Tentar converter error.message de JSON se parecer um JSON
  if (isRecord(error) && typeof error.message === "string" && error.message.trim().startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(error.message)
      return getErrorMessage(parsed)
    } catch (e) {
      console.error(e)
    }
  }

  const defaultMessage =
    isRecord(error) && typeof error.message === "string"
      ? error.message
      : "Ocorreu um erro inesperado"

  return defaultMessage.includes("Argument Validation Error")
    ? "Dados inválidos fornecidos"
    : defaultMessage
}
