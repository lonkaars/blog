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
	return <div>
		<Head>
			<link rel='stylesheet' href='/font/font.css' />
		</Head>
		<Component {...pageProps} />
	</div>;
}
