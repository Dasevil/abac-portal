import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export function useFetch<T>(key: unknown[], fn: () => Promise<T>, options?: UseQueryOptions<T>) {
  return useQuery<T>({ queryKey: key, queryFn: fn, ...options })
}


