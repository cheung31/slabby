import React from 'react'
import NextLink from 'next/link'
import BlurOverlay from './BlurOverlay'
import styles from '../styles/mobileNav.module.css'

type NavButtonProps = {
    isActive?: boolean
    className?: string
    children: React.ReactNode
}
const NavButton = (props: NavButtonProps) => {
    const { isActive = false, className, children } = props

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.target && (e.code === 'Space' || e.code === 'Enter')) {
            const target = e.currentTarget as HTMLElement
            ;(target.firstElementChild as HTMLElement).click()
        }
    }

    return (
        <BlurOverlay
            className={`flex bg-opacity-50 dark:bg-opacity-50 hover:bg-opacity-40 dark:hover:bg-opacity-70 ${className}`}
        >
            <button
                className={`flex-1 ${isActive ? styles.active : styles.tab}`}
                onKeyDown={handleKeyDown}
            >
                {children}
            </button>
        </BlurOverlay>
    )
}

type MobileNavProps = {
    pathname?: string | string[]
    className?: string
}
const MobileNav = ({ pathname = '', className = '' }: MobileNavProps) => {
    return (
        <nav
            className={`flex font-mono shadow-lg dark:text-gray-300 w-screen ${className}`}
        >
            <NavButton className="flex-1" isActive={pathname === 'photo'}>
                <NextLink href="/photo" passHref>
                    <div className="cursor-pointer p-3 pt-2">photos</div>
                </NextLink>
            </NavButton>
            <NavButton className="flex-1" isActive={pathname === 'tune'}>
                <NextLink href="/tune" passHref>
                    <div className="cursor-pointer p-3 pt-2">tunes</div>
                </NextLink>
            </NavButton>
        </nav>
    )
}

export default MobileNav
