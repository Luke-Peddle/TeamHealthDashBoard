import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { pulseChartProps } from '@/types/PulseChart';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTheme } from 'next-themes';

interface PulseChartProps{
    pulses: pulseChartProps []
}

const ContribuorPulseChart: React.FC<PulseChartProps> = ({ pulses }) => {
    const { theme } = useTheme();
    const [dateRange, setDateRange] = useState({ value: 'all', label: 'All Time' });
    const [hiddenSeries, setHiddenSeries] = useState<{[key: string]: boolean}>({});
    
    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'last30', label: 'Last 30 Days' },
        { value: 'last90', label: 'Last 90 Days' },
        { value: 'last6months', label: 'Last 6 Months' },
        { value: 'lastyear', label: 'Last Year' }
    ];

    const getFilteredPulses = () => {
        if (!pulses || pulses.length === 0) return [];
        
        if (dateRange.value === 'all') {
            return pulses;
        }

        const now = new Date();
        let startDate;

        switch (dateRange.value) {
            case 'last30':
                startDate = new Date();
                startDate.setDate(now.getDate() - 30);
                break;
            case 'last90':
                startDate = new Date();
                startDate.setDate(now.getDate() - 90);
                break;
            case 'last6months':
                startDate = new Date();
                startDate.setMonth(now.getMonth() - 6);
                break;
            case 'lastyear':
                startDate = new Date();
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return pulses;
        }

        return pulses.filter(pulse => {
            const pulseDate = new Date(pulse.day);
            return pulseDate >= startDate;
        });
    };

    const processedData = useMemo(() => {
        const filteredPulses = getFilteredPulses();
        if (!filteredPulses || filteredPulses.length === 0) return [];
        
        const groupedByDay = {};
        filteredPulses.forEach((pulse) => {
            const dateKey = new Date(pulse.day).toISOString().split('T')[0]; 
            if (!groupedByDay[dateKey]) {
                groupedByDay[dateKey] = [];
            }
            groupedByDay[dateKey].push(pulse);
        });
        
        const allDates = Object.keys(groupedByDay).sort();
        
        return allDates.map(dateStr => {
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });

            const dayPulses = groupedByDay[dateStr] || [];
            const totalScore = dayPulses.reduce((sum, pulse) => sum + pulse.score, 0);
            const averageScore = dayPulses.length > 0 
                ? Math.round((totalScore / dayPulses.length) * 10) / 10 
                : null;
            
            return {
                date: formattedDate,
                fullDate: dateStr,
                teamScore: averageScore,
                responseCount: dayPulses.length
            };
        })
    }, [pulses, dateRange]);

    const uniqueUsernames = useMemo(() => {
        const filteredPulses = getFilteredPulses();
        return [...new Set(filteredPulses.map(pulse => pulse.username))];
    }, [pulses, dateRange]);

    const userColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-sm">
                    <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{label}</p>
                    <div className="space-y-2">
                        {uniqueUsernames.map(username => {
                            const score = data[username];
                            if (score !== null && score !== undefined) {
                                return (
                                    <div key={username} className="border-l-2 pl-2" style={{borderColor: userColors[uniqueUsernames.indexOf(username) % userColors.length]}}>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{username}: {score}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    const selectStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            '&:hover': {
                borderColor: theme === 'dark' ? '#6b7280' : '#9ca3af',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #d1d5db',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused 
                ? (theme === 'dark' ? '#4b5563' : '#f3f4f6')
                : (theme === 'dark' ? '#374151' : '#ffffff'),
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            '&:hover': {
                backgroundColor: theme === 'dark' ? '#4b5563' : '#f3f4f6',
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: theme === 'dark' ? '#f9fafb' : '#111827',
        }),
    };

    if (!pulses || pulses.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No pulse data available
            </div>
        );
    }

    return (
        <div className="w-full">
           <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Average Pulse Summary</h3>
            <div className="flex items-center justify-between mb-6">
                <Select
                    value={dateRange}
                    onChange={setDateRange}
                    options={dateRangeOptions}
                    isSearchable={false}
                    className="min-w-[200px]"
                    styles={selectStyles}
                />
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={processedData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
                    <XAxis 
                        dataKey="date" 
                        stroke={theme === 'dark' ? '#d1d5db' : '#6b7280'}
                        fontSize={12}
                    />
                    <YAxis 
                        stroke={theme === 'dark' ? '#d1d5db' : '#6b7280'}
                        fontSize={12}
                        domain={[0, 5]}
                        ticks={[0, 1, 2, 3, 4, 5]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="teamScore"        
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        connectNulls={true}
                        name="Team Pulse"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ContribuorPulseChart