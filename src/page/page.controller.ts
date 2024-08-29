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
    getPage(@Param() params: getPageParams): string {

        return "this must return a page"
    }

    @Post('/')
    createPage(@Body() createPageDTO: createPageDTO): string {
        return this.pageService.createPage(createPageDTO.text)
    }
}
