import { createSlice } from '@reduxjs/toolkit';

export const user = createSlice({
  name: 'user',
  initialState: { name: 'kim', age: 20 },
  reducers: {
    changeName: (state) => {
      state.name = 'park';
    },
    addAge: (state, action) => {
      state.age += action.payload;
    },
  },
});

export let { changeName, addAge } = user.actions;
