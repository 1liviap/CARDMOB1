import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image, ActivityIndicator } from "react-native";

import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

import { requestProfileById, User } from "../../services/profileService";

function ProfileScreen({ navigation }: any) {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const fetchedUser = await requestProfileById(1);
                setUser(fetchedUser);
            } catch (error) {
                console.error('Erro ao carregar o perfil do usuário:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, marginBottom: theme.spacing(1) }}>
                Profile Screen
            </Text>
            {user && (
                <>
                    <Text style={styles.text}>{user.name}</Text>
                    <Text style={styles.text}>{user.email}</Text>
                </>
            )}

            <Button title="Alternar Tema" color={theme.colors.primary} onPress={toggleTheme} />
            <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Details')} />
            <Button title="Sair" onPress={logout} />
        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
});
