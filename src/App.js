import './App.css';
import { Navbar, Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { useState, lazy, Suspense } from 'react';
import data from './data.js';
import { Route, Routes, Link, useNavigate, Outlet } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

/** 필요할때 import 해달라고 요청하는 방법
 * 1. lazy 사용
 * 2. import 할 때 프로미스를 반환하는 형태로 사용해야 한다.
 * 3. 프로미스는 then 으로 사용할 수 있다.
 */
let Detail = lazy(() => import('./pages/Detail.js'));
let Cart = lazy(() => import('./pages/Cart.js'));
let About = lazy(() => import('./pages/About.js'));

function App() {
  let [items, setItems] = useState(data);

  const addItems = (newItems) => {
    setItems([...items, ...newItems]);
  };

  /** 리엑트쿼리 사용법
   * 1. useQuery 사용
   * 2. 첫번째 파라미터는 쿼리키
   * 3. 두번째 파라미터는 콜백함수
   * 4. 콜백함수는 비동기 함수를 반환해야 한다.
   * 5. 비동기 함수는 프로미스를 반환해야 한다.
   */
  let result = useQuery(
    'userName',
    () => {
      return axios
        .get('https://codingapple1.github.io/userdata.json')
        .then((a) => {
          console.log('요청보내는중');
          return a.data;
        })
        .catch((error) => {
          console.log('요청 실패');
        });
    },
    { staleTime: 2000 } //refetch 간격 조정 가능
  );
  return (
    <div className="App">
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">클론?코딩 하는 중</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="">
              {result.isLoading ? '로딩중...' : result.data.name}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="main-bg"></div>

      <Link to="/">홈</Link>
      <Link to="/detail">상세</Link>
      {/* Lazy 임포트 사용해서 불러올 경우 자식 컴포넌트를 불러오는 코드를 자식 컴포넌트 안에 넣어야 한다. */}
      <Suspense fallback={<div>로딩중...</div>}>
        <Routes>
          <Route
            path="/"
            element={<Items items={items} addItems={addItems} />}
          />

          <Route path="/detail/:id" element={<Detail items={items} />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/about" element={<About />}>
            {/* Nested Routes
          1. Route를 중첩해서 사용할 수 있다.
          2. 중첩된 Route는 부모 Route의 파라미터를 사용할 수 있다.
          3. 중첩된 Route는 부모 Route의 element를 사용할 수 있다.
          4. Nested Routes에는 /about/member 등으로 접속할 수 있다.
          5./about/member의 element내용을 보여주고 싶은 경우 부모 Routes에 Outlet(보여줄 곳)을 사용한다.
          */}
            <Route path="member" element={<div>Nested Routes 테스트</div>} />
          </Route>

          {/* 404페이지 만드는 방법 */}
          <Route path="*" element={<div>없는 페이지 컴포넌트</div>} />
        </Routes>
      </Suspense>
    </div>
  );
}

function Items({ items, addItems }) {
  return (
    <div>
      <Container>
        <Row>
          {items.map((item, i) => {
            return <Card item={item} i={i} key={i} />;
          })}
        </Row>
      </Container>
      {/* ajax 요청 시 데이터 받아오기
        1. XMLHttpRequest 사용
        2. fetch 사용
        3. axios 사용
        */}
      <Button
        variant="success"
        onClick={() =>
          axios
            .get('https://codingapple1.github.io/shop/data2.json')
            .then((result) => {
              console.log(result.data);
              // 불러온 데이터로 html 생성하는 방법
              // 불러온 데이터 형태 확인 console.log(props.items);
              let copy = [...items, ...result.data];
              console.log(copy); //데이터 추가된 것 확인
              addItems(result.data);
            })
            .catch((error) => {
              console.log('데이터 불러오는데에 실패함');
            })
        }
      >
        더보기
      </Button>
    </div>
  );
}
/** axios 요청 여러개 받는 방법
 * Promise.all([axios.get(), axios.get()]).then((result) => {
 *  console.log(result);
 * })
 */

function Card(props) {
  let navigate = useNavigate();
  return (
    <Col
      key={props.item.index}
      onClick={() => navigate(`/detail/${props.item.index}`)}
    >
      <div>
        <img
          src={props.item.picture}
          alt={props.item.name}
          style={{ width: '150px', height: '150px' }}
        />
        <h4>{props.item.name}</h4>
        <p>{props.item.index}</p>
        <p>{props.item.money}</p>
      </div>
    </Col>
  );
}

export default App;
