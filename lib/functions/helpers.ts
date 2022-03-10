import { APIGatewayEvent, Context } from "aws-lambda";

/**
 * Class used to make logging easier. It is ideal in AWS to send JSON log entries to cloudwatch
 * logs because it makes it easier to search, parse and read. It is also ideal if every log entry
 * contains the lambda event and context so that you can see things like the unique invocation id etc.
 */
export class Logger {
  private readonly event: APIGatewayEvent;
  private readonly context: Context;

  /**
   * Create an instance of this logger at the top of your handler like this:
   * `const logger = Logger(event, context)
   *
   * @param {APIGatewayEvent} event - the event that is passed to the lambda from api gateway
   * @param {Context} context - the context that is passed to the lambda from api gateway
   */
  constructor(event: APIGatewayEvent, context: Context) {
    this.event = event;
    this.context = context;
  }

  /**
   * Use this method to create a structured log event.
   *
   * Example usage with just a message string:
   * `logger.log("this is the message")`
   * Example usage that also includes 2 additional objects, params and result that you might want to log
   * `logger.log("this is the message", { params, result }`
   *
   * @param {string} message - every log entry must have a message string
   * @param {Record<string, any>} otherItems - pass in any other objects or strings
   */
  log(message: string, otherItems?: Record<string, any>): void {
    console.log(JSON.stringify({ event: this.event, context: this.context, message, ...otherItems }));
  }
}
