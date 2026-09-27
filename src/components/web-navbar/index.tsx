import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Logo } from '@/components/logo';
import { useAuthCookie } from '@/context/AuthCookieContext';
import { styles } from './styles';

const NAV_ITEMS = [
  { label: 'Início', route: '/home' },
  { label: 'Perfil', route: '/profile' },
] as const;

// Abaixo disso (celular abrindo o site) a barra diminui a logo e esconde o usuário.
const NARROW_BREAKPOINT = 640;

// Barra superior da versão Web (no Android a navegação é por abas).
export function WebNavbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthCookie();
  const { width } = useWindowDimensions();
  const isNarrow = width < NARROW_BREAKPOINT;

  return (
    <View style={styles.bar}>
      <View style={[styles.inner, isNarrow && styles.innerNarrow]}>
        <TouchableOpacity onPress={() => router.push('/home')} activeOpacity={0.7}>
          <Logo height={isNarrow ? 28 : 36} />
        </TouchableOpacity>

        <View style={[styles.links, isNarrow && styles.linksNarrow]}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route)}
                style={[styles.link, isActive && styles.linkActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.linkText, isActive && styles.linkTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.userArea}>
          {!isNarrow && <Text style={styles.username} numberOfLines={1}>{user?.username}</Text>}
          {/* Ao sair, o guard do (app)/_layout.web.tsx redireciona para o login. */}
          <TouchableOpacity onPress={signOut} style={styles.signOut} activeOpacity={0.7}>
            <Text style={styles.signOutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
