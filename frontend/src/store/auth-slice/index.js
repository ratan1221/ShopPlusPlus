import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null
}

export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,
            formData,
            {
                withCredentials: true,
            }
        );
        return response.data;
    }
);

export const loginUser = createAsyncThunk('/auth/login',
    async (formData) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,
            formData,
            {
                withCredentials: true,
            }
        );
        return response.data;
    }
);
//If using cookie based storage use below as on Render.com its not working so trying second way below this function

// export const checkAuth = createAsyncThunk('/auth/checkauth', async () => {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//         {
//             withCredentials: true,
//             headers: {
//                 "Cache-Control":
//                     "no-store, no-cache, must-revalidate, proxy-revalidate",
//             },
//         }
//     );

//     return response.data;
// }
// );

//below is the approach used for Render.com , if running locally then use above function ...Auth-controller.js| auth-slice-index.js | app.jsx changes present so remember to update it as well if running locally.

export const checkAuth = createAsyncThunk('/auth/checkauth', async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
        }
    );

    return response.data;
}
);

export const logoutUser = createAsyncThunk('/auth/logout',
    async () => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {},
            {
                withCredentials: true,
            }
        );
        return response.data;
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => { },
        resetTokenAndCredentials: (state) => {
            state.isAuthenticated = false,
                state.user = null,
                state.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            }).addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = false;

            }).addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;

            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;
                state.token = action.payload.token;
                sessionStorage.setItem('token', JSON.stringify(action.payload.token));
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;

            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log(action) //  to check if we're getting the payload or not
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;

            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;

            }).addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;

            })
    }
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;