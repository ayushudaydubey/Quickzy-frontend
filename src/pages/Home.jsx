import React from 'react';
import NavBar from '../components/NavBar';
import Cards from '../components/FashionLifeStyle';
import ProductsList from '../components/ProductList';
import Technology from '../components/TechnologyGadget';
import FoodWellness from '../components/FoodWellness';
import Beauty from '../components/Beauty';
import HomeLiving from '../components/HomeLiving';
import Accessories from '../components/assesoires';
import Other from '../components/Other';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <>
      <div className=" min-h-screen w-full">
    
        <section >
          <Hero />
        </section>

        <section >
          <Cards />
        </section>

        <section >
          <Technology />
        </section>

        <section >
          <FoodWellness />
        </section>

        <section >
          <Beauty />
        </section>

        <section >
          <HomeLiving />
        </section>

        <section >
          <Accessories />
        </section>

        <section >
          <Other />
        </section>
      </div>
    </>
  );
};

export default Home;
