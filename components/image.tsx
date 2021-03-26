export default function Image(props: {
	src: string;
	title?: string;
}) {
	return <div className="image">
		<img src={props.src} alt={props.title}/>
		{
			props.title && <div>
				<p>{props.title}</p>
			</div>
		}
	</div>
}
