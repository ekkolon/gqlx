import type { Options as PrettierOptions } from 'prettier';
import { format as prettierFormat } from 'prettier/standalone';

/**
 * An optional configuration object based on Prettier's formatting options,
 * excluding `parser` and `plugins`. This allows further customization of formatting rules such
 * as indentation and line width.
 */
export type GqlxFormatOptions = Omit<PrettierOptions, 'parser' | 'plugins'>;

/**
 * Formats a GraphQL query string using Prettier's GraphQL plugin.
 *
 * This function utilizes Prettier to ensure consistent formatting across GraphQL queries,
 * making them more readable and manageable. It can be used to pre-format queries before
 * execution or display, enhancing the readability of GraphQL operations.
 *
 * @param query - The GraphQL query string to format. This should be a valid GraphQL query to
 * avoid syntax errors in the formatted output.
 * @param options - An optional configuration object based on Prettier's formatting options,
 * excluding `parser` and `plugins`. This allows further customization of formatting rules such
 * as indentation and line width.
 *
 * @returns A Promise that resolves to a formatted GraphQL query string.
 *
 * @example
 * ```typescript
 * const formattedQuery = await formatGQL(queryString, { printWidth: 80 });
 * ```
 */
export async function formatGQL(
  query: string,
  options?: GqlxFormatOptions,
): Promise<string> {
  const prettierGraphQL = await import('prettier/plugins/graphql');
  return prettierFormat(query, {
    ...options,
    parser: 'graphql',
    plugins: [prettierGraphQL],
  });
}

/**
 * Formats a JSON string using JSON.stringify.
 */
export async function formatJSON(query: string): Promise<string> {
  return JSON.stringify(query, null, 2);
}
