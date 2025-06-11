import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Select from 'react-select';
import { incidents } from '@/types/onCall';

interface IncidentsChartsProps {
   incidents: incidents[]
}

interface SelectOption {
   value: string;
   label: string;
}

const ContributorIncidentChart: React.FC<IncidentsChartsProps>  = ({incidents}) => {

    const [dateRange, setDateRange] = useState<SelectOption>({ value: 'all', label: 'All Time' });
    
    const dateRangeOptions: SelectOption[] = [
        { value: 'all', label: 'All Time' },
        { value: 'last30', label: 'Last 30 Days' },
        { value: 'last90', label: 'Last 90 Days' },
        { value: 'last6months', label: 'Last 6 Months' },
        { value: 'lastyear', label: 'Last Year' }
    ];

    if (!incidents || incidents.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500">No incident data available</p>
                </div>
            </div>
        );
    }

    const getFilteredData = () => {
        if (dateRange.value === 'all') {
            return incidents;
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
                return incidents;
        }

        return incidents.filter(item => {
            const itemDate = new Date(item.week_starting_date);
            return itemDate >= startDate;
        });
    };

    const filteredIncidents = getFilteredData();

    const groupedData: { [key: string]: { date: string; totalIncidents: number; } } = {};
    
    filteredIncidents.forEach(incident => {
        const date = new Date(incident.week_starting_date).toLocaleDateString();
        if (!groupedData[date]) {
            groupedData[date] = { 
                date, 
                totalIncidents: 0, 
                
            };
        }
        groupedData[date].totalIncidents += incident.incidents_count;
       
    });

    const data = Object.values(groupedData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                    <p className="font-semibold text-gray-800 mb-2">
                        Week of: {label}
                    </p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Total Incidents:</span>
                            <span className="font-medium text-gray-900">{data.totalIncidents}</span>
                        </div>
                      
                    </div>
                   
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full">
            <h3 className="text-lg font-semibold mb-4">Team Incident Summary</h3>
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
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
                    />
                </div>
            </div>
            
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            label={{ value: 'Total Incidents', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="totalIncidents" 
                            fill="#ef4444"
                            name="Total Incidents"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ContributorIncidentChart