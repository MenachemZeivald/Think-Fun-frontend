import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

export default function Icon({ text, link, pic, clickHandler }) {
	return link ? (
		<Link to={link}>
			<IconStyle className='material-symbols-outlined'>{text}</IconStyle>
		</Link>
	) : (
		<IconStyle onClick={clickHandler} className='material-symbols-outlined'>
			{pic ? <img src={pic} alt={'user profile'} /> : text}
		</IconStyle>
	);
}

const IconStyle = styled(DefaultStyle)`
	width: 50px;
	aspect-ratio: 1;
	font-size: 200%;
	font-weight: bold;
	img {
		height: 30px;
		position: absolute;
		top: 6px;
		transform: none;
	}
`;
