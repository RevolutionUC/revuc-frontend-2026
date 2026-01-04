export default function HeroSection() {
  return (
    <div id='section1' className="section w-full h-[100vh] flex items-center px-4 sm:px-6 lg:px-8 relative z-10">      
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img 
          className='absolute top-[10%] right-[-10%] h-64 opacity-70'
          src="./cloud_final1.webp" 
          alt="" 
          data-speed="0.8"
        />
        <img 
          className='absolute top-[0%] left-[-2%] h-72 opacity-60'
          src="./cloud_final3.webp" 
          alt="" 
          data-speed="0.5"
        />
        <img 
          className='absolute top-[60%] right-[-8%] h-56 opacity-75'
          src="./cloud_final2.webp" 
          alt="" 
          data-speed="1.2"
        />
        <img 
          className='absolute top-[20%] left-[-5%] h-60 opacity-65'
          src="./cloud_final4.webp" 
          alt="" 
          data-speed="0.6"
        />
        <img 
          className='absolute top-[75%] left-[-3%] h-52 opacity-70'
          src="./cloud_final5.webp" 
          alt="" 
          data-speed="0.9"
        />                
      </div>
      
      <div className="w-full max-w-6xl mx-auto relative z-10 pointer-events-none">
        <div className="max-w-2xl">
          <h1 className="text-8xl font-bold">RevolutionUC</h1>
          <p className="py-6 text-3xl">
            Build. Learn. Grow.
          </p>
          <button className="btn btn-primary btn-lg pointer-events-auto">Register</button>
        </div>
      </div>
    </div>
  );
}
