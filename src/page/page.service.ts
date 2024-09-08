import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { access } from 'node:fs/promises';
import { HttpService } from '@nestjs/axios';
import { DataTransform } from './streams/Streams';
import { pipeline } from 'stream/promises';
import { PageExternalDataService } from './PageExternalData.service';

@Injectable()
export class PageService {
  constructor(
    private readonly HttpService: HttpService,
    private readonly pageExternalDataService: PageExternalDataService,
  ) {}

  private readonly logger = new Logger(PageService.name);
  id: number = 0;
  async createPage(text: string): Promise<string> {
    const fileId = this.id;
    const writableFile = fs.createWriteStream(`${fileId}`);
    this.id += 1;

    return new Promise((resolve, reject) => {
      writableFile.write(text);
      writableFile.end();

      writableFile.on('finish', () => {
        this.logger.log(
          `file with file id: ${fileId} was created successfully`,
        );

        resolve(`file with file id: ${fileId} was created successfully`);
      });
      writableFile.on('error', (err) => {
        this.logger.error(`error while creating file`, err.stack);
        this.logger.debug(err);

        reject(err);
      });
    });
  }

  async getPage(id: number): Promise<string> {
    try {
      await access(`${id}`);

      this.logger.log(`file exists`);
    } catch (error) {
      this.logger.error(`file doesn't exist`);
      this.logger.debug(error);

      throw new NotFoundException('file not found');
    }

    const fileReadStream = fs.createReadStream(`${id}`);
    this.id += 1;
    const newId = this.id;

    // read => transform => write
    let results;

    try {
      results = await Promise.all([
        this.pageExternalDataService.getUser(),
        this.pageExternalDataService.getPost(),
      ]);
      this.logger.log('data fetched successfully');
    } catch (error) {
      console.log(error);
      this.logger.error('error while fetching data');
      this.logger.debug(error);

      throw new Error('error while fetching data');
    }

    const dataTransform = new DataTransform(results);

    const fileWriteStream = fs.createWriteStream(`${newId}`);

    try {
      await pipeline(fileReadStream, dataTransform, fileWriteStream);

      this.logger.log(`file ${newId} writed successfully`);

      return `${newId}`;
    } catch (error) {
      this.logger.error('error while processing file');
      this.logger.debug(error);

      throw new Error('error while processing file');
    }
  }
}
