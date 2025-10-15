// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { newsData } from '../Pages/Samachar';
// import { motion } from "framer-motion";
// import { Link } from 'react-router-dom';
// import UseDate from './UseDate';
// import { BsClock } from 'react-icons/bs';
// import { useEffect } from 'react';

// const ArthaDetails = () => {
//     const { title } = useParams();
//     const { nepaliDate, englishDate, currentTime } = UseDate();

//     const samachardetails = newsData.find(item => item.title === title);
//     useEffect(()=>{
//         window.scrollTo(0,0);
//     },[])
//     if (!samachardetails) {
//         return <div>News item not found.</div>;
//     }

//     return (
//         <div className="px-6 md:px-12 py-6">
//             {/* Section Header */}
//             <div className="px-4 py-2 mb-6 inline-block bg-[#F05922]">
//                 <h2 className="text-xl text-white font-bold">अर्थ</h2>
//             </div>
//             {/* Main Content Container */}
//             <div className="flex flex-col lg:flex-row gap-7">
//                 {/* Main News Section */}
//                 <div className="lg:w-7/12 w-full">
//                     <h1 className="text-3xl lg:text-[34px] font-bold mb-7">{samachardetails.title}</h1>
//                     {/* Date & Time */}
//                     <div className="flex mb-4 gap-2 items-center text-sm text-[#3f3d3d]">
//                         <BsClock />
//                         <p className="m-0">{nepaliDate}</p>
//                     </div>
//                     <img
//                         alt={samachardetails.title}
//                         src={samachardetails.image}
//                         className="w-full mb-6 object-cover"
//                     />
//                     <div className="py-6 text-base text-[#2A2A2A] text-justify">
//                         {samachardetails.fulldescription.split("\n\n").map((paragraph, i) => (
//                             <React.Fragment key={i}>
//                                 <p>{paragraph}</p>
//                                 <br />
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Sidebar News List */}
//                 <motion.div
//                     className="lg:w-5/12 w-full bg-white shadow-2xl py-2 px-4 max-h-fit border-t-2 border-[#f3e7e7]"
//                     whileHover={{ scale: 1.02 }}
//                 >
//                     <div className="container mx-auto py-4">
//   <div className="flex items-center">
//     <h2 className="text-xl text-[#F05922] font-bold whitespace-nowrap mr-4">अर्थ</h2>
//     <div className="flex flex-col w-full leading-none">
//       <p className="border-b-[2px] border-[#eb6534] w-full"></p>
//       <p className="border-b-[2px] border-[#0066B3] w-full mt-[1px]"></p>
//     </div>
//   </div>
// </div>

//                     {newsData.map((item, i) => (
//                         <div key={i} className="mb-4">
//                             <motion.div className="flex gap-4 items-center" whileHover={{ scale: 1.02 }}>
//                                 <img
//                                     src={item.image}
//                                     className="w-[90px] h-[60px] object-cover"
//                                     alt={item.title}
//                                 />
//                                 <div>
//                                     <Link to={`/ArthaDetails/${item.title}`}>
//                                         <p className="cursor-pointer hover:text-[#F05922] text-sm lg:text-[15px] font-semibold">
//                                             {item.title}
//                                         </p>
//                                     </Link>
//                                 </div>
//                             </motion.div>
//                             <p className="text-[#424040] text-xs lg:text-[13px] text-right mt-1">{item.time}</p>
//                             <div className="border border-[#e1dede] mt-2"></div>
//                         </div>
//                     ))}
//                 </motion.div>
//             </div>
//             <div>
//             <motion.div className=' bg-[white] shadow-2xl lg:w-7/12 w-full p-4 text-[] border-t-[1px] border-[#cecccc]  font-semibold ' whileHover={{scale:1.02}}>
//                 <p className='mb-3 text-[16px]'>प्रतिक्रिया दिनुहोस् **</p>
//                 <form >
//                     <p className='text-[#4c4a4a]  mb-4'>0 Comments</p>
//                     <input required
//   type="text" 
//   placeholder="Add a comment" 
//   className="w-full h-16 p-2 focus:outline-none mb-3 border-[0.2px] border-[#cecccc]" 
// />

//                <div className=' flex justify-end'> <button className='border-none bg-[#f26a39] text-white py-2 px-2 hover:bg-[#F05922]   ' type='submit'>प्रतिक्रिया दिनुहोस्</button>
//                </div></form>
//             </motion.div>
//             </div>
//         </div>
//     );
// };

// export default ArthaDetails;
