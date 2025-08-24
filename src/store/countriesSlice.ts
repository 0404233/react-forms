import { createSlice } from '@reduxjs/toolkit'
import world from 'world-countries'


export interface Country { name: string }


const countryNames: string[] = world
.map((c) => c.name?.common as string)
.filter(Boolean)
.sort((a: string, b: string) => a.localeCompare(b))


const countriesSlice = createSlice({
name: 'countries',
initialState: countryNames as string[],
reducers: {}
})


export default countriesSlice.reducer