import { configureStore, createSlice } from '@reduxjs/toolkit';
import { user } from './store/userSlice';

//useState 같은 역할의 createSlice
let stock = createSlice({
  name: 'stock',
  initialState: [10, 11, 12],
});
let cart = createSlice({
  name: 'cart',
  initialState: [
    { id: 7, name: '안녕1', count: 3 },
    { id: 8, name: '안녕2', count: 2 },
    { id: 9, name: '안녕3', count: 1 },
  ],
  reducers: {
    addCart: (state, action) => {
      const { id, amount } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item) {
        item.count += amount;
      }
    },
    addItem: (state, action) => {
      state.push(action.payload);
      console.log(state);
    },
  },
});

/**Redux의 state 변경방법
 * 1. state 수정하는 요청 만들기 (reducers)
 * 2. reducer 내부의 함수를 내보내기
 * 2. 요청해서 내부의 함수 실행해 달라고 store.js에 요청하기 (dispatch)
 * 3. store.js가 함수를 실행해서 state 변경하기
 */

//user.actions.changeName 함수를 내보내기
export let { addCart, addItem } = cart.actions;

export default configureStore({
  reducer: {
    user: user.reducer,
    stock: stock.reducer,
    cart: cart.reducer,
  },
});
