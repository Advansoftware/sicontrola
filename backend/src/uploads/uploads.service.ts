import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly uploadDir = process.env.UPLOAD_DIR || '/app/uploads';

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, subDir: string = ''): Promise<string> {
    const targetDir = join(this.uploadDir, subDir);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(targetDir, fileName);

    writeFileSync(filePath, file.buffer);

    // Return the relative path for database storage
    return join(subDir, fileName);
  }

  getStaticPath(relativePath: string): string {
    return join(this.uploadDir, relativePath);
  }
}
