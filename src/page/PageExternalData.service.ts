import { AxiosResponse } from 'axios/index';
import { Post, User } from './pageExternalTypes';
import { randomInt } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { generatePostUrl, generateUserUrl } from './api-external.meta';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PageExternalDataService {
  constructor(private readonly httpService: HttpService) {}

  async getPost(): Promise<AxiosResponse<Post>> {
    const postId = randomInt(1, 100);
    return lastValueFrom(this.httpService.get(generatePostUrl(postId))); // Я не знаю зачему я вынес это в функцию. Лучше оставить темлпейт строку?
  }

  async getUser(): Promise<AxiosResponse<User>> {
    const userId = randomInt(1, 10);
    return lastValueFrom(this.httpService.get(generateUserUrl(userId)));
  }
}
