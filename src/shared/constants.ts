export const GG_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1?' +
  'key={key}&' +
  'cx={cx}&' +
  'fields=items(title, link, snippet,pagemap(cse_thumbnail,metatags(og:description))),searchInformation(searchTime, totalResults)&' +
  'q=';

export const SUCCESS_COLOR = 'good';
export const ERROR_COLOR = 'danger';
export const FALLBACK_STRING = 'Channel does not support me';
export const FOOTER_STRING = 'Coders.Tokyo Slackbot';