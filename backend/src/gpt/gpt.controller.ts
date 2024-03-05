import { Body, Controller, Query, Sse } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private gptService: GptService) {}

  @Sse()
  async chat(@Query('prompt') prompt: string) {
    return this.gptService.generateText(prompt);
  }
  @Sse('post')
  async post(@Body('prompt') prompt: string) {
    return this.gptService.generateText(prompt);
  }
}
