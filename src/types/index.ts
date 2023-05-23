import { DocumentInitialProps } from 'next/document';
import { AppProps } from 'next/app';
import { EmotionCache } from "@emotion/cache"

export interface MyAppPropsType extends AppProps {
    emotionCache: EmotionCache
}

type CustomDocumentType = MyAppPropsType & DocumentInitialProps

export interface DocumentPropsType extends CustomDocumentType {
    emotionStyleTags: React.JSX.Element[]
}