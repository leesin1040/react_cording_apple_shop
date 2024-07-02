import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store';
import Nav from 'react-bootstrap/Nav';

/*
1. styled components는 다른 js 파일에 간섭하지 않음
2. styled.htmlTag로 스타일링 할 수 있음
3. CSS파일 작명을 Detail.module.css로 Detail.js에만 적용됨
4. 비슷한 모양의 컴포넌트를 만들려고 하면 가변적인 부분을 적용할 수 있음.(삼항연산자 사용) - 양쪽props에 $을 붙여야함
5. 기존에 있던 스타일들을 상속받아 사용할 수 있음.
6. 중복 스타일은 컴포넌트간 import 해서 사용할 수 있음.
*/

let BlackBtn = styled.button`
  background-color: ${(props) => props.$bg};
  color: ${(props) => (props.$bg === 'black' ? 'white' : 'black')};
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

let NewBtn = styled(BlackBtn)`
  background-color: red;
`;

let WarningBox = styled.div`
  width: 100%;
  height: 50px;
  background-color: #f4cccc;
  border-radius: 5px;
  padding: 10px;
`;

function Detail(props) {
  const { id } = useParams();
  let [switchBox, setSwitchBox] = useState(true);
  let [count, setCount] = useState(0);
  let [tap, setTap] = useState(0);
  let [fade, setFade] = useState('');
  let dispatch = useDispatch();
  const item = props.items.find((item) => item.index === id);
  useEffect(() => {
    let a = setTimeout(() => {
      setFade('after');
    }, 10);
    return () => {
      clearTimeout(a);
      setFade('');
    };
  }, [tap]);
  //useEffect 실행 전에 실행
  useEffect(() => {
    return () => {};
  }, [count]);
  // 컴포넌트가 마운트될 때만 코드 실행
  useEffect(() => {
    if (isNaN(count) === true) {
      alert('숫자만 입력해주세요');
    }
  }, [count]);
  //unmount 시 코드 실행
  useEffect(() => {
    return () => {};
  }, []);
  //현재 상품 아이디를 로컬스토리지에 넣기
  useEffect(() => {
    // 로컬스토리지에서 'watched' 항목을 가져옴
    let getWatch = localStorage.getItem('watched');
    // 가져온 'watched' 항목을 JSON 형식으로 변환
    getWatch = JSON.parse(getWatch);
    // getWatch가 배열이 아닌 경우 빈 배열로 초기화
    if (!Array.isArray(getWatch)) {
      getWatch = [];
    }
    // 현재 아이템의 인덱스를 getWatch 배열에 추가
    getWatch.push(item.index);
    // 배열 내 중복된 값을 제거
    getWatch = Array.from(new Set(getWatch));
    // 로컬스토리지에 'watched' 항목을 JSON 형식으로 저장
    localStorage.setItem('watched', JSON.stringify(getWatch));
  }, [item.index]);
  useEffect(() => {
    /**
     * 마운트, 업데이트시 코드를 실행해줌 - 2번 실행됨
     * 업데이트 = useState 사용할 때 실행됨
     * HTML 렌더링 후에 동작
     */
    let a = setTimeout(() => {
      setSwitchBox(false);
    }, 2000);
    return () => {
      //useEffect 동작 전에 실행됨
      clearTimeout(a);
    };
  }, [switchBox]);

  // 현재 url 파라미터 가져오기

  //find 메서드로 해당 id에 해당하는 상품 찾기
  if (!item) {
    return <div>없는 페이지 컴포넌트</div>;
  }

  return (
    <div className={`before ${fade}`}>
      {switchBox ? <WarningBox>5초 후 할인이 종료됩니다!</WarningBox> : null}

      <img src={item.picture} style={{ width: '300px' }} alt="img1" />
      <h1>{item.index}</h1>
      <h2>{item.name}</h2>
      <p>{item.money}</p>
      <BlackBtn
        $bg="black"
        onClick={() =>
          dispatch(addItem({ id: item.index, name: item.name, count: 1 }))
        }
      >
        장바구니 담기
      </BlackBtn>
      <BlackBtn $bg="gray">장바구니 담기</BlackBtn>
      <NewBtn>장바구니 담기</NewBtn>
      {/* useEffect 활용 : 텍스트를 입력하면 숫자만 입력해주세요 알림창이 뜸 */}
      <input onChange={(e) => setCount(e.target.value)} />
      <Nav variant="tabs" defaultActiveKey="link0">
        <Nav.Item>
          <Nav.Link eventKey="link0" onClick={() => setTap(0)}>
            버튼1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link1" onClick={() => setTap(1)}>
            버튼2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link2" onClick={() => setTap(2)}>
            버튼3
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Tap tap={tap} />
    </div>
  );
}

// props.어쩌구 없이 하는 방법
function Tap({ tap }) {
  /** 기본 if문을 이용한 탭UI
  if (tap === 0) {
    return <div>탭1</div>;
  } else if (tap === 1) {
    return <div>탭2</div>;
  } else if (tap === 2) {
    return <div>탭3</div>;
  }*/
  let [fade, setFade] = useState('');
  useEffect(() => {
    let a = setTimeout(() => {
      setFade('after');
    }, 10);
    return () => {
      clearTimeout(a);
      setFade('');
    };
  }, [tap]);

  //다른 방법
  return (
    //<div className={`before ${fade}`}>
    <div className={'before ' + fade}>
      {[<div>탭1</div>, <div>탭2</div>, <div>탭3</div>][tap]}
    </div>
  );

  /**전환 애니메이션 주는 방법
   * 1. 재생 전 className 만들기
   * 2. 재생 후 className 만들기
   * 3. className에 Transition 적용
   * 4. 원할 때 2번 className 실행
   */
}

export default Detail;
