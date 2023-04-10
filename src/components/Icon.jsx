import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

export default function Icon({ text, to, clickHandler }) {
	return to ? (
		<Link to={to}>
			<IconStyle className='material-symbols-outlined'>{text}</IconStyle>
		</Link>
	) : (
		<IconStyle onClick={clickHandler} className='material-symbols-outlined'>
			{text}
		</IconStyle>
	);
}

const IconStyle = styled(DefaultStyle)`
	width: 50px;
	aspect-ratio: 1;
	font-size: 200%;
	font-weight: bold;
`;
