
import React from 'react';
import { Story } from '../types';

interface StoryReelProps {
    stories: Story[];
}

export const StoryReel: React.FC<StoryReelProps> = ({ stories }) => {
    return (
        <div className="mb-8">
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {stories.map(story => (
                    <div key={story.id} className="flex-shrink-0 text-center cursor-pointer group">
                        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-irys-cyan-500 to-purple-500 group-hover:scale-105 transition-transform">
                            <img
                                src={story.user.avatarUrl}
                                alt={story.user.name}
                                className="w-full h-full rounded-full object-cover border-2 border-slate-50 dark:border-slate-900"
                            />
                        </div>
                        <p className="text-xs mt-2 text-slate-500 dark:text-slate-400 truncate w-16">{story.user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
