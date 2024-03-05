import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { Readable, Transform } from 'stream';
import { ChatGPTAPI, ChatMessage } from 'chatgpt';
import { Observable, from } from 'rxjs';

@Injectable()
export class GptService {
    private API: ChatGPTAPI;
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) { }
    async onModuleInit() {
        const importDynamic = new Function('modulePath', 'return import(modulePath)')
        const { ChatGPTAPI } = await importDynamic('chatgpt')

        this.API = new ChatGPTAPI({
            apiKey: this.configService.get('OPEN_API_KEY'),
        });
    }

    async generateText(prompt: string) {
        const dataObservable = new Observable<string>((subscriber) => {
            this.API.sendMessage(prompt, {
                onProgress: (partialResponse: ChatMessage) => {
                    subscriber.next(JSON.stringify({ id: partialResponse.id, message: (partialResponse.delta ?? partialResponse.text) }))
                },
            });

            // Optional: Provide a teardown logic if needed
            // return () => {
            //   console.log('Observable teardown/cleanup');
            // };
        });
        return dataObservable;
    }
}
