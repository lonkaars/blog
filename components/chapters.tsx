import { ReactNode, useState, CSSProperties } from 'react';

import { NavbarItem } from '../components/navbar';

import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

export interface chapter {
	name: string;
	sectionLink?: string;
	children?: Array<chapter>;
}

function NavbarChapter(props: {
	level: number;
	chapter: chapter;
	children?: ReactNode;
}) {
	var [ collapsed, setCollapsed ] = useState(true);

	var icon = <div className={ "collapseIcon" + (collapsed ? "" : " collapsed") }>
		{
			props.chapter.children?.length > 0 ?
				<KeyboardArrowDownRoundedIcon/> :
				<RemoveRoundedIcon/>
		}
	</div>

	var classes = [
		"chapter",
		`indentLevel${props.level}`
	]
	!collapsed && classes.push("childrenCollapsed");

	var outercss = /* { "--children-height": 0 + "px" } */ {} as CSSProperties;

	return <NavbarItem
	icon={icon}
	classList={classes}
	title={props.chapter.name}
	onIconClick={() => props.chapter.children?.length > 0 && setCollapsed(!collapsed)}
	href={"#" + props.chapter.sectionLink}
	key={(() => Math.round(Math.random() * 1e12))()}
	style={{
		marginLeft: 12 * props.level,
	}} outerStyle={outercss}>
		{props.children}
	</NavbarItem>
}

class Chapter {
	constructor(public chapters: Array<chapter>, public level: number) {}
	render() {
		return <div className="chapterChildren">
			{
				this.chapters?.map(chapter => {
					return <NavbarChapter level={this.level} chapter={chapter}>
						{ new Chapter(chapter.children, this.level + 1).render() }
					</NavbarChapter>
				})
			}
		</div>
	}
}

export default function Chapters(props: {
	chapters: Array<chapter>;
}) {
	return new Chapter(props.chapters, 0).render();
}
