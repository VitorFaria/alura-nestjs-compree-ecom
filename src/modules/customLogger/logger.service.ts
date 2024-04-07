import { ConsoleLogger, Injectable } from "@nestjs/common";
import { appendFileSync } from "fs";

@Injectable()
export class CustomLogger extends ConsoleLogger {

  private formatLog(name, amountAvailable, value) {
    return `LOCAL: ${this.context} - TIMESTAMP ${this.getTimestamp()} - NOME: ${name} - QUANTIDADE: ${amountAvailable} - PREÇO: ${value}`;
  } 

  logfile(product) {
    const { name, amountAvailable, value } = product;

    const formattedMsg = this.formatLog(name, amountAvailable, value) + '\n';

    const logFilename = 'product.log';
    let logfilePath = process.env.LOG_ERROR_PATH;
    if (logfilePath) {
      logfilePath += logFilename;
      appendFileSync(logfilePath, formattedMsg);
    }
  }

  createlogErrorFile(entry: any) {
    const logFilename = 'error.log';
    let logfilePath = process.env.LOG_ERROR_PATH;

    if (logfilePath) {
      logfilePath += logFilename;
      appendFileSync(logfilePath, entry);
    }
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}\n`;

    this.createlogErrorFile(entry);
    super.error(message, stackOrContext);
  }
}