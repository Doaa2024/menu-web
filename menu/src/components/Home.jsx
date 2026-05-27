import './Home.css'
import { useState } from 'react'
import homeImage from '../assets/homeHero.png'
import useEmblaCarousel from 'embla-carousel-react';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api";

function Home() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start', // important for "slidesPerView effect"
    containScroll: 'trimSnaps',
  });
  const [subEmblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  // single endpoint: categories -> subcategories -> products (images are absolute URLs)
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => (await axios.get(`${API}/api/menu`)).data,
  });

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveSub(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // default to the first category when none is explicitly selected
  const currentCategoryId = activeCategory ?? categories[0]?.id;
  const currentCategory = categories.find((c) => c.id === currentCategoryId);

  // subcategories shown in the bar: the current category's
  const visibleSubcategories = currentCategory?.subcategories ?? [];

  // products to show, based on the active subcategory / category
  const visibleProducts = activeSub
    ? visibleSubcategories.find((s) => s.id === activeSub)?.products ?? []
    : visibleSubcategories.flatMap((s) => s.products);

  return (
    <div className="home">
      <img src={homeImage} alt="Home" className="homeImage" />

      {isLoading && <p className="menu-state">Loading menu…</p>}
      {isError && (
        <p className="menu-state menu-state--error">
          Couldn’t load the menu. Please try again later.
        </p>
      )}

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {categories.map((cat) => (
            <div className="embla__slide" key={cat.id}>
              <div
                className={`circle-item ${currentCategoryId === cat.id ? 'active' : ''}`}
                style={{ backgroundImage: `url(${cat.image})` }}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span>{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="subcategories-bar">
        <div className="sub-embla" ref={subEmblaRef}>
          <div className="sub-embla__container">
            <div className="sub-embla__slide">
              <button
                className={`sub-btn ${activeSub === null ? 'active' : ''}`}
                onClick={() => setActiveSub(null)}
              >
                All
              </button>
            </div>

            {visibleSubcategories.map((sub) => (
              <div className="sub-embla__slide" key={sub.id}>
                <button
                  className={`sub-btn ${activeSub === sub.id ? 'active' : ''}`}
                  onClick={() => setActiveSub(sub.id)}
                >
                  {sub.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className='titleSection'>
          <h2 className="category-title">{currentCategory?.name ?? 'Menu'}</h2>
        </div>

        <div className="menu-grid">
          {visibleProducts.length === 0 && (
            <p className="no-products">No products available in this category</p>
          )}
          {visibleProducts.map((product) => (
            <div
              className="menu-item"
              key={product.id}
              onClick={() =>
                handleItemClick({
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  image: product.image,
                })
              }
            >
              <img src={product.image} alt={product.name} />

              <div className="menu-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="menu-bottom">
                  <span className="price">${product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modalItem" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <span className="closeBtn" onClick={() => setShowModal(false)}>
              &times;
            </span>

            <img src={selectedItem?.image} alt={selectedItem?.name} />

            <h3>{selectedItem?.name}</h3>
            <p>{selectedItem?.description}</p>
            <span className="priceModal">${selectedItem?.price}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
