// src/store/userSlice.ts
import { loginAPI } from "../../apis/user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginFormValues, AuthorizationResponse, UserProfileResponse } from "../../types";
import { getToken, setToken as _setToken, removeToken } from "../../utils/token";
import { http } from "../../utils/request";
import { AxiosError } from "axios";

/**
 * Utility function to check if an error is an AxiosError.
 */
function isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
}

// Define the initial state interface
interface UserState {
    token: string;
    userInfo: UserProfileResponse | null;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: UserState = {
    token: getToken() || '',
    userInfo: null,
    loading: false,
    error: null,
};

// Thunk for login
export const fetchLogin = createAsyncThunk<
    AuthorizationResponse,     // Return type
    LoginFormValues,           // Argument type
    { rejectValue: string }    // ThunkAPI config
>(
    'user/fetchLogin',
    async (loginForm: LoginFormValues, { rejectWithValue }) => {
        try {
            const res: any = await loginAPI(loginForm);

            return res;
        } catch (error: any) {
            console.error('Login failed:', error);
            if (isAxiosError(error) && error) {
                return rejectWithValue("登录失败1");
            }
            return rejectWithValue('登录失败');
        }
    }
);

// Thunk for fetching user info
export const fetchUserInfo = createAsyncThunk<
    UserProfileResponse,        // Return type
    void,                       // Argument type
    { rejectValue: string }     // ThunkAPI config
>(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const res= await http.get <UserProfileResponse> ('/user/profile');
            return res.data;
        } catch (error: any) {
            console.error('Fetch user info failed:', error);
            if (isAxiosError(error)) {
                return rejectWithValue('获取用户信息失败1');
            }
            return rejectWithValue('获取用户信息失败');
        }
    }
);

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            _setToken(action.payload);
        },
        setUserInfo(state, action: PayloadAction<UserProfileResponse>) {
            state.userInfo = action.payload;
        },
        clearUserInfo(state) {
            state.token = '';
            state.userInfo = null;
            removeToken();
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchLogin
            .addCase(fetchLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLogin.fulfilled, (state, action: PayloadAction<AuthorizationResponse>) => {
                state.loading = false;
                state.token = action.payload.token;
                // Optionally, store refresh_token
                _setToken(action.payload.token);
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || '登录失败';
            })
            // Handle fetchUserInfo
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserProfileResponse>) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || '获取用户信息失败';
            });
    },
});

export const { setToken, setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
