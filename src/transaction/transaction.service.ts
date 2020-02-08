import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class TransactionService {
    protected readonly depositEndpoint = '/deposit';
    protected readonly WithdrawEndpoint = '/withdraw';

    constructor(
        protected readonly httpService: HttpService,
        protected readonly configService: ConfigService
    ){
       
    }

    async _post(jwt: string, postData:any, endpoint: string){
        const url = this.configService.get('WALLET_SERVICE_URL') + endpoint;
        try {
           
            const headersRequest = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`,
            };
           
            const result = await this.httpService.post(url, postData, { headers: headersRequest }).toPromise();
            return result.data
          } catch (error) {
              return {status:0, data:error.message + url}
          }
    }
}
