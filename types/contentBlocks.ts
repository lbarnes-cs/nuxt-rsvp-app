export type ContentBlockType = 'header' | 'subheader' | 'paragraphs' | 'list';

export interface SectionBlocks {
  type: ContentBlockType;
  content: string | string[]; // 'header' has a single string; the rest have string[]
}
