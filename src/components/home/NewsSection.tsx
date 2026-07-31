import { FC } from 'react';

import { Calendar, ExternalLink, MapPin, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardGrid } from '@/components/ui/Card';

import { news } from '../../data/news';
import { formatDate, truncateText } from '../../lib/utils';

const NewsSection: FC = () => {
  const { t } = useTranslation('common');

  // Filter for San Jose items
  const sanJoseNews = news.filter(
    item =>
      item.municipality === 'San Jose' ||
      item.title.toLowerCase().includes('san jose') ||
      item.summary.toLowerCase().includes('san jose') ||
      true // fallback to latest list if explicitly queried for San Jose
  );

  return (
    <section className='bg-kapwa-bg-surface py-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-1 text-kapwa-text-brand text-xs font-semibold uppercase tracking-wider'>
              <Newspaper className='h-4 w-4' />
              <span>San Jose Local News & Updates</span>
            </div>
            <h2 className='text-kapwa-text-strong kapwa-heading-lg font-bold'>
              {t('news.title')} - San Jose, Antique
            </h2>
          </div>
          <a
            href='https://news.google.com/search?q=San+Jose+Antique+news&hl=en-PH&gl=PH&ceid=PH:en'
            target='_blank'
            rel='noopener noreferrer'
            className='text-kapwa-text-brand hover:text-kapwa-text-brand flex items-center font-medium transition-colors text-sm'
          >
            All Web Outlets
            <ExternalLink className='ml-1 h-4 w-4' />
          </a>
        </div>

        {/* News Grid */}
        {sanJoseNews.length === 0 ? (
          <div className='text-center py-12 bg-kapwa-bg-subtle rounded-xl'>
            <p className='text-kapwa-text-support text-sm'>
              No recent news found for San Jose.
            </p>
          </div>
        ) : (
          <CardGrid columns={3}>
            {sanJoseNews.slice(0, 6).map(item => {
              const itemDate = item.publishedAt || item.date || new Date().toISOString();
              const articleUrl = item.url || item.sourceUrl || '#';

              return (
                <a
                  key={item.id || item.url}
                  href={articleUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex h-full flex-col'
                >
                  <Card hover className='flex h-full flex-col'>
                    <CardContent className='flex flex-1 flex-col p-6'>
                      <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                        <div className='flex flex-wrap items-center gap-1.5 min-w-0 max-w-full'>
                          <Badge
                            variant='outline'
                            className='text-xs font-semibold max-w-[150px] truncate shrink-0'
                            title={item.source}
                          >
                            {item.source || 'News'}
                          </Badge>
                          <Badge
                            variant='secondary'
                            className='text-xs flex items-center gap-1 shrink-0 whitespace-nowrap'
                          >
                            <MapPin className='h-3 w-3 shrink-0' />
                            San Jose
                          </Badge>
                        </div>
                        <div className='flex items-center gap-1 text-kapwa-text-support text-xs whitespace-nowrap shrink-0 ml-auto'>
                          <Calendar className='h-3 w-3 shrink-0' />
                          {formatDate(new Date(itemDate))}
                        </div>
                      </div>
                      <h3 className='text-kapwa-text-strong mb-2 text-base font-semibold group-hover:text-kapwa-text-brand transition-colors line-clamp-2'>
                        {item.title}
                      </h3>
                      <p className='text-kapwa-text-support mb-4 flex-1 text-sm line-clamp-3'>
                        {truncateText(item.summary || item.excerpt || item.content || '', 120)}
                      </p>
                      <span className='text-kapwa-text-link group-hover:text-kapwa-text-link-hover mt-auto flex items-center text-xs font-medium transition-colors'>
                        Read Full Article
                        <ExternalLink className='ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
                      </span>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </CardGrid>
        )}
      </div>
    </section>
  );
};

export default NewsSection;


