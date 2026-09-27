import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { MACHINE_CODE_PATTERN, normalizeCode } from '@/integration/machineIntegration';
import { styles } from './styles';

export function MachineCodeForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSearch() {
    const normalized = normalizeCode(code);
    if (!MACHINE_CODE_PATTERN.test(normalized)) {
      setError('Informe um código no formato LVM-000.');
      return;
    }
    setError(null);
    setCode('');
    router.push(`/machine/${normalized}`);
  }

  return (
    <View style={styles.container}>
      <Input
        label="Código da máquina"
        placeholder="Ex.: LVM-001"
        value={code}
        onChangeText={(text) => { setCode(text); setError(null); }}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={7}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Buscar máquina" onPress={handleSearch} />
    </View>
  );
}
