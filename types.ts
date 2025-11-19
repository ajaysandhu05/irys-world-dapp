export interface User {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface Story {
    id: string;
    user: User;
    imageUrl: string;
    timestamp: string;
}

export interface Comment {
    id: string;
    user: User;
    content: string;
    timestamp: string;
    replies: Comment[];
}

export interface Post {
    type: 'post';
    id: string;
    user: User;
    content: string;
    imageUrl?: string;
    timestamp: string;
    likes: number;
    comments: Comment[];
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    type: 'poll';
    id: string;
    user: User;
    question: string;
    options: PollOption[];
    timestamp: string;
    likes: number;
    comments: number; // Polls will keep a simple comment count for now
}

export type ContentItem = Post | Poll;