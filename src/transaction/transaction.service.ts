import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class TransactionService {
  protected readonly depositEndpoint = "/deposit";
  protected readonly WithdrawEndpoint = "/withdraw";

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService
  ) {}

  /**
   * Posts transaction to the wallet service
   * @param jwt
   * @param postData
   * @param endpoint
   * @returns  JSON
   */
  async _post(jwt: string, postData: any, endpoint: string) {
    const url = await this.configService.get("WALLET_SERVICE_URL") + endpoint;
    try {
      const encripted = await this.configService.encryptString(jwt);
      const headersRequest = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        confirmation: `${encripted}`
      };

      const result = await this.httpService
        .post(url, postData, { headers: headersRequest })
        .toPromise();
      return result.data;
    } catch (error) {
      return { status: 0, data: error.message + url };
    }
  }
}
