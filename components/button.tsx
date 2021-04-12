export default function Button(props: {
	text: string;
	href?: string;
	onclick?: () => void;
}) {
	return props.href
		? <a href={props.href} className='button'>{props.text}</a>
		: <button onClick={props.onclick} className='button'>{props.text}</button>;
}
