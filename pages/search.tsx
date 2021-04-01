import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

import Navbar from '../components/navbar';
import Tags from '../components/tag'

import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

function SearchBar(props: { searchFunction: () => void }) {
	return <div className="searchBar">
		<input
		className="input"
		id="searchInput"
		placeholder="Search for posts..."
		onChange={() => props.searchFunction()}
		autoComplete="off"/>
		<button className="button" onClick={() => props.searchFunction()}><SearchOutlinedIcon/></button>
	</div>
}

interface Post {
	title: string
	subtitle: string
	author: string
	date: string
	urlname: string
	tags: Array<string>
}

interface PostsInfo {
	valid_tags: Array<string>
	posts: Array<Post>
}

function Post(props: { post: Post }) {
	return <a className="post" href={"/post/" + props.post.urlname}>
		<b className="title">{props.post.title}</b>
		{props.post.subtitle && <p className="subtitle">{props.post.subtitle}</p>}
		<p className="authordate">Written by {props.post.author} on {new Date(props.post.date).toLocaleString("en-us", {
			month: "long", day: "numeric"
		})}</p>
		<Tags tags={props.post.tags}/>
	</a>;
}

function Posts(props: { posts: Array<Post> }) {
	return <div className="searchResults">
		{
			props.posts.map(post => <Post post={post} key={Math.random().toString()}/>)
		}
	</div>;
}

export default function SearchPage() {
	var [posts, setPosts] = useState<PostsInfo>({ posts: [], valid_tags: [] });
	var [query, setQuery] = useState("");
	var [visiblePosts, setVisiblePosts] = useState<Array<Post>>([]);

	var fuse = new Fuse(posts.posts, {
		keys: [
			"title",
			"subtitle",
			"author",
			"date",
			"urlname",
			"tags"
		],
		isCaseSensitive: false
	})

	useEffect(() => {(async () => {
		var query = new URLSearchParams(window.location.search).get("q") || "";
		if(query)
			(document.getElementById("searchInput") as HTMLInputElement).value = query;
		setQuery(query);

		var posts = await fetch("/posts.json");
		setPosts(await posts.json());
	})()}, []);

	useEffect(() => {
		if(query.length == 0) {
			setVisiblePosts(posts.posts)
		} else {
			setVisiblePosts(fuse.search(query).map(res => res.item))
		}
	}, [query]);

	return <div>
		<div className="centeredPage">
			<div className="titleWrapper">
				<h1>Search for posts</h1>
			</div>
			<div className="navAreaWrapper">
				<div className="sticky">
					<Navbar page="search"/>
				</div>
			</div>
			<div className="contentWrapper">
				<SearchBar searchFunction={() => {
					setTimeout(() => setQuery((document.getElementById("searchInput") as HTMLInputElement).value));
				}}/>
				<Posts posts={visiblePosts}/>
			</div>
		</div>
	</div>
}

