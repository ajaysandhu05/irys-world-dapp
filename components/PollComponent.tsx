
import React, { useState, useMemo } from 'react';
import { Poll } from '../types';
import { HeartIcon, ChatBubbleIcon, ShareIcon, MoreHorizontalIcon } from './icons';

interface PollComponentProps {
    poll: Poll;
}

const timeAgo = (dateString: string) => {
    // FIX: Corrected constructor call for Date object.
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

const ActionButton: React.FC<{ icon: React.ReactNode; count: number; label: string }> = ({ icon, count, label }) => (
    <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 transition-colors group">
        <div className="p-2 rounded-full group-hover:bg-irys-cyan-500/10 dark:group-hover:bg-irys-cyan-900/50 transition-colors">{icon}</div>
        <span className="text-sm">{count}</span>
    </button>
);


export const PollComponent: React.FC<PollComponentProps> = ({ poll }) => {
    const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
    const [options, setOptions] = useState(poll.options);

    const totalVotes = useMemo(() => options.reduce((sum, opt) => sum + opt.votes, 0), [options]);

    const handleVote = (optionId: string) => {
        if (votedOptionId) return; // Allow voting only once

        setVotedOptionId(optionId);
        setOptions(prevOptions =>
            prevOptions.map(opt =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={poll.user.avatarUrl} alt={poll.user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{poll.user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(poll.timestamp)} ago</p>
                        </div>
                    </div>
                     <button className="text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400"><MoreHorizontalIcon/></button>
                </div>
                <p className="my-4 text-slate-800 dark:text-slate-200 font-semibold">{poll.question}</p>
                <div className="space-y-2">
                    {options.map(option => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        const isVoted = votedOptionId === option.id;

                        return (
                            <div key={option.id} onClick={() => handleVote(option.id)} className={`relative overflow-hidden rounded-md border border-slate-300 dark:border-slate-600 p-3 transition-all ${!votedOptionId ? 'cursor-pointer hover:border-irys-cyan-500' : 'cursor-default'}`}>
                                {votedOptionId && (
                                    <div className="absolute top-0 left-0 h-full bg-irys-cyan-500/30" style={{ width: `${percentage}%` }}></div>
                                )}
                                <div className="relative z-10 flex justify-between items-center">
                                    <span className={`font-medium ${isVoted ? 'text-irys-cyan-500 dark:text-irys-cyan-300' : 'text-slate-700 dark:text-slate-300'}`}>{option.text}</span>
                                    {votedOptionId && (
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{Math.round(percentage)}%</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
             <div className="p-4 flex justify-around border-t border-slate-200 dark:border-slate-700 mt-4">
                <ActionButton icon={<HeartIcon />} count={poll.likes} label="Like" />
                <ActionButton icon={<ChatBubbleIcon />} count={poll.comments} label="Comment" />
                <ActionButton icon={<ShareIcon />} count={0} label="Share" />
            </div>
        </div>
    );
};