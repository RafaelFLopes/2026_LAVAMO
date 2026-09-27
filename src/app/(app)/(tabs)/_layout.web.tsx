import { Slot } from "expo-router";

// Na Web não há abas: a navegação fica na barra superior do (app)/_layout.web.tsx.
export default function TabsLayoutWeb() {
    return <Slot />;
}
