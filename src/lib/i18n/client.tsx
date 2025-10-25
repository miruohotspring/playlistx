'use client';

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect } from 'react';
import {
  initReactI18next,
  useTranslation as useTranslationOrigin,
} from 'react-i18next';
import { getOptions } from './config';

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../locales/${language}/${namespace}.json`),
    ),
  )
  .init(getOptions());

export function useTranslation(lang: string) {
  const { t, i18n } = useTranslationOrigin();

  useEffect(() => {
    const shouldChangeLanguage = lang && lang !== i18n.resolvedLanguage;
    if (shouldChangeLanguage) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return { t, i18n };
}
