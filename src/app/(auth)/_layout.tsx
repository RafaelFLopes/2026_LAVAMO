import { Stack, Redirect } from "expo-router";
import { useAuthCookie } from "@/context/AuthCookieContext";

// Área pública: quem já está logado vai direto para o Início.
export default function AuthLayout() {
    const { isAuthenticated } = useAuthCookie();

    if (isAuthenticated) {
        return <Redirect href="/home" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
