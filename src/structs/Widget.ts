import { Snowflake } from "../typings";

const BASE_URL: string = "https://top.gg/api/v1";

/**
 * Widget type.
 */
export enum WidgetType {
  DiscordBot = "discord/bot",
  DiscordServer = "discord/server"
}

/**
 * Widget generator functions.
 */
export class Widget {
  /**
   * Generates a large widget URL.
   *
   * @param {WidgetType} ty The widget type.
   * @param {Snowflake} id The ID.
   * @returns {string} The widget URL.
   */
  public static large(ty: WidgetType, id: Snowflake): string {
    return `${BASE_URL}/widgets/large/${ty}/${id}`;
  }

  /**
   * Generates a small widget URL for displaying votes.
   *
   * @param {WidgetType} ty The widget type.
   * @param {Snowflake} id The ID.
   * @returns {string} The widget URL.
   */
  public static votes(ty: WidgetType, id: Snowflake): string {
    return `${BASE_URL}/widgets/small/votes/${ty}/${id}`;
  }

  /**
   * Generates a small widget URL for displaying an entity's owner.
   *
   * @param {WidgetType} ty The widget type.
   * @param {Snowflake} id The ID.
   * @returns {string} The widget URL.
   */
  public static owner(ty: WidgetType, id: Snowflake): string {
    return `${BASE_URL}/widgets/small/owner/${ty}/${id}`;
  }

  /**
   * Generates a small widget URL for displaying social stats.
   *
   * @param {WidgetType} ty The widget type.
   * @param {Snowflake} id The ID.
   * @returns {string} The widget URL.
   */
  public static social(ty: WidgetType, id: Snowflake): string {
    return `${BASE_URL}/widgets/small/social/${ty}/${id}`;
  }
}
