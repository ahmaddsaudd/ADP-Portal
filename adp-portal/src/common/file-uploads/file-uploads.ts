import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const DocumentUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/documents',
    filename: (req, file, cb) => {
      const unique =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + '-' + file.originalname);
    },
  }),
});