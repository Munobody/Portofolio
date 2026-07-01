export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ActivityItem {
  id: string;
  icon: "monitor" | "globe" | "compass" | "code" | "award";
  date: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  tag?: "Proyek" | "Berita" | "Acara";
  imageUrl?: string;
}

export interface MediaHighlight {
  title: string;
  link: string;
  date: string;
}

export interface TimelineItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface PortfolioData {
  navbar: {
    logo: string;
    links: NavLink[];
    buttonText: string;
  };
  hero: {
    subHeader: string;
    mainHeader: string;
    paragraph: string;
    button1: { text: string; href: string };
    button2: { text: string; href: string };
  };
  about: {
    badgeText: string;
    subHeader: string;
    mainHeader: string;
    paragraph1: string;
    paragraph2: string;
    photoUrl: string;
    stats: StatItem[];
  };
  activities: {
    subHeader: string;
    mainHeader: string;
    viewAllText: string;
    viewAllHref: string;
    items: ActivityItem[];
  };
  cta: {
    mainHeader: string;
    button1: { text: string; href: string };
    button2: { text: string; href: string };
  };
  footer: {
    logo: string;
    description: string;
    socials: NavLink[];
  };
  
  // Expanded Sub-pages Configuration
  aboutPage: {
    subHeader: string;
    mainHeader: string;
    description: string;
    photoUrl: string;
    backgroundText: string;
    visionText: string;
    values: ValueItem[];
    timeline: TimelineItem[];
    lifestyle: {
      photoUrl1: string;
      photoUrl2: string;
      tags: string[];
      quote: string;
      quoteAuthor: string;
    };
  };
  activitiesPage: {
    subHeader: string;
    mainHeader: string;
    paragraph: string;
    items: ActivityItem[];
    mediaHeader: string;
    mediaParagraph: string;
    mediaLinks: MediaHighlight[];
  };
  contactPage: {
    subHeader: string;
    mainHeader: string;
    paragraph: string;
    email: string;
    location: string;
    socialHeader: string;
  };
  updatedAt?: number;
}
