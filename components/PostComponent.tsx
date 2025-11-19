import React, { useState, useMemo } from 'react';
import { Post, User, Comment } from '../types';
import { HeartIcon, ChatBubbleIcon, ShareIcon, MoreHorizontalIcon, SendIcon } from './icons';
import { CommentComponent } from './CommentComponent';

interface PostComponentProps {
    post: Post;
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

const ActionButton: React.FC<{ icon: React.ReactNode; count: number; label: string; onClick?: () => void; }> = ({ icon, count, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 transition-colors group">
        <div className="p-2 rounded-full group-hover:bg-irys-cyan-500/10 dark:group-hover:bg-irys-cyan-900/50 transition-colors">{icon}</div>
        <span className="text-sm">{count}</span>
    </button>
);

export const PostComponent: React.FC<PostComponentProps> = ({ post, currentUser }) => {
    const [comments, setComments] = useState<Comment[]>(post.comments);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const countTotalComments = (commentList: Comment[]): number => {
        let count = commentList.length;
        for (const comment of commentList) {
            count += countTotalComments(comment.replies);
        }
        return count;
    };
    
    const totalComments = useMemo(() => countTotalComments(comments), [comments]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: `c_${Date.now()}`,
            user: currentUser,
            content: newComment,
            timestamp: new Date().toISOString(),
            replies: [],
        };
        setComments(prev => [...prev, comment]);
        setNewComment('');
        setIsCommentsOpen(true);
    };

    const handleAddReply = (parentId: string, replyContent: string) => {
        const addReplyToComment = (commentList: Comment[]): Comment[] => {
            return commentList.map(c => {
                if (c.id === parentId) {
                    const newReply: Comment = {
                        id: `c_${Date.now()}`,
                        user: currentUser,
                        content: replyContent,
                        timestamp: new Date().toISOString(),
                        replies: []
                    };
                    return { ...c, replies: [...c.replies, newReply] };
                }
                if (c.replies.length > 0) {
                    return { ...c, replies: addReplyToComment(c.replies) };
                }
                return c;
            });
        };
        setComments(prev => addReplyToComment(prev));
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={post.user.avatarUrl} alt={post.user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{post.user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(post.timestamp)} ago</p>
                        </div>
                    </div>
                     <button className="text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400"><MoreHorizontalIcon/></button>
                </div>
                <p className="my-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>
            </div>
            {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />}
            <div className="p-4 flex justify-around border-b border-t border-slate-200/50 dark:border-slate-700/50">
                <ActionButton icon={<HeartIcon />} count={post.likes} label="Like" />
                <ActionButton icon={<ChatBubbleIcon />} count={totalComments} label="Comment" onClick={() => setIsCommentsOpen(!isCommentsOpen)}/>
                <ActionButton icon={<ShareIcon />} count={0} label="Share" />
            </div>

            {isCommentsOpen && (
                 <div className="p-4">
                    {comments.map(comment => (
                        <CommentComponent key={comment.id} comment={comment} onReply={handleAddReply} currentUser={currentUser} />
                    ))}
                </div>
            )}
            
            <div className="p-4 flex items-center gap-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder="Add a comment..."
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full py-2 pl-4 pr-10 text-sm text-slate-800 dark:text-slate-200 focus:ring-irys-cyan-500 focus:border-irys-cyan-500"
                    />
                     <button onClick={handleAddComment} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 disabled:text-slate-600 dark:disabled:text-slate-500" disabled={!newComment.trim()}>
                        <SendIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};