import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QrScanner } from '@/components/qr-scanner';
import { Button } from '@/components/button';
import { Alert } from '@/components/alert';
import { MACHINE_CODE_PATTERN, normalizeCode } from '@/integration/machineIntegration';
import { Colors } from '@/constants/colors';

// Recurso nativo: câmera lendo o QR Code da máquina (o QR carrega o código, ex.: LVM-001).
export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    function handleScan(data: string) {
        const code = normalizeCode(data);
        if (!MACHINE_CODE_PATTERN.test(code)) {
            setIsAlertVisible(true);
            return;
        }
        router.push(`/machine/${code}`);
    }

    if (!permission) {
        return <View style={styles.center} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <Text style={styles.title}>Permitir acesso à câmera</Text>
                <Text style={styles.text}>
                    O Lavamo usa a câmera apenas para ler o QR Code colado na máquina de lavar.
                </Text>
                <Button title="Permitir câmera" onPress={requestPermission} />
                {!permission.canAskAgain && (
                    <Text style={styles.text}>
                        A permissão foi negada. Libere a câmera nas configurações do Android ou digite o código no Início.
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View style={styles.flex}>
            {/* A câmera só fica ligada enquanto a aba está visível. */}
            <QrScanner active={isFocused} onScan={handleScan} />

            <Alert
                title="QR Code inválido"
                message="Esse QR Code não é de uma máquina Lavamo."
                type="error"
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    center: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        padding: 24,
        gap: 16,
    },
    title: {
        color: Colors.txtPrimary,
        fontSize: 22,
        fontWeight: '900',
    },
    text: {
        color: Colors.txtSecondary,
        fontSize: 15,
        lineHeight: 22,
    },
});
