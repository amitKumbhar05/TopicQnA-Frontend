import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );
}