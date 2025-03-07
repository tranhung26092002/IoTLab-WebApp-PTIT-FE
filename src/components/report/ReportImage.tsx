import React from 'react';
import { Image } from 'antd';
import { useAvatar } from '../../hooks/useAvatar';

// Create a separate Image component that uses the hook
const ReportImage: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const { imageUrl: displayUrl } = useAvatar(imageUrl);
  
  return (
    <div className="flex justify-center">
      {imageUrl && (
        <Image
          src={displayUrl}
          alt="Ảnh minh họa"
          className="max-h-24 object-contain"
          preview={{
            maskClassName: 'backdrop-blur-sm',
            mask: <div>Xem ảnh</div>
          }}
        />
      )}
    </div>
  );
};

export default ReportImage;

