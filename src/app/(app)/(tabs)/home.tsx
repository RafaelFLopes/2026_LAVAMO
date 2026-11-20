import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthCookie } from '@/context/AuthCookieContext';
import { getMyReservation } from '@/integration/machineIntegration';
import { Machine } from '@/@types/machine';
import { formatCountdown, useCountdown } from '@/hooks/useCountdown';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Logo } from '@/components/logo';
import { MachineCodeForm } from '@/components/machine-code-form';
import { MachineStatus } from '@/components/machine-status';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';
const WIDE_BREAKPOINT = 820;

export default function Home() {
    const { user } = useAuthCookie();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isWide = isWeb && width >= WIDE_BREAKPOINT;

    const [reservation, setReservation] = useState<Machine | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadReservation = useCallback(() => {
        if (!user) return;
        getMyReservation(user.userId)
            .then(setReservation)
            .finally(() => setIsLoading(false));
    }, [user]);

    // Recarrega sempre que a tela volta a ficar visível (ex.: depois de reservar/cancelar).
    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            loadReservation();
        }, [loadReservation])
    );

    // Android: quando o tempo da reserva acaba, o card some sozinho.
    const secondsLeft = useCountdown(reservation?.reservedBy?.expiresAt, loadReservation);

    const searchCard = (
        <Card style={isWide && styles.column}>
            <Text style={styles.cardTitle}>Encontrar máquina</Text>
            <Text style={styles.cardText}>
                {isWeb
                    ? 'Digite o código impresso na etiqueta da máquina.'
                    : 'Leia o QR Code da máquina ou digite o código impresso na etiqueta.'}
            </Text>

            {!isWeb && (
                <Button title="Ler QR Code" onPress={() => router.push('/scan')} />
            )}

            {!isWeb && <Text style={styles.divider}>ou</Text>}

            <MachineCodeForm />
        </Card>
    );

    const reservationCard = (
        <Card style={isWide && styles.column}>
            <Text style={styles.cardTitle}>Minha reserva</Text>
            {isLoading ? (
                <ActivityIndicator color={Colors.black} />
            ) : reservation ? (
                <View style={styles.reservation}>
                    <View style={styles.reservationHeader}>
                        <Text style={styles.machineCode}>{reservation.code}</Text>
                        <MachineStatus available={false} />
                    </View>
                    <Text style={styles.cardText}>{reservation.model} · {reservation.year}</Text>
                    {secondsLeft !== null && (
                        <Text style={styles.cardText}>
                            Cancelamento automático em{' '}
                            <Text style={styles.countdown}>{formatCountdown(secondsLeft)}</Text>
                        </Text>
                    )}
                    <Button
                        title="Ver máquina"
                        variant="outline"
                        onPress={() => router.push(`/machine/${reservation.code}`)}
                    />
                </View>
            ) : (
                <Text style={styles.cardText}>Você não está usando nenhuma máquina no momento.</Text>
            )}
        </Card>
    );

    return (
        <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.container, !isWeb && { paddingTop: insets.top + 16 }]}
            keyboardShouldPersistTaps="handled"
        >
            {!isWeb && <Logo height={40} />}

            <View style={styles.greeting}>
                <Text style={styles.hello}>Olá, {user?.username}</Text>
                <Text style={styles.cardText}>Qual máquina você vai usar hoje?</Text>
            </View>

            {isWide ? (
                <View style={styles.row}>
                    {searchCard}
                    {reservationCard}
                </View>
            ) : (
                <>
                    {reservationCard}
                    {searchCard}
                </>
            )}
        </ScrollView>
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
    greeting: {
        gap: 4,
    },
    hello: {
        color: Colors.txtPrimary,
        fontSize: isWeb ? 30 : 24,
        fontWeight: '900',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 24,
    },
    column: {
        flex: 1,
    },
    cardTitle: {
        color: Colors.txtPrimary,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    cardText: {
        color: Colors.txtSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    divider: {
        color: Colors.txtMuted,
        textAlign: 'center',
        fontSize: 13,
    },
    reservation: {
        gap: 10,
    },
    reservationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countdown: {
        color: Colors.txtPrimary,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    machineCode: {
        color: Colors.txtPrimary,
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
