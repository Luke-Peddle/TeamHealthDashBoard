import React, { useState } from 'react';
import PulseSurvey from '../../PulseServey/PulseServey';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ContributorSidePanel = ({ project, userId }) => {
  const [openPulseSurvey, setPulseSurvey] = useState(false);

  const handleSurvey = () => {
    setPulseSurvey(true);
  };

  const handleCloseSurvey = () => {
    setPulseSurvey(false);
  };

  return (
    <div>
      <button
        onClick={handleSurvey}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <span>Take Pulse Survey</span>
      </button>

      <Dialog open={openPulseSurvey} onOpenChange={setPulseSurvey}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Daily Pulse Survey
            </DialogTitle>
          </DialogHeader>
          <PulseSurvey project={project} user_id={userId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContributorSidePanel;