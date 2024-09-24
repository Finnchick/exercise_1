import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './DTO/CreatePageDto';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}
  @Get('/:id')
  async getPage(@Param('id') id: number): Promise<string> {
    return await this.pageService.getPage(id);
  }

  @Post('/')
  async createPage(@Body() createPageDTO: CreatePageDto): Promise<string> {
    return await this.pageService.createPage(createPageDTO.text);
  }
}
