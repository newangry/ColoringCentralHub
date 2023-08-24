import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import HomeContext from '@/state/index.context';
import { useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeProvider, MantineThemeOverride } from '@mantine/core';
import { initialState, HomeInitialState } from '@/state/index.state';
import { useCreateReducer } from '@/hooks/useCreateReducer';

export default function App({ Component, pageProps }: AppProps) {

  const [isClient, setIsClient] = useState(false)
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });

  useEffect(() => {
    setIsClient(true);
  }, [])
  const {
    state: {
      colorScheme,
    },
  } = contextValue;
  const myTheme: MantineThemeOverride = {
    colorScheme: colorScheme,
    spacing: {
      chatInputPadding: '40px'
    }
  };
  return (
    <HomeContext.Provider
      value={{
        ...contextValue,
      }}
    >

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={() => { }}>
        <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
    </HomeContext.Provider>
  )
}
