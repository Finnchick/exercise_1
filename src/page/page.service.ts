import { Injectable } from '@nestjs/common';
import * as fs from "fs";

@Injectable()
export class PageService {

    id: number = 0;
    createPage(text: string): string {
        const fileId = this.id
        const writableFile = fs.createWriteStream(`${fileId}`)
        this.id += 1
        writableFile.write(text)
        writableFile.end()

        writableFile.on('finish', () => {
            console.log('finished')
        })
        writableFile.on('error', (err) => {
            console.log(err)
        })

        return `file with file id: ${fileId} was created successfully`
    }

    // getPage(id: number): string {
    //     fs.createReadStream(`${id}`)
    //
    // }
}
