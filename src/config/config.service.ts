import { Injectable } from "@nestjs/common";
import * as glob from "glob";
import * as path from "path";
import * as _ from "lodash";

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
@Injectable()
export class ConfigService {
  private readonly fileConfig: Map<string, object>;
  private readonly environments: string[];

  get environment() {
    return process.env.NODE_ENV;
  }

  constructor(configDir?: string, environments?: string[]) {
    this.environments = environments || ["test", "development", "production"];
    this.fileConfig = configDir ? this.loadConfigFiles(configDir) : new Map();
  }

  /**
   * Gets configuration by key.
   *
   * Lookup order is as follows: environment variables, configuration files.
   *
   * Note:
   *
   * For configuration files you can use the following syntax for the key:
   *
   * file-name:some-key
   * file-name:some-key.some-nested-key
   * file-name:some-key.[0].b.c
   */
  public get<T = string>(key: string, defaultValue: T | null = null): T | null {
    if (process.env.hasOwnProperty(key)) {
      return (process.env[key] || defaultValue) as T;
    }
    const [file, keyPath] = key.split(":");
    if (this.fileConfig.has(file)) {
      const config = this.fileConfig.get(file);
      return keyPath ? _.get(config, keyPath, defaultValue) : config;
    }
    return defaultValue;
  }

  public getNumber(key: string, defaultValue: number | null = null): number {
    if (process.env.hasOwnProperty(key)) {
      const number = Number(process.env[key]);
      return Number.isNaN(number) ? defaultValue : number;
    }
    return defaultValue;
  }

  /**
   * Loads json configuration files from provided directory.
   */
  private loadConfigFiles(configDir: string) {
    const allFiles = glob.sync("*.json", {
      cwd: configDir
    });
    const defaultFiles = allFiles.filter(
      file =>
        !file.match(new RegExp(`\.(${this.environments.join("|")})\.json$`))
    );
    const envFiles = allFiles.filter(file =>
      file.endsWith(`.${this.environment}.json`)
    );
    const loadConfig = file => require(path.join(configDir, "/", file));
    const fileConfig = new Map<string, object>();

    for (const file of defaultFiles) {
      const config = loadConfig(file);
      const targetKey = file.replace(/\.json$/, "");

      fileConfig.set(targetKey, config);
    }

    // load environment specific configurations
    for (const file of envFiles) {
      const config = loadConfig(file);
      const targetKey = file.replace(`.${this.environment}.json`, "");
      const defaultConfig = fileConfig.get(targetKey) || {};

      fileConfig.set(targetKey, { ...defaultConfig, ...config });
    }

    return fileConfig;
  }

  async encryptString(token: string) {
    const secret = this.get("APP_KEY");
    var ciphertext = CryptoJS.AES.encrypt(token, secret);
    return ciphertext.toString();
  }

  async decryptString(encripted: string) {
    const secret = this.get("APP_KEY");
    var bytes = CryptoJS.AES.decrypt(encripted, secret);
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}
