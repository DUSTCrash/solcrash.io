import { createSlice } from "@reduxjs/toolkit";

import "../../../config";

export const slice = createSlice({

  name: "global_info",

  initialState: {
    global_loading: false,
    screen_width: null,
    crash_loading: false,
    leaderboards_loading: false,
    statistics_loading: false,
    online: 0,
    error: null,
    token: null,
    discordId: null,
    currency: "sol",
    name: null,
    is_account_modal_opened: false,
    account_stats_loading: false,
    cashier_history_loading: false,
    rebate_loading: false,
    is_pictures_modal_opened: false,
    pfps_loading: false,
    game: null,
    leaderboards: null,
    statistics: null
  },

  reducers: {
    setGlobalLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.global_loading = newLoadingState;
    },
    setScreenWidth: (state, action) => {
      const newWidthState = action.payload;
      state.screen_width = newWidthState;
    },
    setCrashLoading: (state, action) => {
        const newLoadingState = action.payload;
        state.crash_loading = newLoadingState;
    },
    setLeaderboardsLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.leaderboards_loading = newLoadingState;
    },
    setStatisticsLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.statistics_loading = newLoadingState;
    },
    setOnline: (state, action) => {
      const newOnlineState = action.payload;
      state.online = newOnlineState;
    },
    setError: (state, action) => {
      const newErrorState = action.payload;
      state.error = newErrorState;
    },
    setToken: (state, action) => {
      const newTokenState = action.payload;
      state.token = newTokenState;
      localStorage.setItem("token", newTokenState);
    },
    setDiscordId: (state, action) => {
      const newDiscordIdState = action.payload;
      state.discordId = newDiscordIdState;
    },
    setCurrency: (state, action) => {
      const newCurrencyState = action.payload;
      state.currency = newCurrencyState;
    },
    setName: (state, action) => {
      const newNameState = action.payload;
      state.name = newNameState;
    },
    setAccountModalOpened: (state, action) => {
      const newOpenedState = action.payload;
      state.is_account_modal_opened = newOpenedState;
    },
    setAccountStatsLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.account_stats_loading = newLoadingState;
    },
    setCashierHistoryLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.cashier_history_loading = newLoadingState;
    },
    setRebateLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.rebate_loading = newLoadingState;
    },
    setPicturesModalOpened: (state, action) => {
      const newOpenedState = action.payload;
      state.is_pictures_modal_opened = newOpenedState;
    },
    setPfpsLoading: (state, action) => {
      const newLoadingState = action.payload;
      state.pfps_loading = newLoadingState;
    },
    setGame: (state, action) => {
      const newGameState = action.payload;
      state.game = newGameState;
      global.config.storedGame = newGameState;
    },
    setLeaderboards: (state, action) => {
      const newLeaderboardsState = action.payload;
      state.leaderboards = newLeaderboardsState;
    },
    setStatistics: (state, action) => {
      const newStatisticsState = action.payload;
      state.statistics = newStatisticsState;
    }
  }

});

export const {
  setGlobalLoading,
  setScreenWidth,
  setCrashLoading,
  setLeaderboardsLoading,
  setStatisticsLoading,
  setOnline,
  setError,
  setToken,
  setDiscordId,
  setCurrency,
  setName,
  setAccountModalOpened,
  setAccountStatsLoading,
  setCashierHistoryLoading,
  setRebateLoading,
  setPicturesModalOpened,
  setPfpsLoading,
  setGame,
  setLeaderboards,
  setStatistics
} = slice.actions;

export default slice.reducer;