import { useCallback, useRef } from 'react'

export default function useEvent<Args extends unknown[], R>(
  callback: (...args: Args) => R,
): (...args: Args) => R {
  const fnRef = useRef<(...args: Args) => R>(callback)
  fnRef.current = callback

  const memoFn = useCallback((...args: Args) => fnRef.current(...args), [])

  return memoFn
}
