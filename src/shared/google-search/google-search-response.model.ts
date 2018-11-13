export class GoogleSearchResponse {
  items: Item[];
  searchInformation: SearchInformation;
}

class Item {
  link: string;
  title: string;
  snippet: string;
  pagemap: PageMap;
}

class SearchInformation {
  searchTime: number;
  totalResults: string;
}

class PageMap {
  cse_thumbnail: CseThumbnail[];
  metatags: MetaTag[];
}

class CseThumbnail {
  width: number;
  height: number;
  src: string;
}

class MetaTag {
  'og:description': string;
}