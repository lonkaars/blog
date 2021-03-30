import Navbar from '../components/navbar';
import { FormEvent } from 'react';
import { ArticleMeta } from './post/[id]';

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

export default function SearchPage(props: {
	posts: Array<{
		props: {
			meta: ArticleMeta
		}
	}>
}) {
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
			</div>
		</div>
	</div>
}

// grep -Por "^\[meta\]:\s+<tags>\s+\(\K(.+)(?=\)$)" posts

