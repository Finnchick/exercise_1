import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './DTO/CreatePageDto';
import { GetPageParams } from './DTO/GetPageParams';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}
  @Get('/:id')
  async getPage(@Param() params: GetPageParams): Promise<string> {
    try {
      return await this.pageService.getPage(Number(params.id));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/')
  async createPage(@Body() createPageDTO: CreatePageDto): Promise<string> {
    try {
      return await this.pageService.createPage(createPageDTO.text);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
