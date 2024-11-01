import { configureStore } from "@reduxjs/toolkit";
import { registerUser } from "./Slices/registerSlice";


const store = configureStore({
    reducer: {
        user: registerUser
    },
})

export default store;