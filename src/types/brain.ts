/**
 * Shared domain types for the Second Brain app (frontend).
 */
export type Brain = { id: string; name: string };

export type Section = "tweets" | "videos" | "docs" | "links";

/**
 * Generic item within a section listing; concrete content types
 * may extend with additional fields as needed.
 */
export type SectionItem = {
  id: string;
  title: string;
  href?: string;
  createdAt?: string;
};

export type BrainItemType = 'tweet' | 'video' | 'note' | 'link' | 'other' | 'youtube';

export type BrainItem = {
  id: string;
  brainId: string;
  title: string;
  type: BrainItemType;
  url?: string;
  content?: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  thumbnail?: string; // e.g. for videos
  author?: string;    // e.g. for tweets
};

/**
 * A single brain entry for sidebar navigation and feature availability flags.
 */
export type BrainNavItems = {
    id: string,
    is_default: boolean,
    name: string,
    tweet: boolean,
    link: boolean,
    youtube: boolean,
    other: boolean,
    note: boolean,
    video:boolean
}


/**
 * Result shape for create-item server action, used by client form state.
 */
export type CreateItemState = {
  success: boolean;
  errors: {
    url?: string[];
    title?: string[];
    content?: string[];
    tags?: string[];
    _form?: string[];
  };
};

/** Initial empty state for create-item forms. */
export const INITIAL_STATE: CreateItemState = { success: false, errors: {} };

/** Sidebar nav list of brains. */
export type BrainNav = BrainNavItems[]


export type BrainDetails = {
  id: string,
  name: string,
  description: string,
  counts: {
    total: number,
  tweets: number,
  videos: number,
  notes: number,
  links: number,
  other: number,
  youtube: number,
  }
}



    
