import { useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useAuthCookie } from '@/context/AuthCookieContext';
import { useMachine } from '@/hooks/useMachine';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Alert } from '@/components/alert';
import { MachineStatus } from '@/components/machine-status';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';
const WIDE_BREAKPOINT = 820;

function formatTime(iso: string) {
    const date = new Date(iso);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function MachineDetail() {
    const { code } = useLocalSearchParams<{ code: string }>();
    const { user } = useAuthCookie();
    const { machine, isLoading, isSaving, isMine, error, reserve, cancel } = useMachine(code, user);
    const { width } = useWindowDimensions();
    const isWide = isWeb && width >= WIDE_BREAKPOINT;

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    function goHome() {
        if (router.canGoBack()) router.back();
        else router.replace('/home');
    }

    async function handleAction(action: typeof reserve) {
        const result = await action();
        setAlertData({
            title: result.ok ? 'Tudo certo' : 'Não foi possível',
            message: result.message,
            type: result.ok ? 'success' : 'error',
        });
        setIsAlertVisible(true);
    }

    function renderAction() {
        if (!machine) return null;

        if (machine.available) {
            return (
                <>
                    <Text style={styles.actionText}>Esta máquina está livre para uso.</Text>
                    <Button title="Utilizar máquina" onPress={() => handleAction(reserve)} loading={isSaving} />
                </>
            );
        }

        if (isMine) {
            return (
                <>
                    <Text style={styles.actionText}>
                        Você está usando esta máquina desde {formatTime(machine.reservedBy!.reservedAt)}.
                    </Text>
                    <Button title="Cancelar reserva" variant="outline" onPress={() => handleAction(cancel)} loading={isSaving} />
                </>
            );
        }

        return (
            <View style={styles.busyBox}>
                <Text style={styles.busyLabel}>Em uso por</Text>
                <Text style={styles.busyUser}>{machine.reservedBy?.username}</Text>
                <Text style={styles.busySince}>desde {formatTime(machine.reservedBy!.reservedAt)}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
            {isWeb && (
                <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
                    <Text style={styles.back}>← Voltar ao início</Text>
                </TouchableOpacity>
            )}

            {isLoading ? (
                <ActivityIndicator color={Colors.black} size="large" />
            ) : !machine ? (
                <Card>
                    <Text style={styles.title}>Máquina não encontrada</Text>
                    <Text style={styles.actionText}>{error}</Text>
                    <Button title="Voltar" variant="outline" onPress={goHome} />
                </Card>
            ) : (
                <Card style={[styles.card, isWide && styles.cardWide]}>
                    <View style={[styles.details, isWide && styles.half]}>
                        <MachineStatus available={machine.available} />
                        <Text style={styles.code}>{machine.code}</Text>
                        <Info label="Modelo" value={machine.model} />
                        <Info label="Ano" value={String(machine.year)} />
                    </View>

                    <View style={[styles.action, isWide && styles.half, isWide && styles.actionWide]}>
                        {renderAction()}
                    </View>
                </Card>
            )}

            <Alert
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
            />
        </ScrollView>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.info}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
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
    },
    back: {
        color: Colors.txtPrimary,
        fontSize: 14,
        fontWeight: '700',
    },
    title: {
        color: Colors.txtPrimary,
        fontSize: 22,
        fontWeight: '900',
    },
    card: {
        gap: 24,
    },
    cardWide: {
        flexDirection: 'row',
        padding: 32,
        gap: 40,
    },
    half: {
        flex: 1,
    },
    details: {
        gap: 12,
    },
    code: {
        color: Colors.txtPrimary,
        fontSize: isWeb ? 40 : 34,
        fontWeight: '900',
        letterSpacing: 2,
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
        fontSize: 17,
        fontWeight: '700',
    },
    action: {
        gap: 14,
    },
    actionWide: {
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: Colors.divider,
        paddingLeft: 40,
    },
    actionText: {
        color: Colors.txtSecondary,
        fontSize: 15,
        lineHeight: 22,
    },
    busyBox: {
        backgroundColor: Colors.black,
        borderRadius: 12,
        padding: 20,
        gap: 4,
    },
    busyLabel: {
        color: Colors.gray[400],
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    busyUser: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '900',
    },
    busySince: {
        color: Colors.gray[400],
        fontSize: 14,
    },
});
