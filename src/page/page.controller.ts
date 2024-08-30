import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {PageService} from "./page.service";

export type getPageParams = {
    id: string;
}

export type createPageDTO = {
    text: string;
}

@Controller('page')
export class PageController {
    constructor(private readonly pageService: PageService) {
    }
    @Get('/:id')
    async getPage(@Param() params: getPageParams): Promise<string> {
        return await this.pageService.getPage(Number(params.id))
    }

    @Post('/')
    createPage(@Body() createPageDTO: createPageDTO): string {
        return this.pageService.createPage(createPageDTO.text)
    }
}
