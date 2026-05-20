import type { ApiResponse } from '@/types/api';

export function unwrapApiResponse<T>(response: unknown): T {
  if (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response
  ) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
}
