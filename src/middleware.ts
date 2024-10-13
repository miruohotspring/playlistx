import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import { availableLanguages, defaultLanguage } from './app/i18n/settings';

const getNegotiatedLanguage = (
  headers: Negotiator.Headers,
): string | undefined => {
  return new Negotiator({ headers }).language([...availableLanguages]);
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

export function middleware(request: NextRequest) {
  const headers = {
    'accept-language': request.headers.get('accept-language') ?? '',
  };
  const preferredLanguage = getNegotiatedLanguage(headers) || defaultLanguage;

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const pathnameIsMissingLocale = availableLanguages.every(
    (lang: string) =>
      !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`,
  );

  if (pathnameIsMissingLocale) {
    if (preferredLanguage !== defaultLanguage) {
      return NextResponse.redirect(
        new URL(`/${preferredLanguage}${pathname}`, request.url),
      );
    }
    const newPathname = `/${defaultLanguage}${pathname}${search}`;
    return NextResponse.rewrite(new URL(newPathname, request.url));
  }

  return NextResponse.next();
}
