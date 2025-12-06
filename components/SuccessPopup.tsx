import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4 animate-fade-in">
        <CheckCircle className="w-8 h-8 text-green-500" />
        <p className="text-lg font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
