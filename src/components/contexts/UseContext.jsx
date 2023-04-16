import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function UseContext() {
    const { login,
        user,
        isLoading,
        error,
        logOut,
        googleLogin,
        createUser,
        productList,
        setProductList,
        getProductList,
        getStockProductList,
        setIsLoading,
        alertMessage,
        setAlertMessage,
        changeFieldData,
        setChangeFieldData,
        productHistory,
        stockProductHistory,
        getAllHistory,
        getProductsLength,
        productLength
    } = useContext(AuthContext);

    return {
        error,
        user,
        logOut,
        login,
        isLoading,
        googleLogin,
        createUser,
        productList,
        setProductList,
        getProductList,
        getStockProductList,
        setIsLoading,
        alertMessage,
        setAlertMessage,
        changeFieldData,
        setChangeFieldData,
        productHistory,
        stockProductHistory,
        getAllHistory,
        getProductsLength,
        productLength
    }
}
