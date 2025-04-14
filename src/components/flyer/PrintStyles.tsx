
import React from 'react';

const PrintStyles: React.FC = () => {
  return (
    <style>
      {`
        @media print {
          @page {
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}
    </style>
  );
};

export default PrintStyles;
