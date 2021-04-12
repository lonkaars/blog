import Head from 'next/head';

import '../styles/button.css';
import '../styles/colors.css';
import '../styles/globals.css';
import '../styles/image.css';
import '../styles/layout.css';
import '../styles/navbar.css';
import '../styles/search.css';
import '../styles/tags.css';
import '../styles/card.css';

export default function Blog({ Component, pageProps }) {
	return <>
		<Head>
			<link rel='stylesheet' href='/font/font.css' />

			<title>Loek's Blog</title>

			<meta property='og:site_name' content="Loek's blog" />
			<meta property='og:url' content='https://blog.pipeframe.xyz' />
			<meta property='og:title' content="Loek's excruciatingly interesting blog" />
			<meta property='og:description' content="This is my personal blog website" />
			<meta property='og:type' content='website' />
			<meta name='theme-color' content='#e16d82' />

		</Head>
		<Component {...pageProps} />
	</>;
}
