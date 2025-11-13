import postReducer from './modules/post';
import tagReducer from './modules/Tag';
import userInfoReducer from './modules/user';
import authReducer from './modules/auth'
const rootReducer = {
    post: postReducer,
    tag : tagReducer,
    userInfo : userInfoReducer,
    auth : authReducer,
};

export default rootReducer;
