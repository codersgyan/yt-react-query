import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const limit = rowsPerPage;
    const [skip, setSkip] = useState(0);
    const [selectCategory, setSelectCategory] = useState("All");

    const { data: productsLength } = useQuery({
        queryKey: ['productsData'],
        queryFn: async () => {
            const data = await fetch('https://dummyjson.com/products').then((res) => res.json());
            console.log(data.products);
            return data.products.length;
        },
    });
    const totalPages = productsLength ? Math.ceil(productsLength / limit) : 0;

    const {
        isLoading,
        error,
        data: products,
    } = useQuery({
        queryKey: ['products', limit, skip],
        queryFn: async () => {
            const data = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`).then((res) => res.json());
            // console.log(data.products);
            return data.products;
        },
    });

    const handlePrevious = () => {
        setSkip(Math.max(0, skip - limit));
        setCurrentPage(Math.max(1, currentPage - 1));
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setSkip(skip + limit);
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePageClick = (pageNumber) => {
        setSkip((pageNumber - 1) * limit);
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPage = (e) => {
        const newRowsPerPage = parseInt(e.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setSkip(0);
        setCurrentPage(1);
    };

    const renderRowsPerPage = () => {
        const opts = [4, 8, 12, 16, 20, 24, 28, 30, 50, 100, 200, 300];
        return opts.filter((option) => !productsLength || option < productsLength).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
        ));
    }

    const handleCategory = (e) => {
        setSelectCategory(e.target.value);
        
        setCurrentPage(1);
    }

    // const [products, setProducts] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             setIsLoading(true);
    //             setError(null);
    //             const response = await fetch('https://dummyjson.com/product');
    //             const data = await response.json();
    //             console.log(data.products);
    //             setProducts(data.products);
    //             setIsLoading(false);
    //         } catch (err) {
    //             setError(err.message);
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchProducts();
    // }, []);

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    if (error) {
        return <h3>Error: {error.message}</h3>;
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className='flex justify-between'>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        Customers also purchased
                    </h2>
                    <select 
                        className='shadow rounded-2xl p-[6px] h-10 mx-2 md:mx-4'
                        onChange={handleCategory}
                        value={selectCategory}>
                        <option>All</option>
                        <option>beauty</option>
                        <option>fragrances</option>
                        <option>furniture</option>
                        <option>groceries</option>
                    </select>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link to={`/products/${product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className='flex justify-between pt-20 w-full'>
                    <div className="flex">
                        <p className="text-sm">Row Per Page: </p>
                        <select value={rowsPerPage} onChange={handleRowsPerPage} className='h-8 bg-gray-200 mx-2 rounded-md'>
                            {renderRowsPerPage()}
                            {productsLength && <option value={productsLength}>{productsLength}</option>}
                        </select>
                    </div>

                    <div className="flex gap-2 mt-12">
                        <button
                            className="bg-purple-500 px-4 py-1 text-white rounded"
                            onClick={handlePrevious}>
                            Prev
                        </button>
                        <div className="overflow-auto whitespace-nowrap admin-scrollbar">
                            <div className=''>
                                {Array.from({length: totalPages}, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={`w-6 mx-1 rounded-full ${currentPage === index + 1 ? 'text-green-500' : 'bg-white text-black'}`}
                                    onClick={() => handlePageClick(index + 1)}
                                >
                                {index + 1}
                                </button>
                                ))}
                            </div>
                        </div>
                        <button
                            className="bg-purple-500 px-4 py-1 text-white rounded"
                            onClick={handleNext}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
