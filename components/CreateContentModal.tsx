import React, { useState, useRef } from 'react';
import { User, Post, Poll } from '../types';
import { CloseIcon, SparklesIcon, PostIcon, PollIcon, StoryIcon, ImageIcon, PlusIcon, TrashIcon } from './icons';
import { generatePostSuggestion } from '../services/geminiService';

interface CreateContentModalProps {
    user: User;
    onClose: () => void;
    onCreate: (item: Omit<Post, 'id' | 'likes' | 'comments' | 'user'> | Omit<Poll, 'id' | 'likes' | 'comments' | 'user'>) => void;
}

type ContentType = 'Post' | 'Poll' | 'Story';

const AiHelper: React.FC<{ onSuggestion: (text: string) => void }> = ({ onSuggestion }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const suggestion = await generatePostSuggestion(prompt);
            onSuggestion(suggestion);
            setPrompt('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
                <SparklesIcon className="text-irys-cyan-400" />
                <label htmlFor="ai-prompt" className="text-sm font-medium text-slate-700 dark:text-slate-300">Generate with AI</label>
            </div>
            <input
                id="ai-prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a post about my first space flight"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 mt-2 text-sm text-slate-800 dark:text-slate-200 focus:ring-irys-cyan-500 focus:border-irys-cyan-500"
                disabled={isLoading}
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full mt-2 px-4 py-2 text-sm font-semibold text-white bg-irys-cyan-600 rounded-md hover:bg-irys-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
        </div>
    );
};


export const CreateContentModal: React.FC<CreateContentModalProps> = ({ user, onClose, onCreate }) => {
    const [activeTab, setActiveTab] = useState<ContentType>('Post');
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState<string | null>(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleTabChange = (tab: ContentType) => {
        setActiveTab(tab);
        // Reset content when switching tabs to avoid confusion
        setPostContent('');
        setPostImage(null);
        setPollQuestion('');
        setPollOptions(['', '']);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = () => {
        if (activeTab === 'Post' && (postContent.trim() || postImage)) {
            onCreate({
                type: 'post',
                content: postContent,
                imageUrl: postImage || undefined,
                timestamp: new Date().toISOString(),
            });
        } else if (activeTab === 'Poll' && pollQuestion.trim() && pollOptions.every(o => o.trim())) {
             onCreate({
                type: 'poll',
                question: pollQuestion,
                options: pollOptions.map((opt, i) => ({ id: `opt${i+1}`, text: opt, votes: 0})),
                timestamp: new Date().toISOString(),
            });
        }
    };
    
    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, '']);
        }
    };
    
    const removePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Story':
                return (
                    <div className="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center h-64">
                        <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Upload a photo or video</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Stories are visible for 24 hours.</p>
                        <button className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-irys-cyan-600 rounded-md hover:bg-irys-cyan-500 transition-colors">Select from device</button>
                    </div>
                );
            case 'Poll':
                return (
                    <div>
                        <textarea
                            value={pollQuestion}
                            onChange={e => setPollQuestion(e.target.value)}
                            placeholder="What's your question?"
                            className="w-full h-20 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-3 text-slate-800 dark:text-slate-200 focus:ring-irys-cyan-500 focus:border-irys-cyan-500"
                        />
                        <div className="mt-4 space-y-2">
                             {pollOptions.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={e => handlePollOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm text-slate-800 dark:text-slate-200 focus:ring-irys-cyan-500 focus:border-irys-cyan-500"
                                    />
                                    {pollOptions.length > 2 && <button onClick={() => removePollOption(index)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>}
                                </div>
                            ))}
                        </div>
                        {pollOptions.length < 5 && <button onClick={addPollOption} className="mt-2 flex items-center gap-1 text-sm text-irys-cyan-400 hover:text-irys-cyan-300"><PlusIcon className="w-4 h-4"/> Add option</button>}
                    </div>
                );
            case 'Post':
            default:
                return (
                     <div>
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder={`What's on your mind, ${user.name}?`}
                            className="w-full h-32 bg-slate-100 dark:bg-slate-800 border-none rounded-md p-3 text-slate-800 dark:text-slate-200 focus:ring-0"
                        />
                        {postImage && (
                            <div className="mt-3 relative">
                                <img src={postImage} alt="Selected preview" className="rounded-lg max-h-60 w-full object-cover" />
                                <button
                                    onClick={() => setPostImage(null)}
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                                    aria-label="Remove image"
                                >
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <div className="mt-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                            <input
                                type="file"
                                ref={imageInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => imageInputRef.current?.click()}
                                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 transition-colors p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                aria-label="Add image"
                            >
                                <ImageIcon className="w-5 h-5"/> Add Image
                            </button>
                        </div>
                        <AiHelper onSuggestion={setPostContent} />
                    </div>
                );
        }
    };
    
    const isPostable = (activeTab === 'Post' && (postContent.trim() !== '' || postImage !== null)) || (activeTab === 'Poll' && pollQuestion.trim() !== '' && pollOptions.every(o => o.trim() !== ''));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Create Content</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button>
                </div>
                
                <div className="p-4">
                    <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                        {(['Post', 'Poll', 'Story'] as ContentType[]).map(tab => {
                            const icons = { Post: <PostIcon />, Poll: <PollIcon />, Story: <StoryIcon /> };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-irys-cyan-400 border-b-2 border-irys-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                >
                                    {icons[tab]} {tab}
                                </button>
                            )
                        })}
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full"/>
                        <div className="flex-1">
                           {renderContent()}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={handleCreate}
                        disabled={!isPostable}
                        className="px-6 py-2 font-semibold text-white bg-irys-cyan-600 rounded-md hover:bg-irys-cyan-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {activeTab}
                    </button>
                </div>
            </div>
        </div>
    );
};