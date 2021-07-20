import Head from 'next/head';
import { useEffect, useState } from 'react';

import '../styles/button.css';
import '../styles/card.css';
import '../styles/code.css';
import '../styles/globals.css';
import '../styles/image.css';
import '../styles/layout.css';
import '../styles/navbar.css';
import '../styles/print.css';
import '../styles/search.css';
import '../styles/tags.css';
import '../styles/theme.css';

export default function Blog({ Component, pageProps }) {
	var [dark, setDark] = useState(false);
	useEffect(() => {
		let colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
		setDark(!!colorSchemeQueryList.matches);
		colorSchemeQueryList.addEventListener('change', e => setDark(!!e.matches));
	}, []);

	return <>
		<Head>
			<html lang='en-US' />
			<link rel='preload' as='style' href='/font/font.css' onLoad={() => this.rel = 'stylesheet'} />
			<meta property='og:url' content='https://blog.pipeframe.xyz' />
			<meta property='og:type' content='website' />
			<meta name='theme-color' content={dark ? '#0D0C1A' : '#EFE9F4'} />
		</Head>
		<Component {...pageProps} />
	</>;
}
