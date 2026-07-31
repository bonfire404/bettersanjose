import { NewsItem } from '../types';
import rawNewsData from './news.json';

const staticNews: NewsItem[] = [
  {
    id: '1',
    title: 'Philippines Launches New Digital Government Platform',
    summary:
      'The government unveils a new digital platform to streamline access to public services.',
    excerpt:
      'The government unveils a new digital platform to streamline access to public services.',
    content:
      'The Philippine government has launched a new digital platform designed to streamline citizen access to public services.',
    url: 'https://www.brigadanews.ph/',
    publishedAt: '2025-04-15T08:00:00Z',
    date: '2025-04-15T08:00:00Z',
    source: 'Brigada News Antique',
    category: 'national',
    municipality: 'Province-wide',
    imageUrl:
      'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const news: NewsItem[] =
  Array.isArray(rawNewsData) && rawNewsData.length > 0
    ? (rawNewsData as NewsItem[])
    : staticNews;

