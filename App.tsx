import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { StoryReel } from './components/StoryReel';
import { Feed } from './components/Feed';
import { CreateContentFab } from './components/CreateContentFab';
import { CreateContentModal } from './components/CreateContentModal';
import { ProfileModal } from './components/ProfileModal';
import { Post, Poll, Story, User, ContentItem, Comment } from './types';

const mockUsers: User[] = [
    { id: 'u1', name: 'Aria', avatarUrl: 'https://picsum.photos/seed/u1/100/100' },
    { id: 'u2', name: 'Jax', avatarUrl: 'https://picsum.photos/seed/u2/100/100' },
    { id: 'u3', name: 'Lyra', avatarUrl: 'https://picsum.photos/seed/u3/100/100' },
    { id: 'u4', name: 'Zane', avatarUrl: 'https://picsum.photos/seed/u4/100/100' },
    { id: 'u5', name: 'Cora', avatarUrl: 'https://picsum.photos/seed/u5/100/100' },
];

const mockStories: Story[] = mockUsers.map(user => ({
    id: `s_${user.id}`,
    user: user,
    imageUrl: `https://picsum.photos/seed/s_${user.id}/400/700`,
    timestamp: new Date().toISOString(),
}));

const initialContent: ContentItem[] = [
    {
        type: 'post',
        id: 'p1',
        user: mockUsers[1],
        content: 'Just discovered a new nebula in the Irys system. The colors are breathtaking! ✨ #space #irysworld',
        imageUrl: 'https://picsum.photos/seed/p1/600/400',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 132,
        comments: [
            {
                id: 'c1',
                user: mockUsers[2],
                content: 'Wow, amazing find! Where is this located?',
                timestamp: new Date(Date.now() - 3500000).toISOString(),
                replies: [
                     {
                        id: 'c2',
                        user: mockUsers[1],
                        content: 'It\'s near the Orion sector. Sending you the coordinates!',
                        timestamp: new Date(Date.now() - 3400000).toISOString(),
                        replies: [],
                    }
                ],
            },
            {
                id: 'c3',
                user: mockUsers[4],
                content: 'I need to visit this place on my next exploration trip.',
                timestamp: new Date(Date.now() - 3200000).toISOString(),
                replies: [],
            }
        ],
    },
    {
        type: 'poll',
        id: 'poll1',
        user: mockUsers[2],
        question: 'What should be the next community-funded project in Irys World?',
        options: [
            { id: 'opt1', text: 'Interstellar Observatory', votes: 158 },
            { id: 'opt2', text: 'Zero-G Sports Arena', votes: 92 },
            { id: 'opt3', text: 'Bio-Dome Botanical Garden', votes: 210 },
        ],
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 45,
        comments: 23,
    },
    {
        type: 'post',
        id: 'p2',
        user: mockUsers[3],
        content: 'My humble setup for exploring the digital frontiers of Irys.',
        imageUrl: 'https://picsum.photos/seed/p2/600/400',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        likes: 256,
        comments: [],
    },
];

type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [content, setContent] = useState<ContentItem[]>(initialContent);
    const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    const handleCreateContent = useCallback((item: Omit<Post, 'id' | 'likes' | 'comments' | 'user'> | Omit<Poll, 'id' | 'likes' | 'comments' | 'user'>) => {
        const newContentItem: ContentItem = {
            ...item,
            id: `new_${Date.now()}`,
            user: currentUser,
            likes: 0,
            comments: item.type === 'post' ? [] : 0,
        } as ContentItem;
        setContent(prevContent => [newContentItem, ...prevContent]);
        setIsCreateModalOpen(false);
    }, [currentUser]);

    const handleUpdateUser = useCallback((updatedUser: User) => {
        setCurrentUser(updatedUser);
        setIsProfileModalOpen(false);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            <Header user={currentUser} onEditProfile={() => setIsProfileModalOpen(true)} theme={theme} setTheme={setTheme} />
            <main className="container mx-auto max-w-3xl p-4 pt-20">
                <StoryReel stories={mockStories} />
                <Feed content={content} currentUser={currentUser} />
            </main>
            <CreateContentFab onClick={() => setIsCreateModalOpen(true)} />
            {isCreateModalOpen && (
                <CreateContentModal
                    user={currentUser}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateContent}
                />
            )}
            {isProfileModalOpen && (
                <ProfileModal
                    user={currentUser}
                    onClose={() => setIsProfileModalOpen(false)}
                    onSave={handleUpdateUser}
                />
            )}
        </div>
    );
};

export default App;