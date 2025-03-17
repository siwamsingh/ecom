import { ClassValue, clsx } from 'clsx';
import getErrorMsg from './getErrorMsg';


export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const numberWithCommas = (number: number | string) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export {getErrorMsg}