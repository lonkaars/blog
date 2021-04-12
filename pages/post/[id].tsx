import ReactMarkdownWithHTML from 'react-markdown/with-html';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { ReactNode } from 'react';
import gfm from 'remark-gfm';

import Navbar from '../../components/navbar';
import Seperator from '../../components/seperator';
// import Button from '../../components/button';
import Chapters, { chapter } from '../../components/chapters';
import Image from '../../components/image';
import Tags from '../../components/tag';

export interface ArticleMeta {
	title?: string;
	subtitle?: string;
	author?: string;
	tags?: Array<string>;
	date?: string;
	chapters?: Array<chapter>;
	id?: string;
}

export function RenderedArticle(props: { content: string; }) {
	return <ReactMarkdownWithHTML
		plugins={[gfm]}
		allowDangerousHtml
		children={props.content}
		renderers={{
			image: Image,
			thematicBreak: Seperator,
			heading: Heading,
		}}
	/>;
}

var headingLevel = (input: string) => input?.match(/^[#]+/)[0]?.length || 0;

var sectionID = (input: string) =>
	input
		.replace(/[()\[\]{}!@#$%^&*<>?,./\;':"\\|=+]/g, '')
		.replace(/\s/g, '-')
		.toLowerCase();

function Heading(props: {
	children?: ReactNode;
	level?: number;
}) {
	var HeadingTag = 'h' + props.level as keyof JSX.IntrinsicElements;
	return <HeadingTag id={sectionID(props.children[0].props.children)} children={props.children} />;
}

export default function Post(props: {
	content: string;
	meta: ArticleMeta;
}) {
	return <div>
		<div className='centeredPage'>
			<div className='titleWrapper'>
				<h1>{props.meta.title}</h1>
				<p className='subtile'>{props.meta.subtitle}</p>
				{props.meta.tags && <Tags tags={props.meta.tags} />}
			</div>
			<div className='navAreaWrapper'>
				<div className='sticky'>
					<Navbar />
					<Chapters chapters={props.meta.chapters} />
				</div>
			</div>
			<div className='contentWrapper'>
				<RenderedArticle content={props.content} />
			</div>
		</div>
	</div>;
}

var parseTag = {
	'title': (val: string) => val,
	'subtitle': (val: string) => val,
	'author': (val: string) => val,
	'tags': (val: string) => val.split(',').map(i => i.trim()),
	'date': (val: string) => new Date(val).toDateString(),
};

function parseMeta(file: Array<string>): ArticleMeta {
	var meta: ArticleMeta = {};

	file.forEach(line => {
		if (!line.startsWith('[meta]: ')) return;
		var tags = line.match(/\[meta\]:\s+\<(.+?)\>\s+\((.+?)\)/);
		if (!tags || !tags[1] || !tags[2]) return;
		if (!parseTag.hasOwnProperty(tags[1])) return;
		meta[tags[1]] = parseTag[tags[1]](tags[2]);
	});

	return meta;
}

function parseToCRecursive(headings: Array<string>): Array<chapter> {
	interface WIPchapter extends chapter {
		unparsedChildren?: Array<string>;
	}
	var children: Array<WIPchapter> = [];

	var lowestLevel = headingLevel(headings[0]);
	var currentChildIndex = -1;
	for (var i in headings) {
		var localLevel = headingLevel(headings[i]);
		if (localLevel == lowestLevel) {
			var chapterName = headings[i].match(/^[#]+\s+(.+)/)[1];
			children.push({
				name: chapterName,
				sectionLink: '#' + sectionID(chapterName),
				unparsedChildren: [],
			});
			currentChildIndex += 1;
		} else {
			children[currentChildIndex].unparsedChildren.push(headings[i]);
		}
	}

	children.map(child => {
		child.children = parseToCRecursive(child.unparsedChildren);
		delete child.unparsedChildren;

		return child;
	});

	return children as Array<chapter>;
}

function parseToC(file: Array<string>): Array<chapter> {
	var fileAsStr = file.join('\n');
	fileAsStr = fileAsStr.replace(/```.*?```/gs, ''); // filter out code blocks from table of contents
	var fileAsArr = fileAsStr.split('\n');
	var chapterStrings = fileAsArr.filter(line => line.startsWith('#'));
	return parseToCRecursive(chapterStrings);
}

function preprocessor(fileContent: string) {
	var fileAsArr = fileContent.split('\n');
	var meta = parseMeta(fileAsArr);
	meta.chapters = parseToC(fileAsArr);
	var result = fileAsArr.join('\n').trim();
	return { meta, result };
}

export function getStaticProps(props: { params: { id: string; }; }) {
	var filename = join('posts/', props.params.id + '.md');
	var filecontent = readFileSync(filename).toString().trim();

	var parsed = preprocessor(filecontent);
	parsed.meta.id = props.params.id;

	return {
		props: {
			content: parsed.result,
			meta: parsed.meta,
		},
	};
}

export function getStaticPaths() {
	var files = readdirSync('posts').filter(f => f.endsWith('.md'));

	return {
		paths: files.map((f) => {
			return {
				params: {
					id: f.substr(0, f.length - 3),
				},
			};
		}),
		fallback: false,
	};
}
