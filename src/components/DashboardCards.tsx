import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface DashboardCardProps {
    title: string;
    value: number;
}

const DashboardCards = ({ title, value }: DashboardCardProps) => {
    return (
        <Card className="w-[38rem]">
            <CardHeader>
                <CardTitle className='flex justify-between'>
                    <span>{title}</span>
                    <span>{value}</span>
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default DashboardCards
