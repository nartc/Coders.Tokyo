export class GoogleSearchResponse {
  items: Item[];
  searchInformation: SearchInformation;
}

class Item {
  link: string;
  title: string;
  snippet: string;
}

class SearchInformation {
  searchTime: number;
  totalResults: string;
}
