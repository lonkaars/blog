import Button from '../components/button';
import PostCard from '../components/card';
import Chapters, { chapter } from '../components/chapters';
import Navbar, { NavbarItem } from '../components/navbar';
import Seperator from '../components/seperator';
import { ArticleMeta, getStaticProps as getBlogPage, RenderedArticle } from './post/[id]';
import { PostsInfo } from './search';

import { useEffect, useState } from 'react';

// edit this to change the post displayed on the home page and the pinned posts
var posts = ['index', 'connect4', 'software', 'git'];

export default function Home(props: {
	posts: Array<{
		props: {
			content: string;
			meta: ArticleMeta;
		};
	}>;
}) {
	var [posts, setPosts] = useState<PostsInfo>({ posts: [], valid_tags: [] });

	useEffect(() => {
		(async () => {
			var posts = await fetch('/posts.json');
			var postsJson: PostsInfo = await posts.json();
			setPosts(postsJson);
		})();
	}, []);

	return <div>
		<div className='centeredPage'>
			<div className='titleWrapper'>
				<h1>{props.posts[0].props.meta.title}</h1>
			</div>
			<div className='navAreaWrapper'>
				<div className='sticky'>
					<Navbar page='home' />
					<NavbarItem title='Pinned posts:' classList={['pinned']} />
					<Chapters
						chapters={[
							...props.posts.slice(1).map(post => {
								return {
									children: post.props.meta.chapters,
									name: post.props.meta.title,
									sectionLink: '/post/' + post.props.meta.id,
								} as chapter;
							}),
						]}
					/>
				</div>
			</div>
			<div className='contentWrapper'>
				{props.posts.map((post, index) => {
					return <>
						{index != 0 && <h1>{post.props.meta.title}</h1>}
						<RenderedArticle content={post.props.content} />
						{index + 1 != props.posts.length && <Seperator />}
						{index == 0 && <>
							<h2>Recent posts</h2>
							<div className='recentPosts'>
								{posts.posts.slice(0, 4).reverse().map(post => {
									return <PostCard post={post} />;
								})}
							</div>

							<div>
								<Button text='Go to all posts' href='/search' />
							</div>
							<Seperator />
						</>}
					</>;
				})}
			</div>
		</div>
	</div>;
}

export function getStaticProps() {
	var postsContent = [];

	posts.forEach(id => {
		postsContent.push(getBlogPage({ params: { id } }));
	});

	var staticProps = { props: { posts: postsContent } };

	return staticProps;
}
