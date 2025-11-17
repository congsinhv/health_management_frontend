import React from 'react';
import { UserInputData } from '@/types/prediction';

interface UserInfoSectionProps {
  data: UserInputData;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Demographics Section */}
      <div className='border-2 border-[#EFEFEF] rounded-xl'>
        <h3 className="text-xs font-semibold text-gray-900 px-4 py-3 border-b-2 border-[#EFEFEF]">
          Thông tin nhân khẩu học (Demographic Information)
        </h3>
        <div className="space-y-2 p-4">
          <InfoRow label="Tên người dùng" value={data.name}/>
          <InfoRow label="Giới tính" value={data.gender} />
          <InfoRow label="Chiều cao (m)" value={`${data.height} m`} />
          <InfoRow label="Cân nặng (kg)" value={`${data.weight} kg`} />
        </div>
      </div>

      {/* Eating Habits Section */}
      <div className='border-2 border-[#EFEFEF] rounded-xl'>
        <h3 className="text-xs font-semibold text-gray-900 px-4 py-3 border-b-2 border-[#EFEFEF]">
          Thói quen ăn uống
        </h3>
        <div className="space-y-2 p-4">
          <InfoRow label="Thường xuyên ăn nhiều calo không?" value={data.highCalorieFood} />
          {/* <InfoRow label="Có theo dõi calo hàng ngày không?" value={data.calo} /> */}
          <InfoRow label="Có thường xuyên ăn rau củ không?" value={data.vegetableFrequency} />
          <InfoRow label="Uống bao nhiêu nước mỗi ngày?" value={data.waterIntake} />
          <InfoRow label="Số bữa ăn chính mỗi ngày" value={`${data.mainMeals} bữa/ngày`} />
          <InfoRow label="Có ăn vặt xen giữa các bữa ăn chính không?" value={data.snackFrequency} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Activity Habits Section */}
      <div className='border-2 border-[#EFEFEF] rounded-xl'>
        <h3 className="text-xs font-semibold text-gray-900 px-4 py-3 border-b-2 border-[#EFEFEF]">
          Thói quen vận động
        </h3>
        <div className="space-y-2 p-4">
          <InfoRow label="Có thường xuyên tập thể dục không?" value={data.physicalActivity} />
          <InfoRow label="Mức độ sử dụng thiết bị điện tử/ngày" value={data.screenTime} />
          <InfoRow label="Phương tiện di chuyển thường dùng" value={data.transportation} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Other Habits Section */}
      <div className='border-2 border-[#EFEFEF] rounded-xl'>
        <h3 className="text-xs font-semibold text-gray-900 px-4 py-3 border-b-2 border-[#EFEFEF]">
          Thói quen khác
        </h3>
        <div className="space-y-2 p-4">
          <InfoRow label="Bạn có hút thuốc không?" value={data.smoking} />
          <InfoRow label="Bạn có thường xuyên sử dụng thức uống có cồn không?" value={data.alcohol} />
        </div>
      </div>
    </div>
  );
};

// Helper component for displaying info rows
interface InfoRowProps {
  label: string;
  value: string | number;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-start py-1">
      <span className="text-xs text-gray-600 flex-shrink-0 w-1/2">{label}:</span>
      <span className="text-xs text-gray-900 font-medium text-left flex-1">{value}</span>
    </div>
  );
};

export default UserInfoSection;

