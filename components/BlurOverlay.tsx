import React, { ReactNode } from 'react'

type BlurOverlayProps = {
    className?: string,
    children: ReactNode
}
const BlurOverlay = ({ className = "", children }: BlurOverlayProps) => {
    return (
       <div className={`dark:text-gray-200 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-40 backdrop-filter backdrop-brightness-110 dark:backdrop-brightness-50 backdrop-blur-xl ${className}`}>
           {children}
       </div>
    )
}

export default BlurOverlay