import { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Select from 'react-select';
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";
import Spinner from "../../Libs/Spinner";
import UseContext from "../../contexts/UseContext";

const RemoveForm = ({ localProducts, setLocalProducts, productType, setProductType }) => {
    const [modifiedProductList, setModifiedProductList] = useState([]);
    const [productDetails, setProductDetails] = useState({ quantity: 1, supplier: 1 });
    const { user, alertMessage, setAlertMessage, isLoading, shortProduct, stockProduct } = UseContext();
    const [calculateMethod, setCalculateMethod] = useState(null)
    const [calculatePrice, setCalculatePrice] = useState({ mrp: null, percent: null, price: null })
    const calculateMethodOption = [
        { label: 'Please Select', value: null },
        { label: 'Fixed Price', value: 'fixed' },
        { label: '% Price', value: 'percent' }
    ]
    const updateProductDetails = (key, value) => {
        setProductDetails({ ...productDetails, [key]: value });
    }

    const handleAddToListClick = (e) => {
        e.preventDefault();

        if (!user?.email) {
            setAlertMessage({ message: 'Please login first', type: 'error' });
            return;
        }
        if (!productType?.value) {
            setAlertMessage({ message: 'Please select a product type', type: 'error' });
            return;
        }
        if (!productDetails?._id) {
            setAlertMessage({ message: 'Please select a Product', type: 'error' });
            return;
        }

        if (productDetails?.quantity > productDetails?.oldQuantity) {
            setAlertMessage({ message: 'Quantity can not be greater than the available quantity', type: 'error' });
            return;
        }
        if (!productDetails?.quantity || productDetails?.quantity < 1) {
            setAlertMessage({ message: 'Quantity can not be empty', type: 'error' });
            return;
        }
        document.querySelector('.clear-icon').click();
        if (calculateMethod?.value && !productDetails?.supplier) {
            setLocalProducts([...localProducts, { ...productDetails, supplier: `Sup-${Math.random().toString().substring(2, 5)}` }]);
        } else if (!calculateMethod?.value && productType?.value == 'product') {
            const products = { ...productDetails }
            if (products.hasOwnProperty('price')) {
                delete products.price;
            }

            if (products.hasOwnProperty('supplier')) {
                delete products.supplier;
            }

            setLocalProducts([...localProducts, products]);
        } else {
            setLocalProducts([...localProducts, productDetails]);
        }

        if (calculateMethod?.value) {
            setProductDetails(prev => ({ supplier: prev.supplier, quantity: 1 }));
            if (calculateMethod.value === 'percent') {
                setCalculatePrice((prev) => ({ mrp: null, percent: prev.percent, price: null }))
            }
        } else {
            setProductDetails({ quantity: 1 })
        }
        setCalculateMethod(prev => (prev))
    }

    useEffect(() => {
        if (productType?.value) {
            const productList = productType?.value === 'stock' ? stockProduct : shortProduct;
            const modifiedData = productList.map(product => {
                //check if product is already in localProducts
                const isAlreadyAdded = localProducts.find(pd => pd._id === product._id);
                if (!isAlreadyAdded) {
                    return {
                        ...product,
                        label: product.label + ' (' + product.quantity + ')',
                    }
                }

            })
            setModifiedProductList(modifiedData)
            // ai part ta lagbe kina thik sure na pore test kore dekhte hbe
            if (productType.value === 'product') {
                if (calculateMethod?.value === 'percent') {
                    setCalculatePrice((prev) => ({ mrp: null, percent: prev.percent, price: null }))
                } else {
                    setCalculatePrice({ mrp: null, percent: null, price: 0 })
                }
                setProductDetails(prev => ({ supplier: prev.supplier, quantity: 1, }))
            } else {
                setProductDetails({ quantity: 1 })
                setCalculateMethod(null)
            }
            document.querySelector('.clear-icon')?.click();
        }
    }, [productType?.value, localProducts])

    const handleOnSearch = (string, results) => {
        if (!productType || !productType.value) {
            setAlertMessage({ message: 'Please select a product type', type: 'error' });
            return
        }
    }

    const handleOnSelect = (value) => {
        if (productType.value === 'product') {
            setProductDetails(prev => (
                {
                    _id: value._id,
                    label: value.label,
                    oldQuantity: value.quantity,
                    quantity: 1,
                    rId: value.rId,
                    supplier: prev.supplier,
                    price: value.lpp ? value.lpp : prev.price,
                }
            ));
        } else {
            setProductDetails({
                ...value,
                oldQuantity: value.quantity,
                quantity: 1,
            });
        }

    }

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }} className="bg-blue-100 p-2">{item.label}</span>
            </>
        )
    }

    useEffect(() => {
        if (calculatePrice.mrp && calculatePrice.percent) {
            const price = calculatePrice.mrp - ((calculatePrice.mrp * calculatePrice.percent) / 100)
            setCalculatePrice(prev => ({ ...prev, price }))
            setProductDetails(prev => ({ ...prev, price }))
        }
    }, [calculatePrice.mrp, calculatePrice.percent])

    return (
        <form className="space-y-4 md:w-96">
            <div>
                <label htmlFor="productType" className="block font-medium">
                    Product Type
                </label >
                <Select
                    id="productType"
                    value={productType || storeData.productType[0]}
                    onChange={(value) => setProductType(value)}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                    options={storeData.productType}
                />
            </div >
            {
                isLoading ?
                    <div className="w-full md:w-2/3 lg:w-2/3 mt-12 flex flex-col items-center justify-center overflow-hidden">
                        <Spinner />
                    </div> :
                    <>
                        {
                            productType?.value === 'product' && (
                                <div>
                                    <label htmlFor="priceCalculate" className="block font-medium">
                                        Price Calculate Method
                                    </label >
                                    <Select
                                        id="priceCalculate"
                                        value={calculateMethod || calculateMethodOption[0]}
                                        onChange={(value) => setCalculateMethod(value)}
                                        className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                                        options={calculateMethodOption}
                                    />
                                </div>
                            )
                        }
                        {
                            calculateMethod?.value && (
                                <>
                                    <label htmlFor="supplier" className="block font-medium">
                                        Supplier
                                    </label>
                                    <input
                                        id="supplier"
                                        type="text"
                                        value={productDetails?.supplier || ''}
                                        onChange={(event) => updateProductDetails('supplier', event.target.value)}
                                        className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                                    />
                                </>
                            )
                        }
                        <div>
                            <label htmlFor="productName" className="block font-medium">
                                Product Name
                            </label>
                            <div className='productNameContainer'>
                                <div>
                                    <ReactSearchAutocomplete
                                        items={modifiedProductList}
                                        onSearch={handleOnSearch}
                                        onSelect={handleOnSelect}
                                        autoFocus
                                        formatResult={formatResult}
                                        showIcon={false}
                                        styling={{ borderRadius: '4px', border: '2px solid black' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block font-medium">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                value={productDetails?.quantity || ''}
                                onChange={(event) => updateProductDetails('quantity', parseFloat(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        {
                            calculateMethod?.value && (
                                calculateMethod.value === 'fixed' ?
                                    <div>
                                        <label htmlFor="price" className="block font-medium">
                                            Price
                                        </label>
                                        <input
                                            id="price"
                                            type="number"
                                            value={productDetails?.price || ''}
                                            onChange={(event) => updateProductDetails('price', parseFloat(event.target.value))}
                                            className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                                        />
                                    </div>
                                    :
                                    <div className="flex gap-6 items-center">
                                        <input
                                            className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-40"
                                            type="number"
                                            value={calculatePrice.mrp || ''}
                                            placeholder="Product MRP"
                                            onChange={(e) => setCalculatePrice(prev => ({ ...prev, mrp: parseFloat(e.target.value) }))}
                                        />
                                        <input
                                            className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-20"
                                            type="number"
                                            value={calculatePrice.percent || ''}
                                            placeholder="%"
                                            onChange={(e) => setCalculatePrice(prev => ({ ...prev, percent: parseFloat(e.target.value) }))}

                                        />
                                        <p>= {calculatePrice.price}</p>
                                    </div>

                            )
                        }
                        {alertMessage.type === 'error' && <Alert message={alertMessage.message} className="bg-red-500" />}
                        {alertMessage.type === 'success' && <Alert message={alertMessage.message} className="bg-green-600" />}
                        <div className="text-center">
                            <input
                                type="submit"
                                onClick={handleAddToListClick}
                                value="Add to List"
                                className="py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            />
                        </div>
                    </>
            }
        </form >
    )
}

export default RemoveForm;