import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  const router = useRouter();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className='flex items-center'>
        <Image
          src='/Healthcare_logo.svg'
          alt='VHealth'
          width={140}
          height={28}
          priority
          className='h-7 w-auto cursor-pointer'
          onClick={() => router.push('/')}
        />
      </div>
    </div>
  );
}
