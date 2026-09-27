import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle, ActivityIndicator } from "react-native"
import { styles } from "./styles";
import { Colors } from "@/constants/colors";

type Props = TouchableOpacityProps & {
    title: string;
    variant?: 'primary' | 'outline';
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Button({ title, variant = 'primary', loading = false, disabled, style, ...rest }: Props) {
    const isOutline = variant === 'outline';
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            disabled={isDisabled}
            style={[styles.button, isOutline && styles.outline, isDisabled && styles.disabled, style]}
            {...rest}
        >
            {loading
                ? <ActivityIndicator color={isOutline ? Colors.black : Colors.white} />
                : <Text style={[styles.title, isOutline && styles.titleOutline]}>{title}</Text>
            }
        </TouchableOpacity>
    )
}
