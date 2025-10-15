import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Gossipandsong = ({ newsarray, heading }) => {
    return (
        <>
            <div className="flex flex-col mt-10 ">
                {/* Heading */}
                <div className="flex items-center">
                    <h1 className="bg-secondary text-white px-4 py-2 w-fit font-bold text-xl">{heading}</h1>
                    <div className="flex-1 border-b-[1.2px] border-secondary mx-3"></div>
                    <p className="cursor-pointer hover:text-secondary text-[#1e1e1e] transition-colors duration-300">
                        More
                    </p>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
                    {newsarray.slice(0, 4).map((news, index) => (
                        <Link to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`} key={index}>
                            <div
                                className="shadow-lg bg-white hover:shadow-2xl p-3 cursor-pointer rounded-lg transition-transform duration-300 hover:scale-105"
                            >
                                <img
  src={
    news.image?.startsWith("http")
      ? news.image
      : `http://localhost:5000${news.image}`
  }
  alt={news.title}
                                className="rounded-lg w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <p className="mt-3 text-[16px] font-medium text-gray-800 hover:text-secondary transition-colors duration-300">
                                {news.title}
                            </p>
                        </div>
                    </Link>
                ))}
                </div>
            </div>
        </>
    )
}
export const Gallery=({newsarray,heading})=>{
    return(
        <>
 <div className="flex flex-col mt-10 ">
                    {/* Heading */}
                    <div className="flex items-center">
                        <h1 className="bg-secondary text-white px-4 py-2 w-fit font-bold text-xl">{heading}</h1>
                        <div className="flex-1 border-b-[1.2px] border-secondary mx-3"></div>
                        <p className="cursor-pointer hover:text-secondary text-[#1e1e1e] transition-colors duration-300">
                            More
                        </p>
                    </div>
                    <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 cursor-pointer mt-10'>
                        {newsarray.slice(0, 4).map((news, index) => (
                            <Link to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`} key={index}>
                                <div className=' relative lg:h-[350px] h-[290px]  bg-white shadow-lg hover:shadow-2xl  hover:scale-105 duration-500 '>
                                    <img
  src={
    news.image?.startsWith("http")
      ? news.image
      : `http://localhost:5000${news.image}`
  }
  alt={news.title} className='h-full w-full rounded-[5px] object-cover' />
                                    <div className='absolute inset-0 bg-black bg-opacity-40  w-full flex items-end  p-4 py-8 '>
                                        <p className='text-center   md:text-[18px]  text-[14px] font-bold w-[90%] text-[#e6e3e3] hover:text-white'>{news.title}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}


                    </div>


                </div>
        </>
    )
}

export const Filmandbollywood = ({ newsarray, mainimg, heading, mainTitle }) => {
    return (
        <div className='mt-10 flex flex-col h-fit'>
            <div className='flex items-center'>
                <h2 className='bg-secondary w-fit text-white  px-4 py-2 font-bold text-xl '>{heading}</h2>
                <div className='flex-1  border-b-[1.2px] border-secondary md:mx-4 mx-2'></div>
                <p className='cursor-pointer  hover:text-secondary text-[#1e1e1e]'>More</p>
            </div>
            <div className=' flex md:flex-row mt-10 flex-col gap-7'>
                <div className=' md:w-[50%] w-full grid  grid-cols-2 gap-5 ' >
                    {newsarray.slice(0, 4).map((news, index) => (
                        <Link to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`} key={index}>
                            <div className='flex-col shadow-lg bg-white hover:shadow-2xl cursor-pointer rounded-[5px] px-2'>
                                <img
                                    src={
                                        news.image?.startsWith("http")
                                            ? news.image
                                            : `http://localhost:5000${news.image}`
                                    }
                                    alt={news.title} className='rounded-[5px] object-cover w-full h-[150px] hover:scale-105 duration-300' />
                                <p className='mt-2 pb-2  px-2 hover:text-secondary md:text-[16px] text-[12px] transition-colors duration-300'>{news.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='md:w-[50%] relative cursor-pointer md:h-[450px] h-[260px] '>
                    <img src={mainimg} className=' w-full md:h-[450px] h-[260px] rounded-[5px] object-cover' />
                    <div className='absolute inset-0 bg-black bg-opacity-40  w-full flex items-end  p-4 py-8 '>
                        <p className='text-center  md:text-[22px] text-[14px] font-bold w-[80%] text-[#e6e3e3] hover:text-white'>
                            {mainTitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};