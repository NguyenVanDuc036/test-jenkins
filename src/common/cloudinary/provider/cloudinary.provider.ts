import {
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLOUD_NAME,
} from '@src/common/configs/env';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUD_API_KEY,
      api_secret: CLOUD_API_SECRET,
    });
  },
};
