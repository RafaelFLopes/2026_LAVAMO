import { TextInput, TextInputProps, Text, View } from "react-native"
import { styles } from "./styles";
import { Colors } from "@/constants/colors";

type Props = TextInputProps & {
    label?: string;
}

export function Input({ label, style, ...rest }: Props) {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={Colors.txtMuted}
                {...rest}
            />
        </View>
    )
}
