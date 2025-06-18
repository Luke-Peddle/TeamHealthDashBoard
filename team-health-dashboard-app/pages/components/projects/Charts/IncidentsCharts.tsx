import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { incidents } from '@/types/onCall';
import { useTheme } from 'next-themes';

interface IncidentsChartsProps {
   incidents: incidents[]
}

interface SelectOption {
   value: string;
   label: string;
}

interface GroupedData {
   [key: string]: {
       date: string;
       [username: string]: string | number;
   };
}

const IncidentsCharts: React.FC<IncidentsChartsProps> = ({incidents}) => {
   const [dateRange, setDateRange] = useState<SelectOption>({ value: 'all', label: 'All Time' });
   const [hiddenSeries, setHiddenSeries] = useState<{[key: string]: boolean}>({});
   const { theme } = useTheme();

   const dateRangeOptions: SelectOption[] = [
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

   if (!incidents || incidents.length === 0) {
       return (
           <div className="h-80 flex items-center justify-center">
               <div className="text-center">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                       <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                       </svg>
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No incident data available</p>
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

   const groupedData: GroupedData = {};
   
   filteredIncidents.forEach(incident => {
       const date = new Date(incident.week_starting_date).toLocaleDateString();
       if (!groupedData[date]) {
           groupedData[date] = { date };
       }
       if (incident.username) {
           groupedData[date][incident.username] = incident.incidents_count;
       }
   });

   const data = Object.values(groupedData);

   const uniqueUsers = Array.from(new Set(filteredIncidents.map(i => i.username).filter(Boolean)));
   const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

   // Enhanced tooltip with more information
   const CustomTooltip = ({ active, payload, label }: any) => {
       if (active && payload && payload.length) {
           const totalIncidents = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
           
           return (
               <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg min-w-[200px] transition-colors duration-200">
                   <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                       Week of: {label}
                   </p>
                   <div className="space-y-1">
                       {payload
                           .filter((entry: any) => entry.value > 0)
                           .sort((a: any, b: any) => b.value - a.value)
                           .map((entry: any, index: number) => (
                           <div key={index} className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                   <div 
                                       className="w-3 h-3 rounded-sm" 
                                       style={{ backgroundColor: entry.color }}
                                   />
                                   <span className="text-sm text-gray-700 dark:text-gray-300">{entry.dataKey}</span>
                               </div>
                               <span className="font-medium text-gray-900 dark:text-gray-100">{entry.value}</span>
                           </div>
                       ))}
                   </div>
                   <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                       <div className="flex justify-between">
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total:</span>
                           <span className="font-semibold text-gray-900 dark:text-gray-100">{totalIncidents}</span>
                       </div>
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

   const exportToCSV = () => {
       const csvData: any[] = [];
       
       data.forEach(weekData => {
           uniqueUsers.forEach(user => {
               if (weekData[user] && typeof weekData[user] === 'number' && weekData[user] > 0) {
                   csvData.push({
                       'Week Starting': weekData.date,
                       'Username': user,
                       'Incident Count': weekData[user],
                   });
               }
           });
       });

       if (csvData.length === 0) {
           data.forEach(weekData => {
               const totalIncidents = uniqueUsers.reduce((sum, user) => {
                   return sum + (typeof weekData[user] === 'number' ? weekData[user] as number : 0);
               }, 0);
               
               csvData.push({
                   'Week Starting': weekData.date,
                   'Total Incidents': totalIncidents,
                   'Date Range': dateRange.label
               });
           });
       }

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
       link.setAttribute('download', `incidents-data-${dateRange.label.toLowerCase().replace(' ', '-')}.csv`);
       link.style.visibility = 'hidden';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(url);
   };

   return (
       <div className="h-full">
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
                       styles={selectStyles}
                   />
               </div>
               
               <Button 
                   onClick={exportToCSV}
                   variant="outline"
                   size="sm"
                   className="flex items-center gap-2"
                   disabled={filteredIncidents.length === 0}
               >
                   <Download className="w-4 h-4" />
                   Export CSV
               </Button>
           </div>
           
           <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
                       <XAxis 
                           dataKey="date" 
                           tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                           angle={-45}
                           textAnchor="end"
                           height={80}
                       />
                       <YAxis 
                           tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                           label={{ value: 'Incidents', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: theme === 'dark' ? '#d1d5db' : '#6b7280' } }}
                       />
                       <Tooltip content={<CustomTooltip />} />
                       <Legend 
                           onClick={handleLegendClick}
                           wrapperStyle={{ 
                               cursor: 'pointer',
                               paddingTop: '20px'
                           }}
                       />
                       {uniqueUsers.map((user, index) => (
                           <Bar 
                               key={user}
                               dataKey={user} 
                               fill={colors[index % colors.length]}
                               name={user}
                               radius={[2, 2, 0, 0]}
                               hide={hiddenSeries[user]}
                           />
                       ))}
                   </BarChart>
               </ResponsiveContainer>
           </div>
       </div>
   );
};

export default IncidentsCharts;