import { CSSProperties } from 'react';

export default function Tags(props: {
	tags: Array<string>;
}) {
	return <div className="tags">
		<span>Tags:</span>
		{props.tags.map(tag => <Tag name={tag}/>)}
	</div>
}

export function Tag(props: {
	name: string;
}) {
	return <a className="tag" href={"/search?q=" + props.name} style={{
		"--tag-hue": props.name
			.split("")
			.map(char => char.charCodeAt(0))
			.reduce((a, b) => a + b)
			% 360
	} as CSSProperties}>
		{props.name}
	</a>
}
