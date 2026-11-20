import { useEffect } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthCookieProvider } from "@/context/AuthCookieContext";
import { configureNotifications } from "@/integration/notificationIntegration";

export default function Root() {
    // Android: prepara o canal e o comportamento das notificações de reserva. Na Web não faz nada.
    useEffect(() => {
        configureNotifications().catch(() => {});
    }, []);

    return (
        <AuthCookieProvider>
            <StatusBar style="dark" />
            <Slot />
        </AuthCookieProvider>
    );
}
