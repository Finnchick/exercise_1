import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { access } from 'node:fs/promises';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { randomInt } from 'crypto';
import { DataTransform } from './streams/Streams';
import { pipeline } from 'stream/promises';
import { Post, User } from './pageExternalTypes';

@Injectable()
export class PageService {
  constructor(private readonly HttpService: HttpService) {}

  id: number = 0;
  async createPage(text: string): Promise<string> {
    const fileId = this.id;
    const writableFile = fs.createWriteStream(`${fileId}`);
    this.id += 1;

    return new Promise((resolve, reject) => {
      writableFile.write(text);
      writableFile.end();

      writableFile.on('finish', () => {
        resolve(`file with file id: ${fileId} was created successfully`);
      });
      writableFile.on('error', (err) => {
        reject(err);
      });
    });
  }

  async getPage(id: number): Promise<string> {
    try {
      await access(`${id}`);
    } catch (error) {
      console.error(error);
      throw new Error("'file doesn't exist");
    }

    const fileReadStream = fs.createReadStream(`${id}`);
    this.id += 1;
    const newId = this.id;

    // read => transform => write
    let results;
    try {
      results = await Promise.all([this.getUser(), this.getPost()]);
    } catch (error) {
      console.error(error);
      throw new Error('error while fetching data');
    }

    const dataTransform = new DataTransform(results);

    const fileWriteStream = fs.createWriteStream(`${newId}`);

    try {
      await pipeline(fileReadStream, dataTransform, fileWriteStream);
      return `${newId}`;
    } catch (error) {
      console.error(error);
      throw new Error('error while processing file');
    }
  }

  async getPost(): Promise<AxiosResponse<Post>> {
    const postId = randomInt(1, 100);
    return lastValueFrom(
      this.HttpService.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
      ),
    );
  }

  async getUser(): Promise<AxiosResponse<User>> {
    const userId = randomInt(1, 10);
    return lastValueFrom(
      this.HttpService.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
      ),
    );
  }
}
