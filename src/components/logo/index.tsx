import { Image } from 'react-native';

const logoDefault = require('@assets/images/logo-lavamo.png');
const logoP = require('@assets/images/logo-lavamo-p.png');

const LOGO_RATIO = 1680 / 569;

type Props = {
  height?: number;
  variant?: 'default' | 'p';
};

export function Logo({ height = 40, variant = 'p' }: Props) {
  const source = variant === 'default' ? logoDefault : logoP;

  return (
    <Image
      source={source}
      style={{ height, width: height * LOGO_RATIO, maxWidth: '100%' }}
      resizeMode="contain"
      accessibilityLabel="Lavamo"
    />
  );
}
