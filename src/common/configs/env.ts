import 'dotenv/config';

export const APP_PORT = process.env.PORT || 3003;
export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1/threader';

export const MONGO_URL_LOCAL = process.env.MONGO_URL_LOCAL;

export const CONFIG_PREFIX = process.env.CONFIG_PREFIX || 'api/v1';
export const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 1000;

// ----------- CLOUDINARY CONFIG ----------
export const CLOUD_NAME = 'dnxe9l57i';
export const CLOUD_API_KEY = '991189484643755';
export const CLOUD_API_SECRET = 'e6ZiAtks5BeldzKgTew3IqC8KHk';

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  accessTokenExp: process.env.JWT_ACCESS_EXP,
  refreshTokenExp: process.env.JWT_REFRESH_EXP,
};

export const FB_CONFIG = {
  clientId: process.env.FB_CLIENT_ID,
  secret: process.env.FB_CLIENT_SECRET,
  callbackUrl: process.env.FB_CALLBACK,
};
