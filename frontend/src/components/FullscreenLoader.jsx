import React from 'react';

const FullscreenLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <h2 className="mt-4 text-xl font-bold text-primary">Avani Enterprises</h2>
                <p className="text-text-muted text-sm">Loading...</p>
            </div>
        </div>
    );
};

export default FullscreenLoader;
