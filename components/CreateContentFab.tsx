
import React from 'react';
import { PlusIcon } from './icons';

interface CreateContentFabProps {
    onClick: () => void;
}

export const CreateContentFab: React.FC<CreateContentFabProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-gradient-to-tr from-irys-cyan-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 focus:outline-none focus:ring-4 focus:ring-irys-cyan-500/50 transition-transform z-50"
            aria-label="Create new content"
        >
            <PlusIcon />
        </button>
    );
};
