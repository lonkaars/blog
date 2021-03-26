import Seperator from '../components/articleSeperator';
import NavbarItem from '../components/navbarItem';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

export default function Home() {
	return <div>
		<div className="centeredPage">
			<div className="titleWrapper">
				<h1>Loek’s excruciatingly interesting blog</h1>
				<p className="subtile">Loek heeft dit geschreven</p>
			</div>
			<div className="navAreaWrapper">
				<div className="sticky">
					<NavbarItem icon={<HomeRoundedIcon/>} title="Home" href="#"/>
					<NavbarItem icon={<SearchRoundedIcon/>} title="Search for posts" href="#"/>
				</div>
			</div>
			<div className="contentWrapper">
				<p>
					Lorem ipsum <a>dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida dictum fusce ut placerat orci nulla pellentesque. Laoreet id donec ultrices tincidunt arcu. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. A scelerisque purus semper eget duis at tellus. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Arcu bibendum at varius vel pharetra vel turpis nunc eget. Euismod in pellentesque massa placerat duis. Lorem ipsum dolor sit amet consectetur adipiscing elit. Ultrices in iaculis nunc sed augue lacus. Vestibulum mattis ullamcorper velit sed. Adipiscing diam donec adipiscing
				</p>
				<a href="https://blog.pipeframe.xyz">Here's a link</a>

				<Seperator/>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida dictum fusce ut placerat orci nulla pellentesque. Laoreet id donec ultrices tincidunt arcu. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. A scelerisque purus semper eget duis at tellus. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Arcu bibendum at varius vel pharetra vel turpis nunc eget. Euismod in pellentesque massa placerat duis. Lorem ipsum dolor sit amet consectetur adipiscing elit. Ultrices in iaculis nunc sed augue lacus. Vestibulum mattis ullamcorper velit sed. Adipiscing diam donec adipiscing
				</p>
				<p>
					Lorem ipsum <a>dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida dictum fusce ut placerat orci nulla pellentesque. Laoreet id donec ultrices tincidunt arcu. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. A scelerisque purus semper eget duis at tellus. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Arcu bibendum at varius vel pharetra vel turpis nunc eget. Euismod in pellentesque massa placerat duis. Lorem ipsum dolor sit amet consectetur adipiscing elit. Ultrices in iaculis nunc sed augue lacus. Vestibulum mattis ullamcorper velit sed. Adipiscing diam donec adipiscing
				</p>
				<p>
					Lorem ipsum <a>dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida dictum fusce ut placerat orci nulla pellentesque. Laoreet id donec ultrices tincidunt arcu. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. A scelerisque purus semper eget duis at tellus. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Arcu bibendum at varius vel pharetra vel turpis nunc eget. Euismod in pellentesque massa placerat duis. Lorem ipsum dolor sit amet consectetur adipiscing elit. Ultrices in iaculis nunc sed augue lacus. Vestibulum mattis ullamcorper velit sed. Adipiscing diam donec adipiscing
				</p>
			</div>
		</div>
	</div>
}
