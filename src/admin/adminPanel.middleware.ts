import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TokenService } from 'src/authorization/token/token.service';

@Injectable()
export class MulterMiddleware implements MulterOptionsFactory {

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: "D:/UNIVER/CW/Project/computer-shop/public/images", 
                    filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        };
    }
}
