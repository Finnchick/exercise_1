import { Transform, TransformCallback } from 'stream';

export interface ResponseInterface {
  data: object;
}

export class DataTransform extends Transform {
  private apiData: ResponseInterface[];

  constructor(apiData: []) {
    super();
    this.apiData = apiData;
  }
  _transform(chunk: any, encoding: string, callback: TransformCallback): void {
    this.push(chunk.toString().toLowerCase());
    callback();
  }
  _flush(callback: TransformCallback) {
    this.push(
      this.apiData.map((response) => JSON.stringify(response.data)).join(''),
    );
    callback();
  }
}
