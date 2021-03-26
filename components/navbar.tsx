import { ReactNode, CSSProperties } from 'react';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

export function NavbarItem(props: {
	icon?: ReactNode;
	title: string;
	href?: string;
	active?: boolean;
	children?: ReactNode;
	classList?: Array<string>;
	style?: CSSProperties;
}) {
	var classes = props.classList || [];
	classes.push("navbarItem");
	props.active && classes.push("active");
	return <a href={props.href} className={classes.join(" ")}>
		<div className="inner" style={props.style}>
			{props.icon}
			<span>{props.title}</span>
		</div>
		{props.children}
	</a>
}

export default function Navbar(props: {
	page?: string;
}) {
	return <div style={{ marginBottom: 24 }}>
		<NavbarItem active={props.page == "home"} icon={<HomeRoundedIcon/>} title="Home" href="/"/>
		<NavbarItem active={props.page == "search"} icon={<SearchRoundedIcon/>} title="Search for posts" href="/search"/>
	</div>
}
