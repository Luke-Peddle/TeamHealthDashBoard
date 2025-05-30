import React from 'react'

interface OnCallKPIProps{
    onCallIncidents: number
    aveCompletedPerPerson: number
}

const OnCallKPICard: React.FC<OnCallKPIProps> = ({onCallIncidents, aveCompletedPerPerson}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">On-Call</h3>
                
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold text-gray-900">
                        {onCallIncidents}
                    </div>
                    <p className="text-sm text-gray-600">Total incidents resolved</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                    <div className="text-lg font-semibold text-gray-700">
                        {aveCompletedPerPerson.toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600">Average per team member</p>
                </div>
            </div>
        </div>
    )
}

export default OnCallKPICard