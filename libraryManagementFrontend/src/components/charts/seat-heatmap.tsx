'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface SeatHeatmapProps {
    data: {
        id: string;
        status: 'occupied' | 'vacant' | 'reserved' | 'maintenance';
        label: string;
    }[];
}

export function SeatHeatmap({ data }: SeatHeatmapProps) {
    // Mock data generator if not provided
    const seats = data || Array.from({ length: 100 }, (_, i) => ({
        id: `seat-${i}`,
        label: `S-${i + 1}`,
        status: Math.random() < 0.6 ? 'occupied' : Math.random() < 0.8 ? 'vacant' : Math.random() < 0.95 ? 'reserved' : 'maintenance',
    }));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'occupied': return 'bg-red-500 hover:bg-red-600';
            case 'vacant': return 'bg-green-500 hover:bg-green-600';
            case 'reserved': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'maintenance': return 'bg-gray-400 hover:bg-gray-500';
            default: return 'bg-gray-200';
        }
    };

    const stats = {
        occupied: seats.filter(s => s.status === 'occupied').length,
        vacant: seats.filter(s => s.status === 'vacant').length,
        reserved: seats.filter(s => s.status === 'reserved').length,
        maintenance: seats.filter(s => s.status === 'maintenance').length,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">Live Seat Occupancy</CardTitle>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-sm bg-red-500" />
                        <span>Occupied ({stats.occupied})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-sm bg-green-500" />
                        <span>Vacant ({stats.vacant})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-sm bg-yellow-500" />
                        <span>Reserved ({stats.reserved})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-sm bg-gray-400" />
                        <span>Maintenance ({stats.maintenance})</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-10 gap-2 sm:grid-cols-20">
                    <TooltipProvider>
                        {seats.map((seat) => (
                            <Tooltip key={seat.id}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`h-4 w-4 rounded-sm cursor-pointer transition-colors ${getStatusColor(seat.status)}`}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Seat: {seat.label}</p>
                                    <p className="capitalize">Status: {seat.status}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}
