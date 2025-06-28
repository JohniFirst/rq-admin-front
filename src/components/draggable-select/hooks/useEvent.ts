import { useCallback, useRef } from 'react'

export default function useEvent<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const fnRef = useRef<T>(callback)
  fnRef.current = callback

  const memoFn = useCallback<T>(
    ((...args: unknown[]) => fnRef.current?.(...args)) as unknown as T,
    [],
  )

  return memoFn
}
