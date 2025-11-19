import React, { useState } from 'react';
import { Comment, User } from '../types';
import { SendIcon } from './icons';

interface CommentComponentProps {
    comment: Comment;
    onReply: (commentId: string, replyContent: string) => void;
    currentUser: User;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
};

export const CommentComponent: React.FC<CommentComponentProps> = ({ comment, onReply, currentUser }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setReplyContent('');
        setIsReplying(false);
    };

    return (
        <div className="flex items-start gap-3 my-4">
            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
                <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{comment.user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(comment.timestamp)}</p>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 px-2">
                    <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 dark:hover:text-irys-cyan-300">Like</button>
                    <button onClick={() => setIsReplying(!isReplying)} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 dark:hover:text-irys-cyan-300">Reply</button>
                </div>
                
                {isReplying && (
                    <div className="mt-2 flex items-center gap-3">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit()}
                                placeholder={`Replying to ${comment.user.name}...`}
                                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full py-2 pl-4 pr-10 text-sm text-slate-800 dark:text-slate-200 focus:ring-irys-cyan-500 focus:border-irys-cyan-500"
                                autoFocus
                            />
                            <button onClick={handleReplySubmit} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 disabled:text-slate-400 dark:disabled:text-slate-600" disabled={!replyContent.trim()}>
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    {comment.replies.map(reply => (
                        <CommentComponent key={reply.id} comment={reply} onReply={onReply} currentUser={currentUser} />
                    ))}
                </div>
            </div>
        </div>
    );
};