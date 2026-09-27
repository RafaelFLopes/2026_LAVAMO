import React, { useEffect } from "react";
import { AlertProps } from "./types";
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const TYPE_LABEL = {
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Atenção',
    info: 'Aviso',
};

const AlertWeb: React.FC<AlertProps> = ({ title, message, visible, onClose, type = 'info' }) => {
    const [fadeAnim] = React.useState(() => new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(onClose, 6000);
            return () => clearTimeout(timer);
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible, fadeAnim, onClose]);

    // Preto e branco: o tipo aparece no rótulo e na espessura da borda.
    const isStrong = type === 'error' || type === 'warning';

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.alertContainer,
                        { opacity: fadeAnim, borderLeftWidth: isStrong ? 8 : 4 },
                    ]}
                >
                    <View style={styles.content}>
                        <Text style={styles.label}>{TYPE_LABEL[type]}</Text>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        width: '100%',
        maxWidth: 420,
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.border,
        boxShadow: '0px 8px 32px rgba(0,0,0,0.25)',
    },
    content: {
        flex: 1,
        marginRight: 10,
        gap: 4,
    },
    label: {
        color: Colors.txtSecondary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    title: {
        color: Colors.txtPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    message: {
        color: Colors.txtPrimary,
        fontSize: 14,
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
    },
    closeText: {
        color: Colors.txtPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AlertWeb;
