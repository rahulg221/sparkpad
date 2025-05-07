export interface Note {       
    id?: string;
    content: string;
    category: string;
    cluster: number;
    user_id: string;
    created_at?: string;   
    updated_at?: string;   
    recentlyMoved?: boolean;
    isDeleting?: boolean | false;
} 