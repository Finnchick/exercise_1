import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { HttpModule } from '@nestjs/axios';
import { PageExternalDataService } from './PageExternalData.service';

@Module({
  imports: [HttpModule],
  controllers: [PageController],
  providers: [PageService, PageExternalDataService],
})
export class PageModule {}
