import { Platform, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: isWeb ? 16 : 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
        padding: isWeb ? 24 : 18,
        gap: 14,
        ...Platform.select({
            web: { boxShadow: '0 4px 24px rgba(0,0,0,0.08)' } as any,
            default: { elevation: 2 },
        }),
    },
});
