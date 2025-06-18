import React from 'react'

interface OnCallKPIProps{
    onCallIncidents: number
    aveCompletedPerPerson: number
}

const OnCallKPICard: React.FC<OnCallKPIProps> = ({onCallIncidents, aveCompletedPerPerson}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-sm dark:hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">On-Call</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {onCallIncidents}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total incidents resolved</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {aveCompletedPerPerson.toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average per team member</p>
                </div>
            </div>
        </div>
    )
}

export default OnCallKPICard