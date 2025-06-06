import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
    selectedYear: moment().year(),
    selectedMonth: moment().month(),
    selectedDay: moment().date(),
};

const timelineSelectorSlice = createSlice({
    name: 'timelineSelector',
    initialState,
    reducers: {
        setSelectedYear(state, action) {
            state.selectedYear = action.payload
            state.selectedMonth = null
            state.selectedDay = null
        },
        setSelectedMonth(state, action) {
            state.selectedMonth = action.payload
            state.selectedDay = null
        },
        setSelectedDay(state, action) {
            state.selectedDay = action.payload
        },
        setCurrentDate() {
            return initialState
        }
    },
})

export const { setSelectedYear, setSelectedMonth, setSelectedDay, setCurrentDate } = timelineSelectorSlice.actions
export default timelineSelectorSlice.reducer