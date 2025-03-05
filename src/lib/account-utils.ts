import * as R from 'remeda';

/**
 * Adds `-` after the special bank identification.
 * Adds `-` before the last two digits representing account type.
 * Pads with zeros everything in between.
 * @param accountNumber
 * @returns formatted account number
 */
export const formatAccountNumber = (accountNumber: string): string => {
  /* I was bored */
  const bankId = R.pipe(accountNumber.split(''), R.take(3)).join('');
  const accountType = R.pipe(accountNumber.split(''), R.takeLast(2)).join('');
  const accountSeed = R.pipe(accountNumber.split(''), R.drop(3), R.dropLast(2))
    .join('')
    .padStart(9, '0');

  return `${bankId}-${accountSeed}-${accountType}`;
};
