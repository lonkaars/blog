import Seperator from '../components/seperator';
import Navbar from '../components/navbar';
import Button from '../components/button';
import Image from '../components/image';
import Chapters from '../components/chapters';

import ReactMarkdown from 'react-markdown';

export default function Home() {
	return <div>
		<div className="centeredPage">
			<div className="titleWrapper">
				<h1>Loek’s excruciatingly interesting blog</h1>
				<p className="subtile">Loek heeft dit geschreven</p>
			</div>
			<div className="navAreaWrapper">
				<div className="sticky">
					<Navbar page="home"/>
					<Chapters chapters={[
						{
							name: "gert",
							children: [
								{
									name: "gert2",
									children: [
										{
											name: "gert3",
										},
										{
											name: "gert",
											children: [
												{
													name: "gert2",
													children: [
														{
															name: "gert3",
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							name: "gert",
							children: [
								{
									name: "gert2",
									children: [
										{
											name: "gert3",
										},
										{
											name: "gert",
											children: [
												{
													name: "gert2",
													children: [
														{
															name: "gert3",
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							name: "gert4",
							children: [
								{
									name: "gert5",
								}
							]
						}
					]}/>
				</div>
			</div>
			<div className="contentWrapper">

				<ReactMarkdown children={"### cool\n\nbanaan"}/>
				
				<p>
					Lorem ipsum <a>dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida dictum fusce ut placerat orci nulla pellentesque. Laoreet id donec ultrices tincidunt arcu. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. A scelerisque purus semper eget duis at tellus. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Arcu bibendum at varius vel pharetra vel turpis nunc eget. Euismod in pellentesque massa placerat duis. Lorem ipsum dolor sit amet consectetur adipiscing elit. Ultrices in iaculis nunc sed augue lacus. Vestibulum mattis ullamcorper velit sed. Adipiscing diam donec adipiscing
				</p>
				<a href="https://blog.pipeframe.xyz">Here's a link</a>
				<Button text="gert" onclick={() => alert("Hallo wereld!")}/>
				<Button text="gert2" href="https://github.com/lonkaars"/>
				<Image src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fbarkpost-assets.s3.amazonaws.com%2Fwp-content%2Fuploads%2F2013%2F11%2FplainDoge.jpg&f=1&nofb=1" title="fonny doge meme big laugh hahaha funni image big fonny me laugh because image fonne"/>

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
