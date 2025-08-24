import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export type Gender = 'male' | 'female'


export interface Submission {
  id: string
  name: string
  age: number
  email: string
  password: string
  gender: Gender
  acceptedTC: boolean
  pictureBase64?: string
  country: string
  source: 'uncontrolled' | 'react-hook-form'
  createdAt: number
}


export interface SubmissionsState {
  items: Submission[]
  lastNewId?: string
}


const initialState: SubmissionsState = { items: [] }


const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: {
      prepare(data: Omit<Submission, 'id' | 'createdAt'>) {
        return { payload: { ...data, id: nanoid(), createdAt: Date.now() } }
      },
      reducer(state, action: PayloadAction<Submission>) {
        state.items.unshift(action.payload)
        state.lastNewId = action.payload.id
      }
    },
    clearHighlight(state) {
      state.lastNewId = undefined
    }
  }
})


export const { addSubmission, clearHighlight } = submissionsSlice.actions
export default submissionsSlice.reducer