import  { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketService from "./ticketService";

const initialState = {
    tickets: [],
    ticket: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const createTciket = createAsyncThunk(
    "tickets/create",
    async (ticketData, thunkAPI) => {
      try {
        return await ticketService.createTicket(ticketData);
      } catch (err) {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "Something went wrong";
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

export const ticketSlice = createSlice({
    name: "ticket",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
    
    }
})

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;
