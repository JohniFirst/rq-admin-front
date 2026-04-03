import { type MutableRefObject, useEffect, useState } from 'react'

/**
 * A custom React hook that checks if the element referenced by the provided
 * `ref` is in the viewport. It returns a tuple of two values:
 * - `isInViewport`: a boolean indicating whether the element is in the viewport.
 * - `entry`: an `IntersectionObserverEntry` object containing information about
 *   the intersection between the element and the viewport.
 *
 * @param {MutableRefObject<null>} ref - A mutable reference to the element to
 *   observe.
 * @return {[boolean, IntersectionObserverEntry | null]} A tuple containing the
 *   `isInViewport` boolean and the `entry` object.
 */
export function useInViewport(
  ref: MutableRefObject<null>,
): [boolean, IntersectionObserverEntry | null] {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          setEntry(entry)
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.5,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  // 使用 entry.isIntersecting 但不作为 useEffect 依赖，避免重新初始化
  const isInViewport = entry?.isIntersecting ?? false

  return [isInViewport, entry]
}
