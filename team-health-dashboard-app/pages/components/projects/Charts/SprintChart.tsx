import React, { useMemo } from 'react'
import { useState } from 'react';
import Select from 'react-select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SprintChart = ({incidents, velocitites, codeReviews, sprints}) => {
    // All hooks must be called before any early returns
    const [dateRange, setDateRange] = useState({ value: 'all', label: 'All Time' });

    const dateRangeOptions = [
       { value: 'all', label: 'All Time' },
       { value: 'last30', label: 'Last 30 Days' },
       { value: 'last90', label: 'Last 90 Days' },
       { value: 'last6months', label: 'Last 6 Months' },
       { value: 'lastyear', label: 'Last Year' }
    ];
   
    const processedData = useMemo(() => {
        // Handle null data inside useMemo instead of early return
        if (!incidents || !velocitites || !codeReviews || !sprints) {
            return [];
        }
        // Add sprint info to velocities
        velocitites.forEach(velocity => {
            const sprint = sprints?.find(sprint => sprint.id === velocity.sprint_id);
            if (sprint) {
                const endDate = new Date(sprint.end_date)
                velocity.endDate = endDate.toDateString()
                velocity.sprint_name = sprint.name
                velocity.end_date = sprint.end_date
            }
        })

        // Add sprint info to incidents
        incidents.forEach(incident => {
            const sprint = sprints?.find(sprint => sprint.id === incident.sprint_id);
            if (sprint) {
                const endDate = new Date(sprint.end_date)
                incident.endDate = endDate.toDateString()
                incident.sprint_name = sprint.name
                incident.end_date = sprint.end_date
            }
        })

        // Add sprint info to code reviews
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
        
        // Add velocity data
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

        // Add incident data
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

        // Add code review data
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

    // Now safe to do early return after all hooks are called
    if (!incidents || !velocitites || !codeReviews || !sprints) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500">No data available</p>
                </div>
            </div>
        );
    }

    console.log("Incidents in sprint Chart", incidents[0]);
    console.log("velocities in sprint Chart", velocitites[0]);
    console.log("Code reviews in sprint Chart", codeReviews[0]);
    console.log("Sprints data", sprints);
    console.log("Processed chart data", processedData);
    console.log("Filtered chart data", filteredData);

    return (
        <div className="h-full">
            <h3 className="text-lg font-semibold mb-4">Sprint Comparisons</h3>
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
               />
           </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="sprintDisplay" 
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                        <Bar 
                            dataKey="velocity" 
                            fill="#3b82f6"
                            name="Story Points Completed"
                            radius={[2, 2, 0, 0]}
                        />
                        <Bar 
                            dataKey="codeReviews" 
                            fill="#10b981"
                            name="Code Reviews"
                            radius={[2, 2, 0, 0]}
                        />
                        <Bar 
                            dataKey="incidents" 
                            fill="#ef4444"
                            name="Incidents"
                            radius={[2, 2, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SprintChart