import {Controller, Get, Param, Post} from '@nestjs/common';

export type getPageParams = {
    id: string;
}

@Controller('page')
export class PageController {
    @Get('/page/:id')
    getPage(@Param() params: getPageParams): string {

        return "this must return a page"
    }

    @Post('/page')
    createPage(): string {
        return "this must create a page"
    }
}
