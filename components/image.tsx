export default function Image(props: {
	src: string;
	alt?: string;
}) {
	return <div className="image">
		<img src={props.src} alt={props.alt}/>
		{
			props.alt && <div>
				<p>{props.alt}</p>
			</div>
		}
	</div>
}
