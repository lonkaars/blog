import { ReactNode } from 'react';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

export function NavbarItem(props: {
	icon?: ReactNode;
	title: string;
	href?: string;
	active?: boolean;
	chapterIndent?: number;
	children?: ReactNode;
}) {
	return <a href={props.href} className={
		"navbarItem"
		+ (props.active ? " active" : "")
		+ (typeof props.chapterIndent !== "undefined" ? " chapter" : "")
		+ " indentLevel" + (props.chapterIndent || 0)
	}>
		<div className="inner" style={{
			marginLeft: 12 * props.chapterIndent || 0
		}}>
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
