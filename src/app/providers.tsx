import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import enMessages from '../i18n/messages/en.json';
import esMessages from '../i18n/messages/es.json';
import { useAppSelector } from '../store/hooks';
import { store } from '../store/store';

const messages = {
  es: esMessages,
  en: enMessages,
};

function IntlWrapper({ children }: { children: ReactNode }) {
  const locale = useAppSelector((state) => state.ui.locale);

  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="es">
      {children}
    </IntlProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <IntlWrapper>
        {children}
        <Toaster richColors position="top-right" />
      </IntlWrapper>
    </Provider>
  );
}
