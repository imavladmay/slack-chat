/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import fetchDataApi from '../../api/fetchData';

const initialState = {
  channels: [],
  currentChannelId: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataApi.fulfilled, (state, { payload }) => {
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
      });
  },
});

export const { addChannel } = channelsSlice.actions;
export default channelsSlice.reducer;