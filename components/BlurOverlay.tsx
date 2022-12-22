import React, { CSSProperties, ReactNode } from 'react'

type BlurOverlayProps = {
    className?: string
    style?: CSSProperties
    children: ReactNode
}
const BlurOverlay = ({ className = '', style, children }: BlurOverlayProps) => {
    return (
        <div
            className={`dark:text-gray-200 bg-white dark:bg-gray-900 bg-opacity-30 dark:bg-opacity-30 backdrop-filter backdrop-brightness-110 dark:backdrop-brightness-110 backdrop-blur-xl ${className}`}
            style={{
                borderTop: '1px solid rgba(125,125,125,0.15)',
                borderLeft: '1px solid rgba(125,125,125,0.15)',
                ...style,
            }}
        >
            {children}
        </div>
    )
}

export default BlurOverlay
