import React, { useState, useRef } from 'react';
import { User } from '../types';
import { CloseIcon, ImageIcon } from './icons';

interface ProfileModalProps {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave({
            ...user,
            name: name,
            avatarUrl: avatar || user.avatarUrl,
        });
    };

    const isChanged = name !== user.name || avatar !== null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Edit Profile</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <img 
                                src={avatar || user.avatarUrl} 
                                alt="Profile" 
                                className="w-24 h-24 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600"
                            />
                             <button
                                onClick={() => imageInputRef.current?.click()}
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Change profile picture"
                            >
                                <ImageIcon className="w-8 h-8 text-white"/>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="w-full">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-200 focus:ring-irys-cyan-500 focus:border-irys-cyan-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isChanged}
                        className="px-6 py-2 font-semibold text-white bg-irys-cyan-600 rounded-md hover:bg-irys-cyan-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};