// Regional & Municipality News API - Path: functions/api/news.ts
import type { Env } from '../types';

const ALLOWED_ORIGINS = [
  'https://betterlb.pages.dev',
  'https://betterlb.gov.ph',
  'http://localhost:5173',
  'http://localhost:8788',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const origin = request.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  const url = new URL(request.url);
  const municipality = url.searchParams.get('municipality') || 'all';

  let query = 'site:brigadanews.ph Antique';
  if (municipality && municipality !== 'all') {
    query = `${municipality} Antique news Philippines`;
  }

  const encodedQuery = encodeURIComponent(query);
  const feedUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-PH&gl=PH&ceid=PH:en`;

  try {
    const rssResponse = await fetch(feedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!rssResponse.ok) {
      throw new Error(`RSS fetch failed with status ${rssResponse.status}`);
    }

    const xmlText = await rssResponse.text();

    return new Response(
      JSON.stringify({
        success: true,
        municipality,
        query,
        rawXmlLength: xmlText.length,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=1800',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Failed to fetch regional news',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  };
};

export const onRequestOptions: PagesFunction = async (context) => {
  const origin = context.request.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
};
