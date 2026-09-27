import { Stack, Redirect } from "expo-router";
import { useAuthCookie } from "@/context/AuthCookieContext";
import { Colors } from "@/constants/colors";

// Área logada (Android): guard de autenticação + Stack.
// As abas ficam em (tabs); a tela da máquina abre por cima delas com botão voltar.
export default function AppLayout() {
    const { isAuthenticated } = useAuthCookie();

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.white },
                headerTintColor: Colors.black,
                headerTitleStyle: { fontWeight: '800' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: Colors.background },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="machine/[code]" options={{ title: 'Máquina' }} />
        </Stack>
    );
}
