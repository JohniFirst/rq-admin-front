import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SelectableContext, type UnmountItemsInfoType } from './context'
import useContainer from './hooks/useContainer'
import useEvent from './hooks/useEvent'
import useLatest from './hooks/useLatest'
import useMergedState from './hooks/useMergedState'
import useScroll from './hooks/useScroll'
import { getClientXY, isInRange } from './utils'

export interface SelectableProps<T> {
  defaultValue?: T[]
  value?: T[]
  items?: T[]
  disabled?: boolean
  children?: React.ReactNode
  mode?: DraggableSelectMode
  selectStartRange?: DraggableSelectStartRange
  scrollContainer?: () => HTMLElement
  dragContainer?: () => HTMLElement
  boxStyle?: React.CSSProperties
  boxClassName?: string
  compareFn?: (a: T, b: T) => boolean
  onStart?: (event: MouseEvent | TouchEvent) => void
  onEnd?: (selectingValue: T[], changed: { added: T[]; removed: T[] }) => void
}

export interface SelectableRef {
  cancel: () => void
}

function defaultCompareFn<T>(a: T, b: T) {
  return a === b
}

function Selectable<T>(
  {
    defaultValue,
    value: propsValue,
    items,
    disabled,
    mode = 'add',
    children,
    selectStartRange = 'all',
    scrollContainer: propsScrollContainer,
    dragContainer: propsDragContainer,
    boxStyle,
    boxClassName,
    compareFn = defaultCompareFn<T>,
    onStart,
    onEnd,
  }: SelectableProps<T>,
  ref: React.ForwardedRef<SelectableRef>,
) {
  const [isDragging, setIsDragging] = useState(false)
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 })
  const [moveCoords, setMoveCoords] = useState({ x: 0, y: 0 })
  const selectingValue = useRef<T[]>([])
  const [startTarget, setStartTarget] = useState<HTMLElement | null>(null)
  const startInside = useRef(false)
  const moveClient = useRef({ x: 0, y: 0 })
  const [value, setValue] = useMergedState(defaultValue || [], {
    value: propsValue,
  })
  const boxRef = useRef<HTMLDivElement | null>(null)
  const unmountItemsInfo = useRef<UnmountItemsInfoType<T>>(new Map())
  const scrollInfo = useRef({ scrollTop: 0, scrollLeft: 0 })
  const [isCanceled, setIsCanceled] = useState(false)

  const scrollContainer = useContainer(propsScrollContainer)
  const dragContainer = useContainer(propsDragContainer || propsScrollContainer)

  const { smoothScroll, cancelScroll } = useScroll()
  const startCoordsRef = useLatest(startCoords)
  const isDraggingRef = useLatest(isDragging)
  const selectStartRangeRef = useLatest(selectStartRange)

  const top = Math.max(0, Math.min(startCoords.y, moveCoords.y))
  const left = Math.max(0, Math.min(startCoords.x, moveCoords.x))
  const width = isDragging ? Math.abs(startCoords.x - Math.max(0, moveCoords.x)) : 0
  const height = isDragging ? Math.abs(startCoords.y - Math.max(0, moveCoords.y)) : 0
  const boxPosition = useMemo(() => ({ top, left, width, height }), [top, left, width, height])

  const virtual = !!items

  React.useImperativeHandle(ref, () => ({
    cancel: () => {
      setIsCanceled(true)
      setIsDragging(false)
    },
  }))

  const handleStart = useEvent((event: MouseEvent | TouchEvent) => {
    onStart?.(event)
  })

  const handleEnd = useEvent(() => {
    if (onEnd) {
      if (virtual) {
        unmountItemsInfo.current.forEach((info, item) => {
          if (items.some(i => compareFn(i, item))) {
            const inRange = isInRange(
              info.rule,
              {
                width: info.rect.width,
                height: info.rect.height,
                top: info.rect.top + info.scrollTop - scrollInfo.current.scrollTop,
                left: info.rect.left + info.scrollLeft - scrollInfo.current.scrollLeft,
              },
              scrollContainer,
              boxPosition,
              boxRef,
            )
            if (inRange && !info.disabled) {
              selectingValue.current.push(item)
            } else {
              selectingValue.current = selectingValue.current.filter(i => !compareFn(i, item))
            }
          }
        })
      }

      const added: T[] = []
      const removed: T[] = []

      for (const i of selectingValue.current) {
        if (value?.some(val => compareFn(val, i))) {
          if (mode === 'remove' || mode === 'reverse') {
            removed.push(i)
          }
        } else {
          if (mode === 'add' || mode === 'reverse') {
            added.push(i)
          }
        }
      }

      onEnd(selectingValue.current, { added, removed })
    }
  })

  useEffect(() => {
    let isMouseDowning = false
    let scrollContainerOriginPosition = ''

    const reset = () => {
      setIsDragging(false)
      setIsCanceled(false)
      setStartTarget(null)
      isMouseDowning = false
      startInside.current = false
      selectingValue.current = []
    }

    if (disabled || !scrollContainer || !dragContainer || isCanceled) {
      reset()
      return
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isMouseDowning) {
        const { clientX, clientY } = getClientXY(e)
        moveClient.current = { x: clientX, y: clientY }
        const { left, top } = scrollContainer.getBoundingClientRect()
        const x = Math.min(clientX - left + scrollContainer.scrollLeft, scrollContainer.scrollWidth)
        const y = Math.min(clientY - top + scrollContainer.scrollTop, scrollContainer.scrollHeight)
        setMoveCoords({
          x,
          y,
        })
        smoothScroll(e, scrollContainer)

        if (!isDraggingRef.current) {
          let shouldDraggingStart = true
          if (selectStartRangeRef.current === 'outside') {
            shouldDraggingStart = !startInside.current
          } else if (selectStartRangeRef.current === 'inside') {
            shouldDraggingStart = startInside.current
          }
          const boxWidth = Math.abs(startCoordsRef.current.x - x)
          const boxHeight = Math.abs(startCoordsRef.current.y - y)
          // prevent trigger when click too fast
          // https://github.com/linxianxi/react-selectable-box/issues/5
          if (shouldDraggingStart && (boxWidth > 1 || boxHeight > 1)) {
            setIsDragging(true)
            scrollContainerOriginPosition = getComputedStyle(scrollContainer).position
            // default position in browser is `static`
            if (scrollContainer !== document.body && scrollContainerOriginPosition === 'static') {
              scrollContainer.style.position = 'relative'
            }
            handleStart(e)
          }
        }
      }
    }

    const scrollListenerElement = scrollContainer === document.body ? document : scrollContainer

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement
      scrollInfo.current = {
        scrollTop: target.scrollTop,
        scrollLeft: target.scrollLeft,
      }

      if (isDraggingRef.current && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const x = Math.min(
          moveClient.current.x - containerRect.left + scrollContainer.scrollLeft,
          scrollContainer.scrollWidth,
        )
        const y = Math.min(
          moveClient.current.y - containerRect.top + scrollContainer.scrollTop,
          scrollContainer.scrollHeight,
        )
        setMoveCoords({
          x,
          y,
        })
      }
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onMouseMove)
      window.removeEventListener('touchend', onMouseUp)

      if (isDraggingRef.current) {
        scrollContainer.style.position = scrollContainerOriginPosition
        cancelScroll()
        setValue(selectingValue.current)
        handleEnd()
      }
      reset()
    }

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      // disable text selection, but it will prevent default scroll behavior when mouse move, so we used `useScroll`
      e.preventDefault()
      isMouseDowning = true

      if (selectStartRangeRef.current !== 'all') {
        setStartTarget(e.target as HTMLElement)
      }

      const { clientX, clientY } = getClientXY(e)
      const { left, top } = scrollContainer.getBoundingClientRect()
      setStartCoords({
        x: clientX - left + scrollContainer.scrollLeft,
        y: clientY - top + scrollContainer.scrollTop,
      })

      window.addEventListener('mousemove', onMouseMove, { passive: false })
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('touchmove', onMouseMove, { passive: false })
      window.addEventListener('touchend', onMouseUp)
    }

    dragContainer.addEventListener('mousedown', onMouseDown)
    dragContainer.addEventListener('touchstart', onMouseDown)
    scrollListenerElement.addEventListener('scroll', onScroll)

    return () => {
      if (scrollContainerOriginPosition) {
        scrollContainer.style.position = scrollContainerOriginPosition
      }
      cancelScroll()
      dragContainer.removeEventListener('mousedown', onMouseDown)
      dragContainer.removeEventListener('touchstart', onMouseDown)
      scrollListenerElement.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onMouseMove)
      window.removeEventListener('touchend', onMouseUp)
    }
  }, [disabled, scrollContainer, dragContainer, isCanceled])

  const contextValue = useMemo(
    () => ({
      value,
      selectingValue,
      isDragging,
      boxPosition,
      mode,
      scrollContainer,
      startTarget,
      startInside,
      unmountItemsInfo,
      scrollInfo,
      virtual,
      boxRef,
      compareFn,
    }),
    [
      value,
      isDragging,
      boxPosition,
      mode,
      scrollContainer,
      startTarget,
      unmountItemsInfo,
      scrollInfo,
      virtual,
      boxRef,
      compareFn,
    ],
  )

  return (
    <SelectableContext.Provider value={contextValue}>
      {children}
      {isDragging &&
        scrollContainer &&
        createPortal(
          <div
            ref={boxRef}
            className={boxClassName}
            style={{
              position: 'absolute',
              zIndex: 9999,
              top: 0,
              left: 0,
              transform: `translate(${left}px, ${top}px)`,
              width,
              height,
              backgroundColor: 'rgba(22, 119, 255, 0.3)',
              ...boxStyle,
            }}
          />,
          scrollContainer,
        )}
    </SelectableContext.Provider>
  )
}

export default React.forwardRef(Selectable) as <T>(
  props: SelectableProps<T> & React.RefAttributes<SelectableRef>,
) => React.ReactElement
