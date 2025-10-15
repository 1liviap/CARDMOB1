import Constants from "expo-constants";

const { apiUrl } = Constants.expoConfig?.extra || {};

export interface User {
    id: number;
    name: string;
    email: string;
    image?: string | null;
}

export async function requestProfileById(id: number): Promise<User> {
    try {
        const response = await fetch(`${apiUrl}/api/users/${id}`);
        const data: User = await response.json(); // corrigido await
        if (!data.image) {
            data.image = `${apiUrl}/uploads/placeholder.png`;
        }
        return data;
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
    }
}
