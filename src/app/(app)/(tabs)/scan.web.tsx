import { Redirect } from "expo-router";

// A versão Web não lê QR Code: quem abrir /scan no navegador volta para o Início.
export default function ScanWeb() {
    return <Redirect href="/home" />;
}
