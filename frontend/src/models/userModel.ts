export interface User {
    id?: string;
    email: string;
    locked_categories: string[];
    isGoogleConnected: boolean | false;
}
