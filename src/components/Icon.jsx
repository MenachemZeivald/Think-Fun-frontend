import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from '../api/axios';
import DefaultStyle from '../DefaultStyle';

export default function Icon({ text, link, pic, clickHandler }) {
  const imageUrl = pic?.[0] !== 'h' ? BASE_URL + '/' + pic : pic;

  return link ? (
    <Link to={link}>
      <IconStyle className='material-symbols-outlined'>{text}</IconStyle>
    </Link>
  ) : (
    <IconStyle onClick={clickHandler} className='material-symbols-outlined'>
      {imageUrl ? <img className='user-profile' src={imageUrl} alt={'user profile'} /> : text}
    </IconStyle>
  );
}

const IconStyle = styled(DefaultStyle)`
  width: 50px;
  aspect-ratio: 1;
  font-size: 200%;
  font-weight: bold;
  overflow: hidden;
  .user-profile {
    /* height: 30px; */
    height: 100%;
    width: 100%;
    /* position: absolute;
    top: 6px; */
    transform: none;
  }
`;
