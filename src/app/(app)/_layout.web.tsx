import { Slot, Redirect } from "expo-router";
import { View, ScrollView, StyleSheet } from "react-native";
import { useAuthCookie } from "@/context/AuthCookieContext";
import { WebNavbar } from "@/components/web-navbar";
import { Colors } from "@/constants/colors";

// Área logada (Web): mesmo guard do Android, mas com uma casca própria —
// barra superior de navegação e conteúdo centralizado, sem abas.
export default function AppLayoutWeb() {
    const { isAuthenticated } = useAuthCookie();

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <View style={styles.page}>
            <WebNavbar />
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.content}>
                    <Slot />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.gray[100],
    },
    scroll: {
        flexGrow: 1,
    },
    content: {
        width: '100%',
        maxWidth: 1040,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
});
