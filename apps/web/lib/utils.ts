import filename2prism from "filename2prism";

export function getLanguageFromFilename(filename: string | undefined): string {
    if (!filename) return "text";

    const languages = filename2prism(filename);

    // filename2prism returns an array of potential language aliases.
    // We take the first one, or default to "text" if none found.
    return languages?.[0] ?? "text";
}
