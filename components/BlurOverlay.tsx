import React, { ReactNode } from 'react'

type BlurOverlayProps = {
    className?: string
    style?: React.CSSProperties
    children: ReactNode
}
const BlurOverlay = ({ className = '', style, children }: BlurOverlayProps) => {
    return (
        <div
            className={`dark:text-gray-200 bg-white dark:bg-gray-900 bg-opacity-30 dark:bg-opacity-30 backdrop-filter backdrop-brightness-110 dark:backdrop-brightness-110 backdrop-blur-xl ${className}`}
            style={style}
        >
            {children}
        </div>
    )
}

export default BlurOverlay
