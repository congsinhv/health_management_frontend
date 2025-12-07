import React from 'react';

interface QuickResponsesProps {
  choices: string[];
  onSelect: (choice: string) => void;
}

export const QuickResponses: React.FC<QuickResponsesProps> = ({
  choices,
  onSelect,
}) => {
  return (
    <div className='animate-fadeIn my-4 flex flex-wrap gap-3 md:gap-2'>
      {choices.map((choice, index) => (
        <button
          key={index}
          className='cursor-pointer rounded-[20px] border border-none border-[rgba(79,209,199,0.3)] bg-[rgba(79,209,199,0.1)] px-5 py-3 text-[0.85rem] font-medium text-teal-700 shadow-[0_2px_8px_rgba(79,209,199,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg transition-all duration-300 hover:translate-y-[-2px] hover:border-[rgba(79,209,199,0.4)] hover:bg-[rgba(79,209,199,0.2)] hover:shadow-[0_4px_12px_rgba(79,209,199,0.2),inset_0_1px_0_rgba(255,255,255,0.5)] active:translate-y-0 md:px-4 md:py-2.5 md:text-[13px]'
          onClick={() => onSelect(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default QuickResponses;
