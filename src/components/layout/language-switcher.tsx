"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  getAvailableLocaleLabel,
  type Locale,
  resolveLocale,
} from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeLocale = useMemo(
    () => resolveLocale(searchParams.get("lang") ?? locale),
    [locale, searchParams],
  );

  useEffect(() => {
    const storedLocale = resolveLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));

    if (!searchParams.has("lang") && storedLocale !== activeLocale) {
      router.replace(withLocaleParam(pathname, searchParams.toString(), storedLocale));
      router.refresh();
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, activeLocale);
    document.cookie = `${LOCALE_COOKIE_NAME}=${activeLocale}; path=/; max-age=31536000; samesite=lax`;
  }, [activeLocale, pathname, router, searchParams]);

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {activeLocale === "es" ? "Idioma" : "Language"}
      </span>
      <div className="inline-flex rounded-md border bg-background p-1">
        {(["es", "en"] as Locale[]).map((option) => {
          const selected = option === activeLocale;

          return (
            <Button
              key={option}
              type="button"
              variant={selected ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => {
                router.replace(withLocaleParam(pathname, searchParams.toString(), option));
                router.refresh();
              }}
              aria-pressed={selected}
            >
              {getAvailableLocaleLabel(option)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function withLocaleParam(pathname: string, search: string, locale: Locale) {
  const params = new URLSearchParams(search);
  params.set("lang", locale || DEFAULT_LOCALE);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
