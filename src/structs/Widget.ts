import { Snowflake } from "../typings";

const BASE_URL: string = "https://top.gg/api/v1";

/**
 * Widget generator functions.
 */
export class Widget {
  /**
   * Generates a large widget URL.
   *
   * @param {Snowflake} id The ID.
   * @returns {string} The widget URL.
   */
  public static large(id: Snowflake): string {
    return `${BASE_URL}/widgets/large/${id}`;
  }
}
