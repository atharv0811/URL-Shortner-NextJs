'use client'

import { ApiResponse } from '@/types/ApiResponse';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const RedirectPage = ({ params }: { params: { shortId: string } }) => {
    const router = useRouter();
    const { shortId } = params;

    useEffect(() => {
        async function fetchRedirectUrl() {
            try {
                if (shortId) {
                    const response = await axios.get<ApiResponse>(`/api/redirect/${shortId}`);
                    router.push(response.data.url!)
                }
            } catch (error) {
                console.error("Error during redirection:", error);
            }
        }

        fetchRedirectUrl();
    }, [shortId]);

    return <div>Redirecting...</div>;
}

export default RedirectPage;
