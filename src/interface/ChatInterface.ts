

export interface ParticipantInterface {
    _id: string;
    username: string;
    mobile: string;
    email: string;
}

export interface ChatInterface {
    _id: string;
    admin: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: string;
    participants: ParticipantInterface[];
}

export interface MessageInterface {
    _id: string;
    chat: string;
    sender: ParticipantInterface;
    message: string;
    createdAt: string;
    updatedAt: string;
}
