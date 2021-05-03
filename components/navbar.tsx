import { CSSProperties, ReactNode } from 'react';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import MenuIcon from '@material-ui/icons/Menu';

export function NavbarItem(props: {
	icon?: ReactNode;
	title: string;
	href?: string;
	active?: boolean;
	children?: ReactNode;
	classList?: Array<string>;
	style?: CSSProperties;
	outerStyle?: CSSProperties;
	onIconClick?: () => void;
	onClick?: () => void;
}) {
	var classes = props.classList || [];
	classes.push('navbarItem');
	props.active && classes.push('active');
	return <a href={props.href} className={classes.join(' ')} style={props.outerStyle}>
		<div className='inner' style={props.style}>
			<div className='icon' onClick={props.onIconClick}>{props.icon}</div>
			<span className='title' onClick={props.onClick}>{props.title}</span>
		</div>
		{props.children}
	</a>;
}

export default function Navbar(props: {
	page?: string;
}) {
	return <div className="globalLinks" style={{ marginBottom: 24 }}>
		<NavbarItem
			active={props.page == 'home'}
			icon={<HomeRoundedIcon />}
			title='Home'
			href='/'
			classList={['indentLevel0', 'link']}
		/>
		<NavbarItem
			active={props.page == 'search'}
			icon={<SearchRoundedIcon />}
			title='Search for posts'
			href='/search'
			classList={['indentLevel0', 'link']}
		/>
	</div>;
}

export function MobileNavbar() {
	return <div className="mobileNav">
		<a className="home button small" href="/"><HomeRoundedIcon /></a>
		<a className="search button small" href="/search"><SearchRoundedIcon/></a>
		<div className="mainButton button" onClick={() => {
			document.getElementsByClassName("mobileNav")[0].classList.toggle("open");
			document.getElementsByClassName("navAreaWrapper")[0].classList.toggle("navVisible");
		}}>
			<MenuIcon style={{ "fill": "var(--oxford-blue)" }} />
		</div>
	</div>;
}
