export const isValidSecurityType = (
  s: string
): s is 'futures' | 'stocks' | 'forex-pairs' =>
  ['stocks', 'futures', 'forex-pairs'].includes(s);
