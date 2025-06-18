import React from 'react'
import { pulse } from '@/types/Pulse';

interface PulseProps{
    pulses: pulse[]
}

const PulseKPICard: React.FC<PulseProps> = ({pulses}) => {

    let avgePulseScore = 0;

    pulses.forEach((pulse) =>{
        avgePulseScore += pulse.score;
    });

    avgePulseScore = avgePulseScore/pulses.length;
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-sm dark:hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Pulse Score</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {Math.floor(avgePulseScore * 100) / 100}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Pulse Score</p>
                </div>
            </div>
        </div>
    )
}

export default PulseKPICard