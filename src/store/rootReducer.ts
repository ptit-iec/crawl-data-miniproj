import postReducer from './modules/post';
import tagReducer from './modules/Tag';
const rootReducer = {
    post: postReducer,
    tag : tagReducer,
};

export default rootReducer;
