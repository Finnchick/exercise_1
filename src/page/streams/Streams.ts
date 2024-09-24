import { Transform, TransformCallback } from 'stream';

export interface ResponseInterface {
  data: Record<string, unknown>;
}

export class DataTransform extends Transform {
  private apiData: ResponseInterface[];

  constructor(apiData: []) {
    super();
    this.apiData = apiData;
  }
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    this.push(chunk.toString().toLowerCase());
    callback();
  }
  _flush(callback: TransformCallback): void {
    this.push(
      this.apiData.map((response) => JSON.stringify(response.data)).join(''),
    );
    callback();
  }
}
