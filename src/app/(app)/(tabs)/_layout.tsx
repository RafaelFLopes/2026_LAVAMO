import { Tabs } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

// Navegação do Android: abas na parte de baixo.
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.black,
                tabBarInactiveTintColor: Colors.gray[400],
                tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.black, borderTopWidth: 1 },
                tabBarLabelStyle: { fontWeight: '700' },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Escanear',
                    tabBarIcon: ({ color, size }) => <Ionicons name="qr-code-outline" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
