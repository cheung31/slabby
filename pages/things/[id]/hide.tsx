import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type DeleteState = 'loading' | 'success' | Error

const Hide: NextPage = () => {
    const [deleteState, setDeleteState] = useState<DeleteState>('loading')
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        if (!id) return
        ;(async () => {
            try {
                await fetch(`/api/things/${id}`, {
                    method: 'DELETE',
                })
                setDeleteState('success')
            } catch (e) {
                setDeleteState(e as Error)
            }
        })()
    }, [id])

    return (
        <div className="container mx-auto font-mono dark:text-gray-300">
            <div className="flex justify-center items-center h-screen">
                {deleteState === 'loading' ? (
                    <h1>Loading...</h1>
                ) : deleteState === 'success' ? (
                    <h1>The Thing has been deleted</h1>
                ) : (
                    <h1>Failed. Try again.</h1>
                )}
            </div>
        </div>
    )
}

export default Hide
