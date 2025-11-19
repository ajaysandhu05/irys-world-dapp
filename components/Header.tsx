import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { SearchIcon, BellIcon, UserIcon, LogoutIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
    user: User;
    onEditProfile: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onEditProfile, theme, setTheme }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50">
            <div className="container mx-auto max-w-3xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w.org/2000/svg" className="text-irys-cyan-400">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h1 className="text-xl font-bold text-irys-cyan-400">Irys World</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 transition-colors"><SearchIcon /></button>
                    <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 transition-colors">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <button className="text-slate-500 dark:text-slate-400 hover:text-irys-cyan-400 transition-colors"><BellIcon /></button>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)}>
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-irys-cyan-500 hover:border-irys-cyan-300 transition-colors" />
                        </button>
                        {isDropdownOpen && (
                             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg py-1 z-50">
                                <button
                                    onClick={() => {
                                        onEditProfile();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <LogoutIcon className="w-4 h-4" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};