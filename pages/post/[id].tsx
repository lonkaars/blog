import ReactMarkdown from 'react-markdown';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// import Seperator from '../../components/articleSeperator';
import Navbar from '../../components/navbar';
// import Button from '../../components/button';
// import Image from '../../components/image';
import Chapters, { chapter } from '../../components/chapters';

interface ArticleMeta {
	title?: string;
	subtitle?: string;
	date?: Date;
	chapters?: Array<chapter>;
}

export default function Post(props: {
	content: string,
	meta: ArticleMeta
}) {
	return <div>
		<div className="centeredPage">
			<div className="titleWrapper">
				<h1>{props.meta.title}</h1>
				<p className="subtile">{props.meta.subtitle}</p>
			</div>
			<div className="navAreaWrapper">
				<div className="sticky">
					<Navbar/>
					<Chapters chapters={props.meta.chapters}/>
				</div>
			</div>
			<div className="contentWrapper">
				<ReactMarkdown children={props.content}/>
			</div>
		</div>
	</div>
}

function preprocessor(fileContent: string) {
	var fileAsArr = fileContent.split("\n");
	var meta: ArticleMeta = {};

	var result = fileAsArr.join("\n").trim()
	return { meta, result }
}

export function getStaticProps(props: {params: { id: string }}) {
	var filename = join("posts/", props.params.id + ".md")
	var filecontent = readFileSync(filename).toString().trim()

	var parsed = preprocessor(filecontent);

	return {
		props: {
			content: parsed.result,
			meta: parsed.meta,
		},
	}
}

export function getStaticPaths() {
	var files = readdirSync("posts").filter(f => f.endsWith(".md"));

	return {
		paths: files.map((f) => {
			return {
				params: {
					id: f.substr(0, f.length - 3)
				}
			}
		}),
		fallback: false,
	}
}

