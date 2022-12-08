import { configureStore } from "@reduxjs/toolkit"
import state from "./redux.state.slice"

export const reduxStore = configureStore({
  reducer: { state },
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch
export const globalDispatch = reduxStore.dispatch
