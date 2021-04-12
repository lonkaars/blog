import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';

import Navbar from '../components/navbar';
import Tags from '../components/tag';

import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

function SearchBar(props: { searchFunction: () => void; }) {
	return <div className='searchBar'>
		<input
			className='input'
			id='searchInput'
			placeholder='Search for posts...'
			onChange={() => props.searchFunction()}
			spellCheck='false'
			autoComplete='off'
		/>
		<button className='button' onClick={() => props.searchFunction()}>
			<SearchOutlinedIcon />
		</button>
	</div>;
}

export interface Post {
	title: string;
	subtitle: string;
	author: string;
	date: string;
	id: string;
	cover: string;
	tags: Array<string>;
}

export interface PostsInfo {
	valid_tags: Array<string>;
	posts: Array<Post>;
}

function Post(props: { post: Post; }) {
	return <a className='post' href={'/post/' + props.post.id}>
		<b className='title'>{props.post.title}</b>
		{props.post.subtitle && <p className='subtitle'>{props.post.subtitle}</p>}
		<p className='authordate'>
			Written by {props.post.author} on {new Date(props.post.date).toLocaleString('en-us', {
				month: 'long',
				day: 'numeric',
			})}
		</p>
		<Tags tags={props.post.tags} />
	</a>;
}

function Posts(props: { posts: Array<Post>; }) {
	return <div className='searchResults'>
		{props.posts.map(post => <Post post={post} key={Math.random().toString()} />)}
	</div>;
}

function searchFilter(query: string, tags: Array<string>) {
	var output = {
		query: '',
		tags: [],
	};

	// remove string literals from tag matching
	var queryWithoutLiterals = query.replace(/\".+?\"/g, '');

	// find tags and remove them from the query
	tags.forEach(tag => {
		var index = queryWithoutLiterals.indexOf(tag);
		if (index == -1) return;

		// remove tag from query
		queryWithoutLiterals = queryWithoutLiterals.substr(0, index)
			+ queryWithoutLiterals.substr(index + tag.length);

		output.tags.push(tag);
	});

	// add back in the string literals (janky just gets pasted on end)
	output.query = queryWithoutLiterals + ' '
		+ (query.match(/\".+?\"/g)
			?.map(r => r.substr(1, r.length - 2))
			.join(' ') || '');
	return output;
}

export default function SearchPage() {
	var [posts, setPosts] = useState<PostsInfo>({ posts: [], valid_tags: [] });
	var [query, setQuery] = useState('-');
	var [visiblePosts, setVisiblePosts] = useState<Array<Post>>([]);

	var fuse = new Fuse(posts.posts, {
		keys: [
			'title',
			'subtitle',
			'author',
			'date',
			'id',
			'tags',
		],
		isCaseSensitive: false,
	});

	useEffect(() => {
		(async () => {
			var query = new URLSearchParams(window.location.search).get('q') || '';
			if (query) {
				(document.getElementById('searchInput') as HTMLInputElement).value = query;
			}

			var posts = await fetch('/posts.json');
			var postsJson: PostsInfo = await posts.json();
			setPosts(postsJson);
			setQuery(query);
		})();
	}, []);

	useEffect(() => {
		var search = searchFilter(query, posts.valid_tags);

		if (search.query.length == 0) {
			var results = posts.posts;
		} else {
			var fuseSearch = fuse.search(search.query);
			var results = fuseSearch.map(res => res.item);
		}

		results = results.filter(result => {
			for (var i in search.tags) {
				if (!result.tags.includes(search.tags[i])) {
					return false;
				}
			}
			return true;
		});
		results = results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		setVisiblePosts(results);
	}, [query]);

	return <div>
		<div className='centeredPage'>
			<div className='titleWrapper'>
				<h1>Search for posts</h1>
			</div>
			<div className='navAreaWrapper'>
				<div className='sticky'>
					<Navbar page='search' />
				</div>
			</div>
			<div className='contentWrapper'>
				<SearchBar
					searchFunction={() => {
						setTimeout(() => setQuery((document.getElementById('searchInput') as HTMLInputElement).value));
					}}
				/>
				<Posts posts={visiblePosts} />
			</div>
		</div>
	</div>;
}
