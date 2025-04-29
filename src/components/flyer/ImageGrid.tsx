
import React from 'react';

const ImageGrid: React.FC = () => {
  return (
    <div className="mb-6 print:mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3">
      <div className="rounded-lg overflow-hidden h-36 print:h-32">
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
          alt="Children learning robotics" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="rounded-lg overflow-hidden h-36 print:h-32">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
          alt="Kids working with technology" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ImageGrid;
