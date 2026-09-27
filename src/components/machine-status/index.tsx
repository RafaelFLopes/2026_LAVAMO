import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type Props = {
  available: boolean;
};

export function MachineStatus({ available }: Props) {
  return (
    <View style={[styles.badge, available ? styles.free : styles.busy]}>
      <Text style={[styles.text, { color: available ? Colors.black : Colors.white }]}>
        {available ? 'Livre' : 'Em uso'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  free: {
    backgroundColor: Colors.white,
  },
  busy: {
    backgroundColor: Colors.black,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
