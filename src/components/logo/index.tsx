import { Image } from 'react-native';

// Logo oficial (logotipo com o nome). Para trocar, substitua assets/images/logo-lavamo.png.
const logoImage = require('@assets/images/logo-lavamo.png');

// Proporção original da imagem (1680 x 569): a largura acompanha a altura sem distorcer.
const LOGO_RATIO = 1680 / 569;

type Props = {
  height?: number;
};

export function Logo({ height = 40 }: Props) {
  return (
    <Image
      source={logoImage}
      style={{ height, width: height * LOGO_RATIO }}
      resizeMode="contain"
      accessibilityLabel="Lavamo"
    />
  );
}
