import { NavbarItem } from '../components/navbar';

import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

interface chapter {
	name: string;
	sectionLink?: string;
	children?: Array<chapter>;
}

class Chapter {
	constructor(public chapters: Array<chapter>, public level: number) {}
	render() {
		console.log(this)
		return <div>
			{
				this.chapters?.map(chapter => {
					return <NavbarItem icon={<RemoveRoundedIcon/>} chapterIndent={this.level} title={chapter.name}>
						{ new Chapter(chapter.children, this.level + 1).render() }
					</NavbarItem>
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
