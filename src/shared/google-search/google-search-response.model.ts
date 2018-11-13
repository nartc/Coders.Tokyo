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
  cse_thumbnail: CseThumnail[];
  metatags: MetaTag[];
}

class CseThumnail {
  width: number;
  height: number;
  src: string;
}

class MetaTag {
  'og:description': string;
}