import React from 'react';
import NavBar from '../components/NavBar';
import Cards from '../components/Cards';
import ProductsList from '../components/ProductList';

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


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 pt-10">
          {[
            {
              url: 'https://images.unsplash.com/photo-1575939238474-c8ada13b2724?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM2fHxmYXNoaW9ufGVufDB8MHwwfHx8MA%3D%3D',
              text: 'Urban Streetwear',
              
              rows: 'row-span-2',
            },
            {
              url: 'https://plus.unsplash.com/premium_photo-1708110767427-b90969e0cdf1?w=500&auto=format&fit=crop',
              text: 'Minimalist Vibes',
              cols: '',
              rows: '',
            },
            {
              url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80',
              text: 'Cozy Comforts',
              cols: '',
              rows: 'row-span-2',
            },
            {
              url: 'https://plus.unsplash.com/premium_photo-1708633003273-bed7672ddd81?q=80&w=1221&auto=format&fit=crop',
              text: 'Fresh Finds',
              // cols: 'col-span-2',
                rows: 'row-span-1',
            },
          ].map(({ url, text, cols, rows }, i) => (
            <div
              key={i}
              className={`relative ${cols} ${rows} aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300`}
              style={{ backgroundImage: `url('${url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                <p className="text-white text-lg font-semibold">{text}</p>
              </div>
            </div>
          ))}
        </div>

       
        <section className="pt-6 px-4 mb-16 bg-white/90">
          <Cards />
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
