import  Axios  from 'axios';
import { CART_EMPTY } from '../constants/cartConstant.js';
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAIL_FAIL, ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS } from "../constants/orderConstants"

export const createOrder = (order) => async (dispatch, getState) =>{
    dispatch({
        type: ORDER_CREATE_REQUEST, payload: order
    });
    try{
        const {
            userSignin: { userInfo },
          } = getState(); // getState hamu redux store akat lo daeni lawe userSignin wardagren la userSigninesh userInfoi wardagren
       
          const { data } = await Axios.post('/api/orders', order, { //lera data message u ordere hargrtya
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                  }, 
                  // we need to fill userinfo from redux store
            
        });
        dispatch({
             type: ORDER_CREATE_SUCCESS, payload: data.order
             });
        dispatch({
             type: CART_EMPTY
             });
        localStorage.removeItem('cartItems');
    
    }catch(error){
dispatch({
    type: ORDER_CREATE_FAIL, payload:  error.response && error.response.data.message? error.response.data.message : error.message,
})
    }
}

export const detailsOrder = (orderId) => async (dispatch, getState) =>{
dispatch({
    type: ORDER_DETAIL_REQUEST, payload: orderId
});
const { userSignin: { userInfo } } = getState(); 
try{
    const { data } = await Axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data });

} catch(error){
    const message=  error.response && error.response.data.message? error.response.data.message : error.message;
    dispatch({
        type: ORDER_DETAIL_FAIL, payload: message
    });
}

}

export const payOrder = (order, paymentResult) => async (dispatch, getState) =>{
dispatch ({
    type: ORDER_PAY_REQUEST, payload: {order, paymentResult}
});
const {userSignin:{userInfo},} = getState();
try{
const {data} = await Axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
    headers:{
        Authorization: `Berear ${userInfo.token}`
    },
})
dispatch({
    type: ORDER_PAY_SUCCESS, payload: data
})
}catch(error){
    const message=  error.response && error.response.data.message? error.response.data.message : error.message;
    dispatch({
        type: ORDER_PAY_FAIL, payload: message
    });
}

}