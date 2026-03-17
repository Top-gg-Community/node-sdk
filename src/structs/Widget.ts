import { Platform, ProjectType, Snowflake } from "../typings.js";

const BASE_URL: string = "https://top.gg/api/v1/widgets";

/**
 * Widget generator functions.
 */
export class Widget {
  /**
   * Generates a large widget URL.
   *
   * @param {Platform} platform The project's platform.
   * @param {WidgetType} projectType The project's type.
   * @param {Snowflake} id The project's ID.
   * @returns {string} The widget URL.
   */
  public static large(
    platform: Platform,
    projectType: ProjectType,
    id: Snowflake
  ): string {
    return `${BASE_URL}/large/${platform}/${projectType}/${id}`;
  }

  /**
   * Generates a small widget URL for displaying votes.
   *
   * @param {Platform} platform The project's platform.
   * @param {WidgetType} projectType The project's type.
   * @param {Snowflake} id The project's ID.
   * @returns {string} The widget URL.
   */
  public static votes(
    platform: Platform,
    projectType: ProjectType,
    id: Snowflake
  ): string {
    return `${BASE_URL}/small/votes/${platform}/${projectType}/${id}`;
  }

  /**
   * Generates a small widget URL for displaying a project's owner.
   *
   * @param {Platform} platform The project's platform.
   * @param {WidgetType} projectType The project's type.
   * @param {Snowflake} id The project's ID.
   * @returns {string} The widget URL.
   */
  public static owner(
    platform: Platform,
    projectType: ProjectType,
    id: Snowflake
  ): string {
    return `${BASE_URL}/small/owner/${platform}/${projectType}/${id}`;
  }

  /**
   * Generates a small widget URL for displaying social stats.
   *
   * @param {Platform} platform The project's platform.
   * @param {WidgetType} projectType The project's type.
   * @param {Snowflake} id The project's ID.
   * @returns {string} The widget URL.
   */
  public static social(
    platform: Platform,
    projectType: ProjectType,
    id: Snowflake
  ): string {
    return `${BASE_URL}/small/social/${platform}/${projectType}/${id}`;
  }
}
