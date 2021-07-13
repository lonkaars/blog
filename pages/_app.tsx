import Head from 'next/head';
import { useEffect, useState } from 'react';

import '../styles/button.css';
import '../styles/card.css';
import '../styles/code.css';
import '../styles/colors.css';
import '../styles/globals.css';
import '../styles/image.css';
import '../styles/layout.css';
import '../styles/navbar.css';
import '../styles/print.css';
import '../styles/search.css';
import '../styles/tags.css';

export default function Blog({ Component, pageProps }) {
	var [dark, setDark] = useState(false);
	useEffect(() => {
		let colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
		setDark(!!colorSchemeQueryList.matches);
		colorSchemeQueryList.addEventListener('change', e => setDark(!!e.matches));
	}, []);

	return <>
		<Head>
			<link rel='preload' as='style' href='/font/font.css' onLoad={() => this.rel = 'stylesheet'} />

			<title>Loek's Blog</title>

			<meta property='og:site_name' content="Loek's blog" />
			<meta property='og:url' content='https://blog.pipeframe.xyz' />
			<meta property='og:title' content="Loek's excruciatingly interesting blog" />
			<meta property='og:description' content='This is my personal blog website' />
			<meta property='og:type' content='website' />
			<meta name='theme-color' content={dark ? '#0D0C1A' : '#c9c9dd'} />
		</Head>
		<Component {...pageProps} />
	</>;
}
