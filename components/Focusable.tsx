import React from 'react'
import { useFocusManager, useKeyboard } from 'react-aria'

type FocusableProps = {
    tabIndex?: number
    children: React.ReactNode
}
function Focusable({ tabIndex, children }: FocusableProps) {
    const focusManager = useFocusManager()
    const { keyboardProps } = useKeyboard({
        onKeyDown: (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    console.log('## key prev')
                    focusManager.focusPrevious()
                    break
                case 'ArrowRight':
                    console.log('## key next')
                    focusManager.focusNext()
                    break
                default:
                    break
            }
        },
    })
    return (
        <div tabIndex={tabIndex} {...keyboardProps}>
            {children}
        </div>
    )
}

export default Focusable
