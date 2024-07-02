import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from 'react-redux';
import { addCart } from '../store.js';
import { changeName, addAge } from '../store/userSlice';
import { useState, memo, useMemo } from 'react';

/**필요할 때만 재랜더링 할 수 있게 하는 memo
 * Cart 컴포넌트가 재랜더링 될때마다 Child 컴포넌트도 자동으로 재랜더링 되는 것을 막음
 * 무거운 작업을 하는 컴포넌트는 memo로 감싸주는 것이 좋음
 * memo는 props가 변경될 때만 재렌더링 해줌
 */
let Child = memo(function (props) {
  console.log('재렌더링됨');
  return <div>자식 컴포넌트 {props.count}</div>;
});

/** useMemo
 * - 부모 컴포넌트에서 밖에 있는 함수를 불러와서 작동시킬때, 함수의 복잡성이 높아지면 자식 컴포넌트들도 모두 재랜더링 되는 문제점이 있음
 * - 이럴때 useMemo를 사용하면 됨
 * - 자식 컴포넌트들이 모두 재랜더링 되는 것을 막아줌
 * - 들어있는 컴포넌트가 첫 랜더링 될때 1회만 실행됨
 * - 두번째 랜더링 될때부터는 메모이제이션된 값을 반환함
 */

function heavyFunction() {
  console.log('함수 실행됨');
  return 1 + 2;
}

function Cart() {
  let result = useMemo(() => {
    return heavyFunction();
  }, []);

  /**Redux를 사용하면 컴포넌트들이 props 없이 state 공유가능
   * 1. redux store.js 파일에 모든 state 보관 가능
   * 2. 컴포넌트들이 각각 state 가져오기
   * 3. useSelector로 store에 있는 state 가져오기
   *  */
  let [count, setCount] = useState(0);
  let dispatch = useDispatch();
  let user = useSelector((state) => {
    return state.user;
  });

  let stock = useSelector((state) => state.stock);
  console.log(user);
  console.log(stock);
  //array 형태
  let cart = useSelector((state) => state.cart);
  console.log(cart);
  return (
    <div>
      <Child count={count} />
      {/* 버튼을 누르면 재렌더링 될 것임
      자식 컴포넌트도 재렌더링 될 것임
      다회의 재랜더링은 지연시간이 만들어질 수 있기 때문에 memo, useMemo 사용해야 함*/}
      <button onClick={() => setCount(count + 1)}>버튼</button>
      <h2>
        {user.name} {user.age}
      </h2>
      <button
        onClick={() => {
          dispatch(addAge(11));
        }}
      >
        나이 올리기
      </button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>상품명</th>
            <th>수량</th>
            <th>변경하기</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((cart, i) => {
            return (
              <tr key={cart.id}>
                <td>{cart.id}</td>
                <td>{cart.name}</td>
                <td>
                  <button
                    onClick={() => {
                      dispatch(addCart({ id: cart.id, amount: -1 }));
                    }}
                  >
                    -
                  </button>
                  {cart.count}
                  <button
                    onClick={() => {
                      dispatch(addCart({ id: cart.id, amount: 1 }));
                    }}
                  >
                    +
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      dispatch(changeName(cart.name));
                    }}
                  >
                    변경
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Cart;
