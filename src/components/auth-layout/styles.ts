import { Platform, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  brandPanel: {
    width: '42%',
    backgroundColor: Colors.black,
    padding: 56,
    justifyContent: 'center',
    gap: 20,
  },
  brandSlogan: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  brandText: {
    color: Colors.gray[400],
    fontSize: 15,
    lineHeight: 22,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  subtitleTop: {
    color: Colors.txtSecondary,
    fontSize: 14,
  },
  card: {
    width: '100%',
    maxWidth: isWeb ? 420 : undefined,
    gap: 16,
  },
  titleGroup: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    color: Colors.txtPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: Colors.txtSecondary,
    fontSize: 14,
  },
});
