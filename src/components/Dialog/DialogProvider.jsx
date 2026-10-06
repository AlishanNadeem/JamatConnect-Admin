import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'

const DialogContext = createContext(null)

const DEFAULT_CONFIRM = {
  title: 'Are you sure?',
  description: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'warning',
  confirmVariant: 'primary',
}

const DEFAULT_ACKNOWLEDGE = {
  title: 'Notice',
  description: '',
  confirmLabel: 'Got it',
  variant: 'info',
  confirmVariant: 'primary',
}

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null)
  const resolver_ref = useRef(null)

  const closeDialog = useCallback((result) => {
    resolver_ref.current?.(result)
    resolver_ref.current = null
    setDialog(null)
  }, [])

  const openDialog = useCallback((config) => {
    return new Promise((resolve) => {
      resolver_ref.current?.(false)
      resolver_ref.current = resolve
      setDialog(config)
    })
  }, [])

  const confirm = useCallback(
    (options = {}) =>
      openDialog({
        mode: 'confirm',
        ...DEFAULT_CONFIRM,
        ...options,
      }),
    [openDialog]
  )

  const acknowledge = useCallback(
    (options = {}) =>
      openDialog({
        mode: 'acknowledge',
        ...DEFAULT_ACKNOWLEDGE,
        ...options,
      }),
    [openDialog]
  )

  const value = useMemo(
    () => ({
      confirm,
      acknowledge,
    }),
    [confirm, acknowledge]
  )

  const is_confirm = dialog?.mode === 'confirm'

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal
        open={Boolean(dialog)}
        title={dialog?.title}
        description={dialog?.description}
        variant={dialog?.variant || 'default'}
        onClose={() => closeDialog(false)}
      >
        <div className={`jc-modal__actions ${is_confirm ? '' : 'is-single'}`}>
          {is_confirm ? (
            <Button fullWidth variant="ghost" onClick={() => closeDialog(false)}>
              {dialog?.cancelLabel || 'Cancel'}
            </Button>
          ) : null}
          <Button
            fullWidth
            variant={dialog?.confirmVariant || 'primary'}
            onClick={() => closeDialog(true)}
          >
            {dialog?.confirmLabel || (is_confirm ? 'Confirm' : 'Got it')}
          </Button>
        </div>
      </Modal>
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider')
  }
  return context
}
