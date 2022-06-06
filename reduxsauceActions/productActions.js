const axios = require("axios");
const CommonActions = require("../reduxsauce/commonRedux");
const ProductActions = require("../reduxsauce/productRedux");

const getCategories = () => async (dispatch, getState) => {
  const { order, config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    console.log("--categories----");
    const response = await axios
      .get("/products/product-category/list/" + config["businessId"])
      .then((response) => response.data);
    console.log("checking response : ", response);
    if (response.error) {
      dispatch(
        CommonActions.setAlert({ visible: true, content: response.error })
      );
    } else {
      dispatch(
        ProductActions.getCategories({
          categories: response,
        })
      );
    }
  } catch (error) {
    console.log("message", error.response.message);

    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response.message,
      })
    );
  }
  dispatch(CommonActions.setLoading(false));
};

let cancelToken = axios.CancelToken.source();
const getProducts =
  (search = false, category = false, subCategory = false) =>
  async (dispatch, getState) => {
    const {
      auth: { user },
      order,
      config,
    } = getState();

    search || category || subCategory
      ? dispatch(ProductActions.productSearchLoading(true))
      : dispatch(CommonActions.setLoading(true));

    let url = "/products/list/" + config["businessId"];

    if (search) {
      if (url.includes("?")) {
        url += "&search=" + search;
      } else {
        url += "?search=" + search;
      }
    }
    if (category) {
      if (url.includes("?")) {
        url += "&category=" + category;
      } else {
        url += "?category=" + category;
      }
    }
    if (subCategory) {
      if (url.includes("?")) {
        url += "&sub_category=" + subCategory;
      } else {
        url += "?sub_category=" + subCategory;
      }
    }

    if (cancelToken) {
      cancelToken.cancel();
      cancelToken = axios.CancelToken.source();
    }

    try {
      axios
        .get(url, { cancelToken: cancelToken.token })
        .then((response) => {
          console.log("response======================", response);
          dispatch(
            ProductActions.getProducts({
              fetching: false,
              products: response.data,
            })
          );
          dispatch(ProductActions.productSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
          return response.data;
        })
        .catch((error) => {
          console.log("error", error);
          // dispatch(
          //   CommonActions.setAlert({
          //     visible: true,
          //     content: error?.response?.message,
          //   }),
          // );
          dispatch(ProductActions.productSearchLoading(false));
          dispatch(CommonActions.setLoading(false));
        });
    } catch ({ message }) {
      dispatch(CommonActions.setAlert({ visible: true, content: message }));
      dispatch(ProductActions.productSearchLoading(false));
      dispatch(CommonActions.setLoading(false));
    }
  };

  let cancelToken1 = axios.CancelToken.source();
  const getProductsV1 =
    (item) =>
    async (dispatch, getState) => {
      const {
        auth: { user },
        order,
        config,
      } = getState();
  
      item.search || item.category || item.subCategory
        ? dispatch(ProductActions.productSearchLoading(true))
        : dispatch(CommonActions.setLoading(true));
  
      let url = "/products/list/" + config["businessId"];
      if (item.limit) {
        if (url.includes("?")) {
          url += "&limit=" + item.limit;
        } else {
          url += "?limit=" + item.limit;
        }
      }
      if (item.offset) {
        if (url.includes("?")) {
          url += "&offset=" + item.offset;
        } else {
          url += "?offset=" + item.offset;
        }
      }
      if (item.search) {
        if (url.includes("?")) {
          url += "&search=" + item.search;
        } else {
          url += "?search=" + item.search;
        }
      }
      if (item.category) {
        if (url.includes("?")) {
          url += "&category=" + item.category;
        } else {
          url += "?category=" + item.category;
        }
      }
      if (item.subCategory) {
        if (url.includes("?")) {
          url += "&sub_category=" + item.subCategory;
        } else {
          url += "?sub_category=" + item.subCategory;
        }
      }
  
      if (cancelToken) {
        cancelToken.cancel();
        cancelToken = axios.CancelToken.source();
      }
  
      try {
        axios
          .get(url, { cancelToken: cancelToken1.token })
          .then((response) => {
            console.log("response======================", response);
            dispatch(
              ProductActions.getProductsV1({
                fetching: false,
                productsV1: response.data,
              })
            );
            dispatch(ProductActions.productSearchLoading(false));
            dispatch(CommonActions.setLoading(false));
            return response.data;
          })
          .catch((error) => {
            console.log("error", error);
            // dispatch(
            //   CommonActions.setAlert({
            //     visible: true,
            //     content: error?.response?.message,
            //   }),
            // );
            dispatch(ProductActions.productSearchLoading(false));
            dispatch(CommonActions.setLoading(false));
          });
      } catch ({ message }) {
        dispatch(CommonActions.setAlert({ visible: true, content: message }));
        dispatch(ProductActions.productSearchLoading(false));
        dispatch(CommonActions.setLoading(false));
      }
    };  

const fetchSubCategory = (id, callback) => async (dispatch, getState) => {
  const { config } = getState();
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.get(
      `/products/product-sub-category/list/${config["businessId"]}/${id}`
    );
    console.log("response", response);
    dispatch(CommonActions.setLoading(false));
    callback && callback("success", response["data"]);
  } catch (error) {
    console.log("error", error["response"]);
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
  }
};

const getProductDetail = (id, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .get("/products/details/" + id)
    .then((response) => {
      console.log("detail response", response);
      dispatch(CommonActions.setLoading(false));
      callback && callback("success", response["data"]);
    })
    .catch((error) => {
      dispatch(CommonActions.setLoading(false));
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
      console.log("error->", error["response"]);
    });
};

module.exports = {
  getCategories,
  getProducts,
  getProductsV1,
  fetchSubCategory,
  getProductDetail,
};
