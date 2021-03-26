import { ReactNode, useState } from 'react';

import { NavbarItem } from '../components/navbar';

import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

interface chapter {
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

	var icon = props.chapter.children?.length > 0 ?
		collapsed ? <KeyboardArrowDownRoundedIcon/> : <KeyboardArrowRightRoundedIcon/> :
		<RemoveRoundedIcon/>

	var classes: Array<string> = [];
	classes.push("chapter")
	classes.push(`indentLevel${props.level}`)

	return <NavbarItem icon={icon} classList={classes} title={props.chapter.name} style={{
		marginLeft: 12 * props.level
	}}>
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
