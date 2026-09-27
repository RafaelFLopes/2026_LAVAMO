import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.black,
    position: 'sticky' as any,
    top: 0,
    zIndex: 10,
  },
  inner: {
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 32,
  },
  innerNarrow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  links: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  linksNarrow: {
    gap: 4,
  },
  link: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkActive: {
    backgroundColor: Colors.black,
  },
  linkText: {
    color: Colors.txtPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  linkTextActive: {
    color: Colors.white,
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  username: {
    color: Colors.txtSecondary,
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 200,
  },
  signOut: {
    borderWidth: 1.5,
    borderColor: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  signOutText: {
    color: Colors.txtPrimary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
