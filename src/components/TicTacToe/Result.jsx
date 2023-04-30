import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
// import DefaultStyle from '../../DefaultStyle';
import ResetBtn from './ResetBtn';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivet';
import useRefreshToken from '../../hooks/useRefreshToken';

export default function Result({ res, resetLevel, resetBoard, typeGame, isOnline, level = '' }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    console.log(typeGame, isOnline);
    const matchingGameInit = async () => {
        try {
            let url = `/statistics/?typeGame=${typeGame}&isOnline=${isOnline}&level=${level.toLowerCase()}&gameRes=${res}`;
            const response = await axiosPrivate.put(url, {
                signal: controller.signal,
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const refreshToken = async () => {
            await refresh();
        };
        console.log('auth: ', auth);
        !auth?.name ? refreshToken() : matchingGameInit();
    }, [auth]);

    useEffect(() => {
        document.body.style.aspectRatio = '1';
        document.body.style.background = 'repeating-radial-gradient(var(--blue), #78b5e4, var(--blue) 25%)';

        return () => {
            document.body.style.aspectRatio = null;
            document.body.style.background = 'var(--blue)';
        };
    }, []);

    return (
        <ResContainer>
            <ResTxt>{res === 'tie' ? res : `you ${res}!`}</ResTxt>
            <ResBtnContainer>
                {resetLevel && !isOnline && <ResetBtn text={'change level'} resetFunc={resetLevel} />}
                <ResetBtn text={'play again'} resetFunc={resetBoard} />
            </ResBtnContainer>
            <ResIcons>
                <div translate='no'>X</div>
                <div translate='no'>O</div>
                <div className='material-symbols-outlined' translate='no'>
                    {res === 'win' ? 'Star' : res === 'lose' ? 'Cancel' : 'Menu'}
                </div>
                <div className='material-symbols-outlined' translate='no'>
                    {res === 'win' ? 'Thumb_Up' : res === 'lose' ? 'Thumb_Down' : 'Thumb_up'}
                </div>
                <div className='material-symbols-outlined' translate='no'>
                    {res === 'win' ? 'Mood' : res === 'lose' ? 'mood_bad' : 'sentiment_neutral'}
                </div>
                <div translate='no'>X</div>
                <div translate='no'>O</div>
                <div className='material-symbols-outlined' translate='no'>
                    {res === 'win' ? 'Star' : res === 'lose' ? 'Cancel' : 'Menu'}
                </div>
                <div className='material-symbols-outlined' translate='no'>
                    {res === 'win' ? 'Thumb_Up' : 'Thumb_Down'}
                </div>
                <div className='material-symbols-outlined' translate='no'>
                    {res === 'win' ? 'Mood' : res === 'lose' ? 'mood_bad' : 'sentiment_neutral'}
                </div>
                <div translate='no'>X</div>
                <div translate='no'>O</div>
            </ResIcons>
        </ResContainer>
    );
}

let iconsLocations4BigScrn = [
    `
   transform: translate(-500px, -400px) rotate(10deg)`,
    `transform: translate(100px, -410px) rotate(10deg)`,
    `transform: translate(-600px, -210px) rotate(-10deg)`,
    `transform: translate(-550px, -10px) rotate(10deg)`,
    `transform: translate(-50px, -50px) rotate(-10deg)`,
    `transform: translate(600px, -250px) rotate(-10deg)`,
    `transform: translate(400px, 20px) rotate(10deg)`,
    `transform: translate(390px, -440px) rotate(10deg)`,
    `transform: translate(500px, -100px) rotate(10deg)`,
    `transform: translate(-250px, -450px) rotate(10deg)`,
    `transform: translate(100px, 100px) rotate(10deg)`,
    `transform: translate(-250px, 50px) rotate(10deg)`,
];

let iconsLocations4SmallScrn = [
    `
   transform: translate(-45vw, -75vh) rotate(10deg)`,
    `transform: translate(-43vw, 0) rotate(10deg)`,
    `transform: translate(-15vw, -75vh) rotate(10deg)`,
    `transform: translate(-49vw, -50vh) rotate(-10deg)`,
    `transform: translate(25vw, -75vh) rotate(-10deg)`,
    `transform: translate(30vw, -50vh) rotate(-10deg)`,
    `transform: translate(-10vw, -10vh) rotate(10deg)`,
    `transform: translate(25vw, 2vh) rotate(10deg)`,
    `transform: translate(30vw, -30vh) rotate(10deg)`,
    `transform: translate(-5vw, 2vh) rotate(10deg)`,
    `transform: translate(-45vw, -30vh) rotate(10deg)`,
    `transform: translate(-10vw, -50vh) rotate(10deg)`,
];

const ResAnim = keyframes`
  from { bottom: -70vh; }
  to { bottom: 0; }
`;
const ResContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
    animation: ${ResAnim} 2s ease alternate;
    font-size: 50px;
    height: 70svh;
    width: 100svw;
    @media (max-device-width: 425px) {
        margin-top: 9vh;
    }
`;
const ResTxt = styled.div`
    font-size: 20vw;
    color: var(--yellow);
    -webkit-text-stroke: var(--pink) 0.02em;
    text-align: center;
    line-height: 1em;
    @media (max-device-width: 768px) {
        font-size: 17vh;
        &:lang(he) {
            font-size: 15vh;
        }
    }
`;
const ResBtnContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 80%;

    @media (max-device-width: 425px) {
        margin-top: 2vh;
    }
    @media (max-device-width: 768px) {
        flex-wrap: wrap;
        width: 90%;
        height: 20%;
    }
`;
// const ResetBtns = styled(DefaultStyle)`
// 	@media (max-device-width: 768px) {
// 		min-width: 80%;
// 		flex: 2;
// 		font-size: 12vw;
// 		height: fit-content;
// 		margin-top: 1em;
// 		padding: 0.2em 0;
// 		&:lang(he) {
// 			font-size: 10vw;
// 		}
// 	}
// `;
const ResIcons = styled.div`
    color: var(--white);
    z-index: -1;
    & .material-symbols-outlined {
        font-size: 100%;
    }
    & > * {
        position: absolute;
    }
    @media (min-device-width: 1024px) {
        ${createIconsLoations(iconsLocations4BigScrn)};
    }
    @media (max-device-width: 1024px) {
        ${createIconsLoations(iconsLocations4SmallScrn)};
    }
`;

function createIconsLoations(arr) {
    let str = ``;
    for (let index = 0; index < arr.length; index++) {
        str += `
      & div:nth-child(${index + 1}) {
        ${arr[index]};
      }
    `;
    }
    return str;
}
