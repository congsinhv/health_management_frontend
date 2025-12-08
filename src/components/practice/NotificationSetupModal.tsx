'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Smartphone,
  Bell,
  RefreshCw,
  CheckCircle,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  detectPlatform,
  isInstalledPWA,
  type Platform,
} from '@/lib/utils/platform';
import { requestNotificationPermission } from '@/lib/firebase';
import { useRegisterDevice, useDevices } from '@/hooks/useDevices';
import { deviceService } from '@/services/device';
import type { Device } from '@/types/device';

interface NotificationSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const NotificationSetupModal = ({
  open,
  onOpenChange,
  onSuccess,
}: NotificationSetupModalProps) => {
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const {
    data: devicesData,
    refetch: refetchDevices,
    isLoading: isLoadingDevices,
  } = useDevices();
  const registerDevice = useRegisterDevice();

  // Detect platform on mount
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // Check if user has mobile device
  const hasMobileDevice = devicesData?.devices
    ? deviceService.hasMobileDevice(devicesData.devices)
    : false;

  // Auto-close modal when mobile device is registered
  useEffect(() => {
    if (hasMobileDevice && open) {
      onOpenChange(false);
      onSuccess?.();
    }
  }, [hasMobileDevice, open, onOpenChange, onSuccess]);

  // Generate QR code URL
  const qrCodeUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/practice?device=register`
      : '';

  // Handle Android FCM registration
  const handleAndroidRegister = async () => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const token = await requestNotificationPermission();
      if (!token) {
        setRegistrationError(
          'Không thể lấy token thông báo. Vui lòng cho phép thông báo.'
        );
        return;
      }

      await registerDevice.mutateAsync({
        fcm_token: token,
        platform: 'android',
        device_name: navigator.userAgent.substring(0, 50),
      });
    } catch (error) {
      setRegistrationError('Đăng ký thiết bị thất bại. Vui lòng thử lại.');
      console.error('Device registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle iOS PWA registration
  const handleIOSRegister = async () => {
    if (!isInstalledPWA()) {
      // Show instructions to install PWA first
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const token = await requestNotificationPermission();
      if (!token) {
        setRegistrationError(
          'Vui lòng cho phép thông báo trong cài đặt Safari.'
        );
        return;
      }

      await registerDevice.mutateAsync({
        fcm_token: token,
        platform: 'ios',
        device_name: 'iPhone/iPad',
      });
    } catch (error) {
      setRegistrationError('Đăng ký thiết bị thất bại. Vui lòng thử lại.');
      console.error('Device registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle refetch
  const handleCheckAgain = async () => {
    await refetchDevices();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Bell className='text-primary h-5 w-5' />
            Đăng ký nhận thông báo
          </DialogTitle>
          <DialogDescription>
            Để nhận nhắc nhở tập luyện, bạn cần đăng ký thiết bị di động.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Desktop: QR Code */}
          {platform === 'desktop' && (
            <DesktopQRContent
              qrCodeUrl={qrCodeUrl}
              onCheckAgain={handleCheckAgain}
              isLoading={isLoadingDevices}
            />
          )}

          {/* Android: Registration Button */}
          {platform === 'android' && (
            <AndroidContent
              onRegister={handleAndroidRegister}
              isRegistering={isRegistering}
              error={registrationError}
            />
          )}

          {/* iOS: PWA Instructions */}
          {platform === 'ios' && (
            <IOSContent
              isInstalled={isInstalledPWA()}
              onRegister={handleIOSRegister}
              isRegistering={isRegistering}
              error={registrationError}
            />
          )}

          {/* Registered devices count */}
          {devicesData?.devices && devicesData.devices.length > 0 && (
            <RegisteredDevicesInfo devices={devicesData.devices} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Desktop QR Code sub-component
const DesktopQRContent = ({
  qrCodeUrl,
  onCheckAgain,
  isLoading,
}: {
  qrCodeUrl: string;
  onCheckAgain: () => void;
  isLoading: boolean;
}) => (
  <div className='flex flex-col items-center gap-4'>
    <div className='rounded-lg border bg-white p-4'>
      <QRCodeSVG
        value={qrCodeUrl}
        size={180}
        level='M'
        includeMargin
        className='rounded'
      />
    </div>
    <p className='text-muted-foreground text-center text-sm'>
      Quét mã QR bằng điện thoại để đăng ký thiết bị
    </p>
    <Button
      variant='outline'
      onClick={onCheckAgain}
      disabled={isLoading}
      className='gap-2'
    >
      <RefreshCw
        className={cn(
          'h-4 w-4',
          isLoading && 'bg-primary/10 text-primary animate-spin'
        )}
      />
      {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
    </Button>
  </div>
);

// Android registration sub-component
const AndroidContent = ({
  onRegister,
  isRegistering,
  error,
}: {
  onRegister: () => void;
  isRegistering: boolean;
  error: string | null;
}) => (
  <div className='flex flex-col items-center gap-4'>
    <div className='bg-primary/10 rounded-full p-4'>
      <Smartphone className='text-primary h-12 w-12' />
    </div>
    <p className='text-muted-foreground text-center text-sm'>
      Nhấn nút bên dưới để đăng ký nhận thông báo trên thiết bị này
    </p>
    <Button
      onClick={onRegister}
      disabled={isRegistering}
      className='w-full gap-2 bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white'
    >
      {isRegistering ? (
        <>
          <RefreshCw className='h-4 w-4 animate-spin' />
          Đang đăng ký...
        </>
      ) : (
        <>
          <Bell className='h-4 w-4' />
          Đăng ký thông báo
        </>
      )}
    </Button>
    {error && <p className='text-destructive text-center text-sm'>{error}</p>}
  </div>
);

// iOS PWA instructions sub-component
const IOSContent = ({
  isInstalled,
  onRegister,
  isRegistering,
  error,
}: {
  isInstalled: boolean;
  onRegister: () => void;
  isRegistering: boolean;
  error: string | null;
}) => (
  <div className='flex flex-col items-center gap-4'>
    <div className='bg-primary/10 rounded-full p-4'>
      <Download className='text-primary h-12 w-12' />
    </div>

    {!isInstalled ? (
      <>
        <p className='text-center text-sm font-medium'>
          Thêm VHealth vào Màn hình chính
        </p>
        <ol className='text-muted-foreground space-y-2 text-sm'>
          <li className='flex items-start gap-2'>
            <span className='bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
              1
            </span>
            <span>
              Nhấn nút <strong>Chia sẻ</strong> (hình vuông có mũi tên)
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
              2
            </span>
            <span>
              Cuộn xuống và chọn <strong>Thêm vào Màn hình chính</strong>
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
              3
            </span>
            <span>
              Nhấn <strong>Thêm</strong> ở góc trên bên phải
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
              4
            </span>
            <span>Mở ứng dụng từ màn hình chính và quay lại đây</span>
          </li>
        </ol>
      </>
    ) : (
      <>
        <p className='text-muted-foreground text-center text-sm'>
          Ứng dụng đã được cài đặt. Nhấn nút bên dưới để đăng ký thông báo.
        </p>
        <Button
          onClick={onRegister}
          disabled={isRegistering}
          className='w-full gap-2 bg-gradient-to-r from-[#00bba7] to-[#00bc7d] text-white'
        >
          {isRegistering ? (
            <>
              <RefreshCw className='h-4 w-4 animate-spin' />
              Đang đăng ký...
            </>
          ) : (
            <>
              <Bell className='h-4 w-4' />
              Đăng ký thông báo
            </>
          )}
        </Button>
        {error && (
          <p className='text-destructive text-center text-sm'>{error}</p>
        )}
      </>
    )}
  </div>
);

// Registered devices info
const RegisteredDevicesInfo = ({ devices }: { devices: Device[] }) => {
  const mobileCount = devices.filter(
    d => d.platform === 'ios' || d.platform === 'android'
  ).length;

  if (mobileCount === 0) return null;

  return (
    <div className='flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700'>
      <CheckCircle className='h-4 w-4' />
      <span>Đã đăng ký {mobileCount} thiết bị di động</span>
    </div>
  );
};
