'use client';

import DashboardCards from '@/components/DashboardCards';
import LinksCard from '@/components/LinksCard';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Link {
    name: string;
    url: string;
    shortUrl: string;
    clicks: number;
    shortId: string;
}

const Dashboard = () => {
    const [data, setData] = useState({ totalLinks: 0, totalClicks: 0, urls: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/get-urls");

            if (response.data.success) {
                const totalClicks = response.data.urls.reduce((acc: number, link: Link) => acc + link.clicks, 0);
                setData({
                    totalLinks: response.data.totalLinks,
                    totalClicks: totalClicks,
                    urls: response.data.urls,
                });
            }

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleModalSuccess = () => {
        fetchData();
    };

    return (
        <div className="flex flex-col p-8 space-y-5">
            <div className='flex justify-between'>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button onClick={() => setIsModalOpen(true)}>Create New</Button>
            </div>
            <div className="flex space-x-4">
                <DashboardCards title="Links Created" value={data.urls.length} />
                <DashboardCards title="Total Clicks" value={data.totalClicks} />
            </div>

            <h1 className='text-3xl font-extrabold'>My Links</h1>
            <div className="w-full space-y-3">
                {data.urls.map((link: Link) => (
                    <LinksCard
                        key={link.shortUrl}
                        name={link.name}
                        longUrl={link.url}
                        shortUrl={`${window.location.origin}/${link.shortUrl}`}
                        clicks={link.clicks}
                        shortId={link.shortUrl}
                        fetchData={fetchData}
                    />
                ))}
            </div>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleModalSuccess} />
        </div>
    );
};

export default Dashboard;
