import {v4 as uuidv4} from "uuid";
import {addToast as add, removeToast} from "../store/toastSlice";
import {useDispatch} from "react-redux";

const useToast = () => {

    const dispatch = useDispatch();

    const addToast = (toast) => {
        const id = uuidv4();
        const toastWithId = {
            ...toast,
            id
        }
        dispatch(add(toastWithId));
        setTimeout(() => {
            deleteToast(id)
        }, 5000);
    }

    const deleteToast = (id) => {
        dispatch(removeToast(id));
    }

    // 원하는 것을 return 배열으로 하면 쓸때 순서 지켜야하고 원하는 이름으로, 객체로 하면 이름 지켜야하고 순서 상관 없음
    return{
        addToast,
        deleteToast
    }
}

export default useToast;