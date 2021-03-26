import Head from 'next/head';

import '../styles/colors.css';
import '../styles/layout.css';
import '../styles/globals.css';
import '../styles/navbarItem.css';

export default function Blog({ Component, pageProps }) {
	return <div>
		<Head>
			<link rel="stylesheet" href="/font/font.css"/>
		</Head>
		<Component {...pageProps} />
	</div>
}

