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
	outerStyle?: CSSProperties;
	onIconClick?: () => void;
	onClick?: () => void;
}) {
	var classes = props.classList || [];
	classes.push("navbarItem");
	props.active && classes.push("active");
	return <a href={props.href} className={classes.join(" ")} style={props.outerStyle}>
		<div className="inner" style={props.style}>
			<div className="icon" onClick={props.onIconClick}>{props.icon}</div>
			<span className="title" onClick={props.onClick}>{props.title}</span>
		</div>
		{props.children}
	</a>
}

export default function Navbar(props: {
	page?: string;
}) {
	return <div style={{ marginBottom: 24 }}>
		<NavbarItem
			active={props.page == "home"}
			icon={<HomeRoundedIcon/>}
			title="Home"
			href="/"
			classList={["indentLevel0"]}/>
		<NavbarItem
			active={props.page == "search"}
			icon={<SearchRoundedIcon/>}
			title="Search for posts"
			href="/search"
			classList={["indentLevel0"]}/>
	</div>
}
