export interface Bookmark {
  id: string;
  title: string;
  url?: string;
  type: 'bookmark' | 'folder';
  items?: Bookmark[];
  isFavorite?: boolean;
  folderId?: string;
  isPinned?: boolean;
}

export interface Settings {
  theme: 'light' | 'dark';
  backgroundType: 'gradient' | 'color' | 'image';
  backgroundColor: string;
  backgroundImage?: string;
  tileSize: 'small' | 'medium' | 'large';
  gridColumns: 2 | 3 | 4 | 5 | 6;
  showClock: boolean;
  showWeather: boolean;
  showQuickLinks: boolean;
  clockType: 'digital' | 'analog';
  searchEngine: 'google' | 'duckduckgo' | 'brave' | 'bing';
  viewMode: 'grid' | 'list';
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
}

export interface Quote {
  text: string;
  author: string;
}