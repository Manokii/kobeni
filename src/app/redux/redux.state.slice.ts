import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { StatePlayer } from "lib/state"
import type { ValMap } from "types/map"

export interface State {
  matchId: string
  red: StatePlayer[]
  blue: StatePlayer[]
  map: ValMap | null
}

const initialState: State = {
  blue: [],
  red: [],
  matchId: "",
  map: null,
}

type Action = PayloadAction<State>
export const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    set: (state, action: Action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { set: setState } = stateSlice.actions
export default stateSlice.reducer
