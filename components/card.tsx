import Tags from './tag';

import { ArticleMeta } from '../pages/post/[id]';

export default function PostCard(props: {
	post: ArticleMeta;
}) {
	return <a className='postCard' href={'/post/' + props.post.id}>
		{props.post.cover && <img src={props.post.cover} className='cover' />}
		<h2 className='title'>{props.post.title}</h2>
		<strong className='subtitle'>{props.post.subtitle}</strong>
		{props.post.tags?.length != 0 && <Tags tags={props.post.tags} />}
	</a>;
}
