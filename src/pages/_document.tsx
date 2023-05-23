
import * as React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { AppType } from 'next/dist/shared/lib/utils'
import { EmotionCache } from "@emotion/cache"
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../theme';
import createEmotionCache from '../createEmotionCache';
import { DocumentPropsType } from '../types';


const MyDocument = (props: DocumentPropsType) => {
  return (
    <Html lang="en">
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color"
          content={theme.palette.primary.main} />
        <link rel="shortcut icon"
          href="/static/favicon.ico" />
        <link
          rel="stylesheet"
          href=
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        {props.emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {

  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}

      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default MyDocument