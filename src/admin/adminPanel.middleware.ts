import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class MulterMiddleware implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: "D:/UNIVER/CW/Project/computer-shop/public/images", // Путь для сохранения загруженных файлов
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        };
    }
}
