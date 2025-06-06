import { getEnv } from './getEnv';

export const getFeature = (type) => {
  const { features } = getEnv();

  return Boolean(features[type]);
};
