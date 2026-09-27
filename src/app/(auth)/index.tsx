import { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAuthCookie } from '@/context/AuthCookieContext';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Alert } from '@/components/alert';
import { Colors } from '@/constants/colors';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        type: 'error' as 'success' | 'error' | 'warning' | 'info',
    });

    const { signIn, isLoading } = useAuthCookie();

    function showAlert(title: string, message: string, type: typeof alertData.type) {
        setAlertData({ title, message, type });
        setIsAlertVisible(true);
    }

    async function handleLogin() {
        if (!username.trim() || !password.trim()) {
            showAlert('Campos obrigatórios', 'Preencha o usuário e a senha.', 'warning');
            return;
        }

        // Em caso de sucesso o (auth)/_layout redireciona para o Início.
        const result = await signIn(username.trim(), password);

        if (!result.ok) {
            showAlert('Acesso negado', result.error ?? 'Não foi possível entrar.', 'error');
        }
    }

    return (
        <AuthLayout title="Entrar" subtitle="Acesse com o seu usuário do condomínio.">
            <Input
                label="Usuário"
                placeholder="seu usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Input
                label="Senha"
                placeholder="sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={handleLogin}
            />

            <Button title="Entrar" onPress={handleLogin} loading={isLoading} style={{ marginTop: 4 }} />

            {isLoading && <Text style={styles.hint}>Conectando ao servidor… o primeiro acesso pode demorar.</Text>}

            <View style={styles.footer}>
                <Text style={styles.footerText}>Ainda não tem conta?</Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.footerLink}>Criar conta</Text>
                </TouchableOpacity>
            </View>

            <Alert
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
            />
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    hint: {
        color: Colors.txtSecondary,
        fontSize: 12,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 4,
    },
    footerText: {
        color: Colors.txtSecondary,
        fontSize: 14,
    },
    footerLink: {
        color: Colors.txtPrimary,
        fontSize: 14,
        fontWeight: '800',
        textDecorationLine: 'underline',
    },
});
