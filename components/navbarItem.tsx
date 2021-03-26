import { ReactNode } from 'react';

export default function NavbarItem(props: {
	icon?: ReactNode;
	title: string;
	href: string;
}) {
	return <a href={props.href} className="navbarItem">
		<div>
			{props.icon}
			<span>{props.title}</span>
		</div>
	</a>
}
