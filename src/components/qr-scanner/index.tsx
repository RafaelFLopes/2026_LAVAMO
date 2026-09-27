import { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import { Colors } from '@/constants/colors';

type Props = {
  active: boolean;
  onScan: (data: string) => void;
};

const FRAME_SIZE = 240;

// Leitor de QR Code com a câmera (recurso nativo). Usado só no Android.
export function QrScanner({ active, onScan }: Props) {
  // Trava: a câmera dispara várias leituras por segundo do mesmo QR.
  const locked = useRef(false);

  function handleScanned({ data }: BarcodeScanningResult) {
    if (locked.current) return;
    locked.current = true;
    onScan(data);
    setTimeout(() => { locked.current = false; }, 2000);
  }

  return (
    <View style={styles.container}>
      {active && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleScanned}
        />
      )}

      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>Aponte para o QR Code da máquina</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 3,
    borderColor: Colors.white,
    borderRadius: 20,
  },
  hint: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
