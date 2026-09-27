import { View, Text, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Logo } from '@/components/logo';
import { Card } from '@/components/card';
import { styles } from './styles';

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const isWeb = Platform.OS === 'web';
const WIDE_BREAKPOINT = 900;

// Moldura das telas de login e cadastro.
// Web larga: painel preto com a marca à esquerda e o formulário à direita.
// Android: tela cheia com a logo em cima do formulário.
export function AuthLayout({ title, subtitle, children }: Props) {
  const { width } = useWindowDimensions();
  const isWide = isWeb && width >= WIDE_BREAKPOINT;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.flex, isWide && styles.row]}>
        {isWide && (
          <View style={styles.brandPanel}>
            <Logo height={90} />
            <Text style={styles.brandSlogan}>
              A lavanderia do seu condomínio, sem filas e sem surpresas.
            </Text>
            <Text style={styles.brandText}>
              Veja se a máquina está livre, reserve e libere para o próximo morador.
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {!isWide && (
            <View style={styles.header}>
              <Logo height={isWeb ? 60 : 64} />
              <Text style={styles.subtitleTop}>A lavanderia do seu condomínio</Text>
            </View>
          )}

          <Card style={styles.card}>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {children}
          </Card>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
