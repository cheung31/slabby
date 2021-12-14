import React from 'react'
import Link from 'next/link'
import BlurOverlay from '../components/BlurOverlay'
import styles from '../styles/mobileNav.module.css'

type MobileNavProps = {
    pathname?: string | string[],
    className?: string,
}

const MobileNav = ({ pathname = "", className  = ""}: MobileNavProps) => {
    return (
        <div className={`flex font-mono shadow-lg dark:text-gray-300 w-screen ${className}`}>
            <BlurOverlay
                className={`flex-1 p-3 pt-2 bg-opacity-60 dark:bg-opacity-50 hover:bg-opacity-40 dark:hover:bg-opacity-70 ${pathname === 'photo' ? styles.active : styles.tab}`}
            >
                <Link href="/photo">
                    <div className="cursor-pointer">photos</div>
                </Link>
            </BlurOverlay>
            <BlurOverlay
                className={`flex-1 p-3 pt-2 bg-opacity-60 dark:bg-opacity-50 hover:bg-opacity-40 dark:hover:bg-opacity-70 ${pathname === 'tune' ? styles.active : styles.tab}`}>
                <Link href="/tune">
                    <div className="cursor-pointer">tunes</div>
                </Link>
            </BlurOverlay>
        </div>
    )
}

export default MobileNav