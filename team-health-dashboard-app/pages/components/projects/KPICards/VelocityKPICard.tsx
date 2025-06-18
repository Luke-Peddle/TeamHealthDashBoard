import React from 'react'
import { velocity } from '@/types/velocity'

interface VelocityKPICardProps {
    velocity: velocity | undefined
}

const VelocityKPICard: React.FC<VelocityKPICardProps> = ({ velocity }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-sm dark:hover:shadow-md transition-all duration-200">
            <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {velocity?.story_points_completed || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Story points completed</p>
            </div>
        </div>
    )
}

export default VelocityKPICard