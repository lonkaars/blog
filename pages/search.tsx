import { useState, useEffect } from 'react';

import Navbar from '../components/navbar';
import { FormEvent } from 'react';
import { ArticleMeta } from './post/[id]';
import Tags from '../components/tag'

import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

function SearchBar(props: {
	searchFunction: (event?: FormEvent<HTMLFormElement>) => void;
}) {
	return <div className="searchBar">
		<form onSubmit={props.searchFunction}>
			<input className="input" placeholder="Search for posts..." autoComplete="off"/>
			<button className="button" onClick={() => props.searchFunction()}><SearchOutlinedIcon/></button>
			<input type="submit" style={{ display: "none" }}/>
		</form>
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

	useEffect(() => {(async () => {
		var posts = await fetch("/posts.json");
		setPosts(await posts.json());
	})()}, []);

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
				<SearchBar searchFunction={(event?: FormEvent<HTMLFormElement>) => {
					event?.preventDefault();
				}}/>
				<Posts posts={posts.posts}/>
			</div>
		</div>
	</div>
}

