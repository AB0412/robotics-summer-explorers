
import React from 'react';

const PrintStyles: React.FC = () => {
  return (
    <style>
      {`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.4cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
        }
      `}
    </style>
  );
};

export default PrintStyles;
