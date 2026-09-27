import { Platform, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        gap: 6,
    },
    label: {
        color: Colors.txtSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        height: isWeb ? 46 : 50,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.gray[400],
        backgroundColor: Colors.white,
        paddingHorizontal: 14,
        fontSize: 15,
        color: Colors.txtPrimary,
        ...Platform.select({
            web: { outlineColor: Colors.black } as any,
        }),
    },
});
