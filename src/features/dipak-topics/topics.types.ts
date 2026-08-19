export interface TopicItem {
  id: string;
  number: string;
  /** Small mono kicker above the title, e.g. "COGNITIVE DYNAMICS". */
  tag: string;
  title: string;
  description: string;
  image?: string;
  href?: string;
}

export interface TopicsContent {
  sectionNumber: string;
  sectionTitle: string;
  headlineWord1: string;
  headlineWord2: string;
  metaLabel: string;
  supportingNote: string;
  topics: TopicItem[];
}
