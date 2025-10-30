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
    <div
      className="min-h-screen min-w-screen:md w-full text-zinc-950 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606813909027-060beeecf6f1?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="bg-white/80 min-h-screen w-full">
       

  
        <div className="p-6 text-center md:text-left">
          <h1 className="text-3xl md:text-6xl font-normal text-zinc-800 mb-4">
            Welcome to <span className="text-zinc-950 font-semibold  ">Quickzy</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-700">
            Discover trending products, exclusive drops, and effortless fashion inspiration.
          </p>
        </div>
      
      {/* home page imaeg ui  */}
        <section className="pt-6 px-4 mb-10 bg-white/90">
          <Hero />
        </section>
         
        <section className="pt-6 px-4 mb-10 bg-white/90">
          <Cards />
        </section>

           <section className="pt-6 px-4 mb-16 bg-white/90">
          < Technology />
        </section>

           <section className="pt-6 px-4 mb-10 bg-white/90">
          <FoodWellness />
        </section>

           <section className="pt-6 px-4 mb-10 bg-white/90">
          <Beauty />
        </section>
           <section className="pt-6 px-4 mb-10 bg-white/90">
          <HomeLiving />
        </section>
           <section className="pt-6 px-4 mb-10 bg-white/90">
          <Accessories />
        </section>
           <section className="pt-6 px-4 mb-10 bg-white/90">
          <Other />
        </section>

       
        {/* <section className="py-10 px-4 bg-white/90">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
          <ProductsList />
        </section> */}
      </div>
    </div>
  );
};

export default Home;
