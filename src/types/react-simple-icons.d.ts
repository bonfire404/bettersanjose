declare module '@icons-pack/react-simple-icons' {
  import React from 'react';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    title?: string;
  }

  export type IconType = React.FC<IconProps>;

  export const SiFacebook: IconType;
  export const SiInstagram: IconType;
  export const SiYoutube: IconType;
  export const SiDiscord: IconType;
  export const SiGithub: IconType;
  export const SiTwitter: IconType;
  export const SiX: IconType;

  const icons: Record<string, IconType>;
  export default icons;
}
