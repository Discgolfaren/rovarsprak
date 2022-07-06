import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  readonly consonants = 'bcdfghjklmnpqrstvwxz';

  constructor(
    protected readonly httpService: HttpService /* eslint-disable-line no-unused-vars */,
  ) {}

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private async get(url: string): Promise<any> {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const responseData: any = await lastValueFrom(
      this.httpService.get(url, {
        timeout: 10000,
      }),
    );
    const items = responseData?.data;

    return items;
  }

  public translateFromRovarsprak(rovarsprak: string): string {
    let normal = '';
    let i = 1;

    if (typeof rovarsprak === 'string') {
      normal = rovarsprak[0];
      for (; i < rovarsprak.length - 1; i++) {
        const c = rovarsprak[i];
        const cPrev = rovarsprak[i - 1];
        const cNext = rovarsprak[i + 1];

        if (
          c.toLowerCase() === 'o' &&
          this.consonants.includes(cPrev.toLowerCase()) &&
          cPrev === cNext
        ) {
          i += 1;
        } else {
          normal = `${normal}${c}`;
        }
      }
      if (i < rovarsprak.length) {
        normal = `${normal}${rovarsprak[rovarsprak.length - 1]}`;
      }
    }

    return normal;
  }

  public translateFromNormal(normal: string): string {
    if (typeof normal !== 'string') {
      return '';
    }
    const rovarsprak = [...normal]
      .map((c) => {
        if (this.consonants.includes(c)) {
          return `${c}o${c}`;
        } else if (this.consonants.includes(c.toLowerCase())) {
          return `${c}O${c}`;
        }

        return c;
      })
      .join('');

    return rovarsprak;
  }

  async jokeAPI(
    url: string,
    jokeKeys: string[],
  ): Promise<Record<string, string>> {
    const answer = await this.get(url);
    const response = {};

    jokeKeys?.forEach((key) => {
      response[key] = this.translateFromNormal(answer[key]);
    });

    return response;
  }
}
