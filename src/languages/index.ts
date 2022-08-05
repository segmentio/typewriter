import { LanguageGenerator } from './types';
export * from './types';
export const supportedLanguages: LanguageGenerator[] = [];

// Export all your languages here
export { typescript } from './typescript';
export { javascript } from './javascript';
export { kotlin } from './kotlin';
export { swift } from './swift';
