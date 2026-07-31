import { FC, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';

import Fuse from 'fuse.js';
import {
  BarChart3Icon,
  BuildingIcon,
  DollarSignIcon,
  FileTextIcon,
  GavelIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';

import servicesData from '@/data/services/services.json';
import mergedServicesData from '@/data/citizens-charter/merged-services.json';

interface Service {
  slug: string;
  service?: string;
  office_name?: string;
  office?: string;
  description?: string;
  category?: { name: string; slug: string };
  subcategory?: { name: string; slug: string };
}

interface MergedService {
  slug: string;
  service: string;
  plainLanguageName?: string;
  officeSlug: string;
}

interface QuickAccessCard {
  title: string;
  description: string;
  to: string;
  icon: JSX.Element;
}

const Hero: FC = () => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(servicesData as Service[], {
      keys: [
        'service',
        'office_name',
        'office',
        'description',
        'category.name',
        'subcategory.name',
      ],
      threshold: 0.3,
    });
  }, []);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).map(r => r.item);
  }, [query, fuse]);

  // Random services from merged-services - using plain language titles
  const randomServices = useMemo(() => {
    const services = mergedServicesData as MergedService[];
    // Filter services that have plainLanguageName
    const servicesWithPlainNames = services.filter(s => s.plainLanguageName);
    // Shuffle and pick 2
    const shuffled = [...servicesWithPlainNames].sort(
      () => Math.random() - 0.5
    );
    return shuffled.slice(0, 2);
  }, []);

  // Quick access cards for key sections
  const quickAccessCards: QuickAccessCard[] = [
    {
      title: 'Financial Reports',
      description: 'Budget & income statements',
      to: '/transparency/financial',
      icon: <DollarSignIcon className='w-6 h-6' />,
    },
    {
      title: 'Infrastructure',
      description: 'Track municipal projects',
      to: '/transparency/infrastructure',
      icon: <BuildingIcon className='w-6 h-6' />,
    },
    {
      title: 'Legislation',
      description: 'Ordinances & resolutions',
      to: '/openlgu',
      icon: <GavelIcon className='w-6 h-6' />,
    },
    {
      title: 'Statistics',
      description: 'Population & demographics',
      to: '/statistics',
      icon: <BarChart3Icon className='w-6 h-6' />,
    },
  ];

  return (
    <div className='relative overflow-hidden py-12 text-kapwa-text-inverse bg-emerald-950 md:py-24'>
      {/* Background Municipal Hall Photo Backdrop (High Visibility) */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65'
        style={{ backgroundImage: "url('/logos/sj_municipal.jpg')" }}
      />
      {/* Soft Emerald Gradient Tint Overlay for contrast */}
      <div className='absolute inset-0 bg-gradient-to-r from-emerald-950/75 via-emerald-900/50 to-emerald-950/75' />

      <div className='container relative z-10 px-4 mx-auto'>
        <div className='max-w-4xl animate-fade-in'>
          <h1 className='mb-4 text-kapwa-text-inverse kapwa-heading-xl'>
            {t('hero.title')}
          </h1>
          <p className='mb-8 max-w-xl opacity-80 text-kapwa-text-inverse kapwa-body-md-default'>
            {t('hero.subtitle')}
          </p>

          {/* Search input */}
          <div className='mb-4 max-w-2xl'>
            <SearchInput
              value={query}
              onChangeValue={setQuery}
              placeholder={'Search services...'}
              className='bg-kapwa-bg-surface/80'
            />
          </div>

          {/* Top 5 search results */}
          {query && results.length > 0 && (
            <div className='overflow-y-auto max-h-80 max-w-2xl rounded-lg shadow-md bg-kapwa-bg-surface/90 text-kapwa-text-strong mb-4'>
              {results.slice(0, 5).map(hit => (
                <Link
                  key={hit.slug}
                  to={`/services/${hit.slug}`}
                  className='block p-3 border-b hover:bg-kapwa-bg-hover last:border-none'
                >
                  <strong>
                    {hit.service || hit.office_name || hit.office}
                  </strong>
                  {hit.description && (
                    <p className='text-kapwa-text-support kapwa-body-sm-default'>
                      {hit.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Random services - using plain language titles */}
          <div className='flex flex-wrap gap-2 mt-4'>
            {randomServices.map(service => (
              <Link key={service.slug} to={`/services/${service.slug}`}>
                <Badge
                  variant='outline'
                  className='cursor-pointer border-white/20 text-kapwa-text-inverse hover:bg-kapwa-bg-surface/20'
                >
                  <FileTextIcon className='w-4 h-4' />
                  <span className='ml-1'>
                    {service.plainLanguageName || service.service}
                  </span>
                </Badge>
              </Link>
            ))}
          </div>

          {/* Minimalist Quick Access section directly below random services */}
          <div className='mt-8 pt-6 border-t border-white/15'>
            <h2 className='mb-3 text-xs font-bold uppercase tracking-wider text-white/70'>
              {t('hero.quickAccess')}
            </h2>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {quickAccessCards.map(card => (
                <Link
                  key={card.to}
                  to={card.to}
                  className='group flex items-center gap-2.5 p-2 rounded-lg transition-colors hover:bg-white/10'
                >
                  <div className='text-white group-hover:text-kapwa-brand-400 transition-colors shrink-0'>
                    {card.icon}
                  </div>
                  <div className='min-w-0'>
                    <div className='text-xs font-bold text-white group-hover:text-white truncate'>
                      {card.title}
                    </div>
                    <div className='text-[10px] text-white/60 truncate'>
                      {card.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
