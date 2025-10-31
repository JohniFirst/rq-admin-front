import { useState } from 'react'
import useEvent from './useEvent'
import useLayoutUpdateEffect from './useLayoutUpdateEffect'

type Updater<T> = (updater: React.SetStateAction<T>) => void

export default function useMergedState<T>(
  defaultStateValue: T,
  option: {
    value?: T
  },
): [T, Updater<T>] {
  const { value } = option

  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) {
      return value
    }

    return defaultStateValue
  })

  const mergedValue = value !== undefined ? value : innerValue

  useLayoutUpdateEffect(() => {
    if (value !== undefined) {
      setInnerValue(value)
    }
  }, [value])

  const triggerChange: Updater<T> = useEvent<[React.SetStateAction<T>], void>(updater => {
    setInnerValue(updater)
  })

  return [mergedValue, triggerChange]
}
