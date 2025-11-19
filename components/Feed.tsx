import React from 'react';
import { ContentItem, User } from '../types';
import { PostComponent } from './PostComponent';
import { PollComponent } from './PollComponent';

interface FeedProps {
    content: ContentItem[];
    currentUser: User;
}

export const Feed: React.FC<FeedProps> = ({ content, currentUser }) => {
    return (
        <div className="space-y-6">
            {content.map(item => {
                if (item.type === 'post') {
                    return <PostComponent key={item.id} post={item} currentUser={currentUser} />;
                }
                if (item.type === 'poll') {
                    return <PollComponent key={item.id} poll={item} />;
                }
                return null;
            })}
        </div>
    );
};