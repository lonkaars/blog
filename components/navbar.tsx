import { ReactNode } from 'react';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

function NavbarItem(props: {
	icon?: ReactNode;
	title: string;
	href: string;
	active: boolean;
}) {
	return <a href={props.href} className={ "navbarItem" + (props.active ? " active" : "") }>
		<div>
			{props.icon}
			<span>{props.title}</span>
		</div>
	</a>
}

export default function Navbar(props: {
	page?: string;
}) {
	return <div>
		<NavbarItem active={props.page == "home"} icon={<HomeRoundedIcon/>} title="Home" href="/"/>
		<NavbarItem active={props.page == "search"} icon={<SearchRoundedIcon/>} title="Search for posts" href="/search"/>
	</div>
}
