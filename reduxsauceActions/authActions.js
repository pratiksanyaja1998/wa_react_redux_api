const axios = require('axios')
const AuthActions = require('../reduxsauce/authRedux')
const CommonActions = require('../reduxsauce/commonRedux')

 const newRegisterAccount =
  ({data, email, password, phone, first_name, last_name}, navigation) =>
  async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    try {
      const response = await axios
        .post('/user/register', {
          email,
          phone,
          password,
          first_name,
          last_name,
          business: getState().config.businessId,

          type: 'client',
        })
        .then((response) => response.data);
      console.log('new Registration :: ', response);
      if (!response.is_active) {
        navigation.navigate('verify-otp', {user: response});
      } else {
        dispatch(AuthActions.setUser(response));
      }
    } catch (e) {
      console.log(e.response);
      // console.log(typeof e.response.data == 'object');
      // console.log(e.response.data[Object.keys(e.response.data)[0]]);

      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: e.response.message,
        }),
      );
    }

    dispatch(CommonActions.setLoading(false));
  };

const emailPassWOrdLogin =
  (username, password, navigation) => async (dispatch, getState) => {
    const {config, common} = getState();
    dispatch(CommonActions.setLoading(true));
    // try {
    //   const response =
    axios.defaults.headers.common['Authorization'] = '';
    delete axios.defaults.headers.common['Authorization'];
    await axios
      .post('/user/login', {
        username,
        password,
        business: getState().config.businessId,
      })
      .then((response) => {
        console.log('EmailPasswordLogin', response.data);
        if (['local', 'development'].includes(config.ENV)) {
          if (!response.data.approved) {
            dispatch(CommonActions.setLoading(false));
            return navigation.navigate('pending-approvement');
          }
        }
        if (response.data.is_active) {
          dispatch(AuthActions.setUser(response.data));
          dispatch(CommonActions.setLoading(false));
          if (common.loginFrom) {
            navigation.replace(common.loginFrom);
            dispatch(CommonActions.setLoginFrom(null));
            return;
          }
          !config?.theme?.isLoginRequired &&
            (config?.theme?.showTabBar
              ? navigation.replace('app')
              : navigation.replace('home'));
        } else {
          dispatch(CommonActions.setLoading(false));
          navigation.navigate('verify-otp', {
            user: {
              ...response?.data,
              email: username,
              business: getState().config?.businessId,
            },
          });
        }
      })
      // navigation.navigate('Home');
      // }
      .catch((e) => {
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: e.response.message,
          }),
        );
        dispatch(CommonActions.setLoading(false));
      });
  };

const verifyOTP = (data, navigation) => async (dispatch, getState) => {
  const {config, common} = getState();
  dispatch(CommonActions.setLoading(true));
  console.log('data', data);
  const body = {
    otp: data.otp,
    user: data.id,
  };
  try {
    const response = await axios.post('/user/verify-otp', body);
    console.log('response', response);
    dispatch(AuthActions.setUser(response.data));
    dispatch(CommonActions.setLoading(false));
    if (common.loginFrom) {
      navigation.replace(common.loginFrom);
      dispatch(CommonActions.setLoginFrom(null));
      return;
    }

    !config?.theme?.isLoginRequired &&
      (config?.theme?.showTabBar
        ? navigation.replace('app')
        : navigation.replace('home'));
  } catch (error) {
    console.log('error', error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message || 'Invalid OTP try again.',
      }),
    );
    dispatch(CommonActions.setLoading(false));
  }
};

 const verifyCode = (data, navigation) => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  try {
    // const response = await verifyCodeApi(data);
    // if (response.memberId) {
    //   dispatch(AuthActions.setUser(response));
    //   navigation.navigate('SetNewPin', {
    //     user: response,
    //     onDone: async () => {
    //       await dispatch(setLoginAndProfile(response));
    //       navigation.navigate('Home');
    //     },
    //   });
    // } else {
    //   dispatch(
    //     CommonActions.setAlert({
    //       visible: true,
    //       content: strings('message.failToVerify'),
    //     }),
    //   );
    // }
  } catch ({message}) {
    dispatch(CommonActions.setAlert({visible: true, content: message}));
  }
  dispatch(CommonActions.setLoading(false));
};

 const logout = (navigation,platform) => async (dispatch, getState) => {
  const {config} = getState;
console.log('platform-------->>>>>>',platform);
  dispatch(CommonActions.setLoading(true));
  await axios
    .get('/user/logout/')
    .then(async (response) => {
      console.log('response', response);
      axios.defaults.headers.common['Authorization'] = '';
      delete axios.defaults.headers.common['Authorization'];
      await dispatch(AuthActions.logout());
      await dispatch(
        CommonActions.setAlert({
          visible: true,
          content: "Logout successfully",
        }),
      );
      !config?.theme?.isLoginRequired &&
        (platform == 'web'
          ? await window.location.replace('/')
          : await navigation.goBack());

      dispatch(CommonActions.setLoading(false));
    })
    .catch((error) => {
      console.log('error->', error);
      dispatch(CommonActions.setLoading(false));
      CommonActions.setAlert({
        visible: true,
        content: error?.response?.message || 'Something went wrong.',
      });
    });
};

 const resendVerificationCode = (phone) => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  try {
    // const response = await resendVerificationCodeApi(phone);
    // if (response) {
    //   dispatch(
    //     CommonActions.setAlert({
    //       visible: true,
    //       content: strings('message.resendSuccess'),
    //     }),
    //   );
    // }
  } catch ({message}) {
    dispatch(CommonActions.setAlert({visible: true, content: message}));
  }
  dispatch(CommonActions.setLoading(false));
};

 const createPickupLocation = (data) => async (dispatch, getState) => {};

 const updateAddress = () => async (dispatch, getState) => {};

 const addressList = () => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .get('/user/address/list')
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      console.log('response addressList -->', response.data);
      dispatch(AuthActions.setAddress(response.data));
    })
    .catch((error) => {
      console.log('address List', error);
      dispatch(CommonActions.setLoading(false));
    });
};

 const deleteAddress = (id) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .delete('/user/address/delete/' + id)
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      console.log('response addressList -->', response.data);
      dispatch(addressList());
    })
    .catch((error) => {
      console.log('address List', error);
      dispatch(CommonActions.setLoading(false));
    });
};
 const pickupLocationList = () => async (dispatch) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .get('/delivery/pickup/location/list')
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      console.log('response PickupLocationList -------------->', response.data);
      dispatch(AuthActions.setPickupLocation(response.data));
    })
    .catch((error) => {
      console.log('PickupLocation List', error);
      dispatch(CommonActions.setLoading(false));
    });
};

 const deletePickupLocation = (id) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  axios
    .delete('/delivery/pickup/location/delete/' + id)
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      console.log('response PickupLocationList -->', response.data);
      dispatch(pickupLocationList());
    })
    .catch((error) => {
      console.log('PickupLocation List', error);
      dispatch(CommonActions.setLoading(false));
    });
};

 const updateUserData = (data) => async (dispatch, getState) => {
  const {auth} = getState();
  dispatch(AuthActions.setUser({...auth?.user, setting: data}));
};

module.exports = {newRegisterAccount,emailPassWOrdLogin,verifyOTP,verifyCode,logout,resendVerificationCode,createPickupLocation,updateAddress,addressList,deleteAddress,pickupLocationList,deletePickupLocation,updateUserData}