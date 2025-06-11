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
     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Pulse Score</h3>
                
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold text-gray-900">
                        {Math.floor(avgePulseScore * 100) / 100}
                    </div>
                    <p className="text-sm text-gray-600">Avrage Pulse Score</p>
                </div>
                
               
        </div>
    </div>
  )
}

export default PulseKPICard