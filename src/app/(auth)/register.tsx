import { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAuthCookie } from '@/context/AuthCookieContext';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Alert } from '@/components/alert';
import { Colors } from '@/constants/colors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function onlyDigits(value: string) {
    return value.replace(/\D/g, '');
}

function formatCep(value: string) {
    const digits = onlyDigits(value).slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        type: 'error' as 'success' | 'error' | 'warning' | 'info',
    });

    const { signUp, isLoading } = useAuthCookie();

    function showAlert(title: string, message: string, type: typeof alertData.type) {
        setAlertData({ title, message, type });
        setIsAlertVisible(true);
    }

    function validate(): string | null {
        if (!username.trim() || !email.trim() || !cep.trim() || !password || !passwordConfirmation) {
            return 'Preencha todos os campos.';
        }
        if (!EMAIL_PATTERN.test(email.trim())) {
            return 'Informe um e-mail válido.';
        }
        if (onlyDigits(cep).length !== 8) {
            return 'O CEP deve ter 8 dígitos.';
        }
        if (password.length < 4) {
            return 'A senha deve ter pelo menos 4 caracteres.';
        }
        if (password !== passwordConfirmation) {
            return 'A senha e a confirmação não coincidem.';
        }
        return null;
    }

    async function handleRegister() {
        const error = validate();
        if (error) {
            showAlert('Verifique os dados', error, 'warning');
            return;
        }

        // A API já devolve o usuário logado: o (auth)/_layout redireciona para o Início.
        const result = await signUp({
            username: username.trim(),
            password,
            email: email.trim(),
            cep: onlyDigits(cep),
        });

        if (!result.ok) {
            showAlert('Erro no cadastro', result.error ?? 'Não foi possível criar a conta.', 'error');
        }
    }

    return (
        <AuthLayout title="Criar conta" subtitle="Cadastre-se para usar as máquinas do condomínio.">
            <Input
                label="Usuário"
                placeholder="escolha um usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Input
                label="E-mail"
                placeholder="voce@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Input
                label="CEP"
                placeholder="00000-000"
                value={cep}
                onChangeText={(text) => setCep(formatCep(text))}
                keyboardType="numeric"
                maxLength={9}
            />

            <Input
                label="Senha"
                placeholder="mínimo 4 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Input
                label="Confirmação da senha"
                placeholder="repita a senha"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                onSubmitEditing={handleRegister}
            />

            <Button title="Criar conta" onPress={handleRegister} loading={isLoading} style={{ marginTop: 4 }} />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Já tem conta?</Text>
                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={styles.footerLink}>Entrar</Text>
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
