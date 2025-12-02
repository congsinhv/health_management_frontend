import React from 'react';
import { HealthAnalysis } from '@/types/prediction';

interface HealthAnalysisSectionProps {
  analysis: HealthAnalysis;
}

const HealthAnalysisSection: React.FC<HealthAnalysisSectionProps> = ({
  analysis,
}) => {
  return (
    <div className='space-y-4'>
      {/* Analysis Paragraphs */}
      <div className='flex flex-col gap-1'>
        {analysis.paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className='bg-[#F9FAFA] p-4 leading-relaxed text-gray-700 first:rounded-t-xl last:rounded-b-xl'
          >
            <p className='text-sm'>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthAnalysisSection;
