import { isAxiosError } from 'axios'
import type { ApiErrorBody } from '@/types/api'

export function getErrorStatus(error: unknown) {
  return isAxiosError(error) ? error.response?.status : undefined
}

/**
 * Turns an API failure into a sentence for the user. Callers describe what
 * each relevant status means in their context; network problems and
 * unexpected statuses get a generic message.
 */
export function getErrorMessage(
  error: unknown,
  messagesByStatus: Partial<Record<number, string>> = {},
) {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return 'Algo deu errado. Tente novamente.'
  }

  if (!error.response) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.'
  }

  const status = error.response.status

  return (
    messagesByStatus[status] ??
    (status >= 500
      ? 'O servidor teve um problema. Tente novamente em instantes.'
      : 'Não foi possível concluir a ação. Tente novamente.')
  )
}
