import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Select from 'react-select';
import { velocityCart } from '@/types/velocity';

interface VelocityChartProps {
   velocityData: velocityCart[];
}

interface SelectOption {
   value: string;
   label: string;
}

const VelocityChart: React.FC<VelocityChartProps> = ({velocityData}) => {
   const [dateRange, setDateRange] = useState<SelectOption>({ value: 'all', label: 'All Time' });

   const dateRangeOptions: SelectOption[] = [
       { value: 'all', label: 'All Time' },
       { value: 'last30', label: 'Last 30 Days' },
       { value: 'last90', label: 'Last 90 Days' },
       { value: 'last6months', label: 'Last 6 Months' },
       { value: 'lastyear', label: 'Last Year' }
   ];

   const getFilteredData = () => {
       if (dateRange.value === 'all') {
           return velocityData;
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
               return velocityData;
       }

       return velocityData.filter(item => {
           const itemDate = new Date(item.endDate);
           return itemDate >= startDate;
       });
   };

   const filteredData = getFilteredData();

   filteredData.sort((a, b) => 
       new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
   );

   const chartData = filteredData.map((velocity) => ({
       sprintName: velocity.endDate,
       storyPoints: velocity.story_points_completed
   }));

   return (
       <div className="h-full">
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
                   <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis 
                           dataKey="sprintName" 
                           tick={{ fontSize: 12, fill: '#6b7280' }}
                           angle={-45}
                           textAnchor="end"
                           height={80}
                       />
                       <YAxis 
                           tick={{ fontSize: 12, fill: '#6b7280' }}
                           label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }}
                       />
                       <Tooltip 
                           contentStyle={{
                               backgroundColor: 'white',
                               border: '1px solid #e5e7eb',
                               borderRadius: '8px',
                               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                           }}
                       />
                       <Line 
                           type="monotone" 
                           dataKey="storyPoints" 
                           stroke="#3b82f6" 
                           strokeWidth={3}
                           dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                           activeDot={{ r: 8, fill: '#1d4ed8' }}
                           name="Story Points Completed"
                       />
                   </LineChart>
               </ResponsiveContainer>
           </div>
       </div>
   )
}

export default VelocityChart