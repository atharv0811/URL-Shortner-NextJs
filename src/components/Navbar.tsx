'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {
    const { data: session } = useSession()

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
                    Url Shortner
                </Link>

                {session ? (
                    <Button onClick={() => signOut()} variant="destructive">Logout</Button>
                ) : (
                    <Button variant="default"><Link href='/auth'>Login</Link></Button>
                )}

            </div>
        </nav>
    )
}

export default Navbar
