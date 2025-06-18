import React, { useMemo, useState } from 'react'
import Select from 'react-select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTheme } from 'next-themes';

const SprintChart = ({incidents, velocitites, codeReviews, sprints}) => {
    const [dateRange, setDateRange] = useState({ value: 'all', label: 'All Time' });
    const [hiddenSeries, setHiddenSeries] = useState<{[key: string]: boolean}>({});
    const { theme } = useTheme();

    const dateRangeOptions = [
       { value: 'all', label: 'All Time' },
       { value: 'last30', label: 'Last 30 Days' },
       { value: 'last90', label: 'Last 90 Days' },
       { value: 'last6months', label: 'Last 6 Months' },
       { value: 'lastyear', label: 'Last Year' }
    ];

    // React-select dark mode styles
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
   
    const processedData = useMemo(() => {
        if (!incidents || !velocitites || !codeReviews || !sprints) {
            return [];
        }
        velocitites.forEach(velocity => {
            const sprint = sprints?.find(sprint => sprint.id === velocity.sprint_id);
            if (sprint) {
                const endDate = new Date(sprint.end_date)
                velocity.endDate = endDate.toDateString()
                velocity.sprint_name = sprint.name
                velocity.end_date = sprint.end_date
            }
        })

        incidents.forEach(incident => {
            const sprint = sprints?.find(sprint => sprint.id === incident.sprint_id);
            if (sprint) {
                const endDate = new Date(sprint.end_date)
                incident.endDate = endDate.toDateString()
                incident.sprint_name = sprint.name
                incident.end_date = sprint.end_date
            }
        })

        codeReviews.forEach(code => {
            const sprint = sprints?.find(sprint => sprint.id === code.sprint_id);
            if (sprint) {
                const endDate = new Date(sprint.end_date)
                code.endDate = endDate.toDateString()
                code.sprint_name = sprint.name
                code.end_date = sprint.end_date
            }
        })

        const sprintData = {};
        
        velocitites.forEach(velocity => {
            if (velocity.sprint_name) {
                if (!sprintData[velocity.sprint_name]) {
                    sprintData[velocity.sprint_name] = {
                        sprintName: velocity.sprint_name,
                        sprintDisplay: `${velocity.sprint_name}\n${new Date(velocity.end_date).toLocaleDateString()}`,
                        endDate: velocity.end_date,
                        velocity: 0,
                        incidents: 0,
                        codeReviews: 0
                    };
                }
                sprintData[velocity.sprint_name].velocity = velocity.story_points_completed || 0;
            }
        });

        incidents.forEach(incident => {
            if (incident.sprint_name) {
                if (!sprintData[incident.sprint_name]) {
                    sprintData[incident.sprint_name] = {
                        sprintName: incident.sprint_name,
                        sprintDisplay: `${incident.sprint_name}\n${new Date(incident.end_date).toLocaleDateString()}`,
                        endDate: incident.end_date,
                        velocity: 0,
                        incidents: 0,
                        codeReviews: 0
                    };
                }
                sprintData[incident.sprint_name].incidents += incident.incidents_count || 0;
            }
        });

        codeReviews.forEach(code => {
            if (code.sprint_name) {
                if (!sprintData[code.sprint_name]) {
                    sprintData[code.sprint_name] = {
                        sprintName: code.sprint_name,
                        sprintDisplay: `${code.sprint_name}\n${new Date(code.end_date).toLocaleDateString()}`,
                        endDate: code.end_date,
                        velocity: 0,
                        incidents: 0,
                        codeReviews: 0
                    };
                }
                sprintData[code.sprint_name].codeReviews += code.prs_reviewed || 0;
            }
        });

        return Object.values(sprintData).sort((a, b) => 
            new Date(a.endDate) - new Date(b.endDate)
        );
    }, [incidents, velocitites, codeReviews, sprints]);

    const getFilteredData = () => {
        if (dateRange.value === 'all') {
            return processedData;
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
                return processedData;
        }

        return processedData.filter(item => {
            const itemDate = new Date(item.endDate);
            return itemDate >= startDate;
        });
    }

    const filteredData = getFilteredData();

    if (!incidents || !velocitites || !codeReviews || !sprints) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No data available</p>
                </div>
            </div>
        );
    }

    // Enhanced tooltip with sprint information
    const customTooltip = ({active, payload, label}: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            
            return (
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transition-colors duration-200">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        {data.sprintName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        Ended: {new Date(data.endDate).toLocaleDateString()}
                    </p>
                    <div className="space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-sm" 
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{entry.name}</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Legend toggle functionality
    const handleLegendClick = (entry: any) => {
        const { dataKey } = entry;
        setHiddenSeries(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };

    // CSV Export functionality
    const exportToCSV = () => {
        const csvData = filteredData.map(sprint => ({
            'Sprint Name': sprint.sprintName,
            'End Date': new Date(sprint.endDate).toLocaleDateString(),
            'Story Points Completed': sprint.velocity,
            'Code Reviews': sprint.codeReviews,
            'Incidents': sprint.incidents,
        }));

        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => 
                headers.map(header => 
                    typeof row[header] === 'string' && row[header].includes(',') 
                    ? `"${row[header]}"` 
                    : row[header]
                ).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sprint-comparison-${dateRange.label.toLowerCase().replace(' ', '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    console.log("Incidents in sprint Chart", incidents[0]);
    console.log("velocities in sprint Chart", velocitites[0]);
    console.log("Code reviews in sprint Chart", codeReviews[0]);
    console.log("Sprints data", sprints);
    console.log("Processed chart data", processedData);
    console.log("Filtered chart data", filteredData);

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">Sprint Comparisons</h3>
                
                <Button 
                    onClick={exportToCSV}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={filteredData.length === 0}
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            <div className="flex items-center mb-6">
               <Select
                   value={dateRange}
                   onChange={(selectedOption) => {
                       if (selectedOption) {
                           setDateRange(selectedOption);
                       }
                   }}
                   options={dateRangeOptions}
                   isSearchable={false}
                   className="min-w-[200px]"
                   styles={selectStyles}
               />
           </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
                        <XAxis 
                            dataKey="sprintDisplay" 
                            tick={{ fontSize: 10, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                            label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: theme === 'dark' ? '#d1d5db' : '#6b7280' } }}
                        />
                        <Tooltip content={customTooltip} />
                        <Legend 
                            onClick={handleLegendClick}
                            wrapperStyle={{ 
                                cursor: 'pointer',
                                paddingTop: '20px'
                            }}
                        />
                        <Bar 
                            dataKey="velocity" 
                            fill="#3b82f6"
                            name="Story Points Completed"
                            radius={[2, 2, 0, 0]}
                            hide={hiddenSeries.velocity}
                        />
                        <Bar 
                            dataKey="codeReviews" 
                            fill="#10b981"
                            name="Code Reviews"
                            radius={[2, 2, 0, 0]}
                            hide={hiddenSeries.codeReviews}
                        />
                        <Bar 
                            dataKey="incidents" 
                            fill="#ef4444"
                            name="Incidents"
                            radius={[2, 2, 0, 0]}
                            hide={hiddenSeries.incidents}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SprintChart