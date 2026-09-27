import { Platform, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: isWeb ? 48 : 50,
        backgroundColor: Colors.black,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    outline: {
        backgroundColor: Colors.white,
    },
    disabled: {
        opacity: 0.5,
    },
    title: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    titleOutline: {
        color: Colors.black,
    },
});
