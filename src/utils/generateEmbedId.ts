import { v7 as uuidv7 } from 'uuid';

export const generateEmbedId = () => {
  return `v1_${uuidv7()}`;
}