import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import {HttpService} from "@nestjs/axios";
import {lastValueFrom, map, Observable} from "rxjs";
import {AxiosResponse} from "axios";
import {randomInt} from 'crypto'
import {response} from "express";

export type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        }
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    }
}

@Injectable()
export class PageService {

    constructor(private readonly HttpService: HttpService) {
    }

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

    async getPage(id: number): Promise<string> {

        const fileReadStream = fs.createReadStream(`${id}`)

        this.id += 1
        const newId = this.id

        const fileWriteStream = fs.createWriteStream(`${newId}`)

        fileReadStream.pipe(fileWriteStream,{end: false})

            fileReadStream.on('end', async () => {
                try {
                    const {data: user} = await this.getUser();


                    const {data: post} = await this.getPost();

                    fileWriteStream.write(JSON.stringify(user))
                    fileWriteStream.write(JSON.stringify(post))

                    fileWriteStream.end();
                } catch (error) {
                    console.log(error)
                }
            });


        return `${newId}`
    }

    async getPost(): Promise<AxiosResponse<Post>> {
        const postId = randomInt(1, 100)
        return lastValueFrom(this.HttpService.get(`https://jsonplaceholder.typicode.com/posts/${postId}`))
    }

    async getUser(): Promise<AxiosResponse<User>> {
        const userId = randomInt(1, 10)
        return lastValueFrom(this.HttpService.get(`https://jsonplaceholder.typicode.com/users/${userId}`))
    }
}
