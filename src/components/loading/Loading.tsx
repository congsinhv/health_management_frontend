import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/Loading_Dots_Blue.json';

interface LoadingProps {
  desc?: string;
}
const Loading = ({ desc }: LoadingProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <div className='w-[20%]'>
        <Lottie animationData={loadingAnimation} />
      </div>
      {desc && <p>{desc}</p>}
    </div>
  );
};

export default Loading;
