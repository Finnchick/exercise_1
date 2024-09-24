import { IsNumber } from 'class-validator';

export class GetPageParams {
  @IsNumber()
  id: number;
}
