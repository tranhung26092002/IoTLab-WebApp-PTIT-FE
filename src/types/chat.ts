export interface Chat {
    id: string;
    participants: string[];
    messages: Message[];
    createdAt: string;
}