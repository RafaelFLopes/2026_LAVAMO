import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthCookieProvider } from "@/context/AuthCookieContext";

export default function Root() {
    return (
        <AuthCookieProvider>
            <StatusBar style="dark" />
            <Slot />
        </AuthCookieProvider>
    );
}
