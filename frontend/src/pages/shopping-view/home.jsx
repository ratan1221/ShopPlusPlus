import { Button } from '@/components/ui/button';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import ProductDetailsDialog from '@/components/shopping-view/product-details';

// Importing PNG images for categories and brands
import menIcon from '../../assets/icons/menIcon.png';
import womenIcon from '../../assets/icons/womenIcon.png';
import kidsIcon from '../../assets/icons/kidsIcon.png';
import accessoriesIcon from '../../assets/icons/accessoriesIcon.png';
import footwearIcon from '../../assets/icons/footwearIcon.png';

import nikeIcon from '../../assets/icons/nikeIcon.png';
import adidasIcon from '../../assets/icons/adidasIcon.png';
import pumaIcon from '../../assets/icons/pumaIcon.png';
import leviIcon from '../../assets/icons/leviIcon.png';
import zaraIcon from '../../assets/icons/zaraIcon.png';
import hmIcon from '../../assets/icons/hmIcon.png';

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(state => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const slides = [bannerOne, bannerTwo, bannerThree];

  const categoriesWithIcon = [
    { id: 'men', label: 'Men', icon: menIcon },
    { id: 'women', label: 'Women', icon: womenIcon },
    { id: 'kids', label: 'Kids', icon: kidsIcon },
    { id: 'accessories', label: 'Accessories', icon: accessoriesIcon },
    { id: 'footwear', label: 'Footwear', icon: footwearIcon },
  ];

  const brandsWithIcon = [
    { id: 'nike', label: 'Nike', icon: nikeIcon },
    { id: 'adidas', label: 'Adidas', icon: adidasIcon },
    { id: 'puma', label: 'Puma', icon: pumaIcon },
    { id: 'levi', label: "Levi's", icon: leviIcon },
    { id: 'zara', label: 'Zara', icon: zaraIcon },
    { id: 'h&m', label: 'H&M', icon: hmIcon },
  ];

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem('filters');
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate('/shop/listing');
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: 'Product Added To Cart' });
      }
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <div className="relative w-full h-[30vh] md:h-[60vh] lg:h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">

                  <img src={categoryItem.icon} alt={categoryItem.label} className="w-10 h-10 object-contain" />

                  <span className="font-bold mt-4 text-center">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img src={brandItem.icon} alt={brandItem.label} className="w-15 h-14 mb-2 object-contain" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                  key={productItem._id}
                />
              ))
              : null}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingHome;
