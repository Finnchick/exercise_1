import { IsNumberString } from 'class-validator';

export class GetPageParams {
  @IsNumberString()
  id: number;
}
