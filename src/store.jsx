import { configureStore } from "@reduxjs/toolkit";
import registerUser from "./Slices/registerSlice";
import themeSlice from "./Slices/themeSlice"


const store = configureStore({
    reducer: {
        user: registerUser,
        theme: themeSlice
    },
})

export default store;