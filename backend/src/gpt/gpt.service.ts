import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GptService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) { }

    async generateText(prompt: string) {
        try {
            const apiKey = this.configService.get("OPEN_API_KEY");
            console.log('apiKey', apiKey);
            return this.httpService.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are a helpful assistant."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    stream: true,
                },
                { headers: { 'Authorization': `Bearer ${apiKey}` } }
            ).pipe(map(response => response.data));
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
