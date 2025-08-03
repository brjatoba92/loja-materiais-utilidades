import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size='md', className = ''}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
        </div>
    );
};

export default LoadingSpinner;