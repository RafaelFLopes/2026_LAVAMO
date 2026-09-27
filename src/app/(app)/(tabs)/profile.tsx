import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthCookie } from '@/context/AuthCookieContext';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';

export default function Profile() {
    const { user, signOut } = useAuthCookie();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.container, !isWeb && { paddingTop: insets.top + 16 }]}
        >
            <Text style={styles.title}>Perfil</Text>

            <Card style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.username.charAt(0).toUpperCase()}</Text>
                </View>

                <Info label="Usuário" value={user?.username} />
                <Info label="ID" value={user?.userId} />
                <Info label="Perfis" value={user?.roles.join(', ')} />
            </Card>

            {/* Na Web o botão Sair fica na barra superior. */}
            {!isWeb && <Button title="Sair" onPress={signOut} />}
        </ScrollView>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    return (
        <View style={styles.info}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue} selectable>{value ?? '—'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: isWeb ? 'transparent' : Colors.background,
    },
    container: {
        padding: isWeb ? 0 : 20,
        gap: 20,
        alignItems: isWeb ? 'center' : 'stretch',
    },
    title: {
        color: Colors.txtPrimary,
        fontSize: isWeb ? 30 : 24,
        fontWeight: '900',
        width: '100%',
        maxWidth: isWeb ? 560 : undefined,
    },
    card: {
        width: '100%',
        maxWidth: isWeb ? 560 : undefined,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '900',
    },
    info: {
        gap: 2,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        paddingBottom: 10,
    },
    infoLabel: {
        color: Colors.txtMuted,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    infoValue: {
        color: Colors.txtPrimary,
        fontSize: 15,
        fontWeight: '600',
    },
});
