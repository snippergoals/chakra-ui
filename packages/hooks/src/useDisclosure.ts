import * as React from "react"
import { useControllableProp } from "./useControllable"
import { usePrevious } from "./usePrevious"

export interface DisclosureHookProps {
  isOpen?: boolean
  defaultIsOpen?: boolean
  onClose?(): void
  onOpen?(): void
}

export function useDisclosure(props: DisclosureHookProps = {}) {
  const { onClose: onCloseProp, onOpen: onOpenProp } = props

  const [isOpenState, setIsOpen] = React.useState(props.defaultIsOpen || false)
  const [isControlled, isOpen] = useControllableProp(props.isOpen, isOpenState)

  const prevIsOpen = usePrevious(isOpen)

  const onClose = React.useCallback(() => {
    if (!isControlled) {
      setIsOpen(false)
    }
    if (onCloseProp) {
      onCloseProp()
    }
  }, [isControlled, onCloseProp])

  const onOpen = React.useCallback(() => {
    if (!isControlled) {
      setIsOpen(true)
    }
    if (onOpenProp) {
      onOpenProp()
    }
  }, [isControlled, onOpenProp])

  const onToggle = React.useCallback(() => {
    const action = isOpen ? onClose : onOpen
    action()
  }, [isOpen, onOpen, onClose])

  return {
    isOpen: Boolean(isOpen),
    prevIsOpen: Boolean(prevIsOpen),
    onOpen,
    onClose,
    onToggle,
    isControlled,
  }
}

export type DisclosureHookReturn = ReturnType<typeof useDisclosure>
