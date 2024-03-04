import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
    constructor(private gptService: GptService) {}
    @Post()
    chat(@Body() body: {prompt:string}): Promise<Observable<string>> {
      return this.gptService.generateText(body.prompt);
    }
}
