import React from 'react';
import { HealthAnalysis } from '@/types/prediction';
import { AlertCircle } from 'lucide-react';

interface HealthAnalysisSectionProps {
  analysis: HealthAnalysis;
}

const HealthAnalysisSection: React.FC<HealthAnalysisSectionProps> = ({ analysis }) => {
  return (
    <div className="space-y-4">
      {/* Analysis Paragraphs */}
      <div className="space-y-4">
        {analysis.paragraphs.map((paragraph, index) => (
          <div key={index} className="text-gray-700 leading-relaxed">
            <p className="text-sm md:text-base">{paragraph}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-medium">* Lưu ý:</span> {analysis.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysisSection;

