/** URL of a file under public/, correct under the GitHub Pages base path too. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
