// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import Loader from "@/app/components/Loader";
// import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
// import inkdouble2 from "@/app/assests/image/inkdouble2.svg";

// export default function AuthorSpotlight() {
//   const [authors, setAuthors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAuthors = async () => {
//       try {
//         const res = await fetch(
//           "https://dashboard.bluone.ink/api/public/authors"
//         );
//         const data = await res.json();
//         setAuthors(data || []);
//       } catch (err) {
//         console.error("Author API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuthors();
//   }, []);

//   if (loading) return <Loader />;
//   if (!authors.length) return null;

//   // Latest first
//   const latestAuthors = [...authors].reverse();

//   // TOTAL 12 AUTHORS
//   const newAuthors = latestAuthors.slice(0, 6);
//   return (
//     <section className="w-full pt-20 pb-1 bg-white">
//       <div className="container mx-auto px-4">

//         <div className="text-center mb-14 mt-10">
//               <div className="flex items-center justify-center gap-2 pb-4">
//                 <Image
//                   src={inkdouble1}
//                   width={55}
//                   height={55}
//                   className=""
//                 ></Image>
//                 <i>
//                   <h3 className="text-center text-lg lg:text-3xl font-semibold">
//                     Author Spotlight
//                   </h3>
//                 </i>
//                 <Image
//                   src={inkdouble2}
//                   width={55}
//                   height={55}
//                   className=""
//                 ></Image>
//               </div>
//               <p className="text-[#6b6b6b] text-lg">
//                 Discover new and recently featured authors
//               </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-1">
            
//               {/* <div key={index} className="flex text-[16px] items-center pt-2">
//                   <Link
//                     href={`/authors/${authorObj?.authslug || ""}`}
//                     className="text-[16px] text-[#007DD7]"
//                   >
//                     {author}
//                   </Link>
//                   {index < authorNames.length - 1 && <span>,&nbsp;</span>}
//                 </div> */}
              
//         </div>

//         <AuthorGrid
//           title="New Authors"
//           badge="NEW"
//           authors={newAuthors}
//         />

//       </div>
//     </section>
//   );
// }

// function AuthorGrid({ title, badge, authors }) {
//   return (
//     <div className="mb-24">

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
//         {authors.map((author, index) => (
//           <Link
//             key={index}
//             href={`/authors/${author.slug}`}
//             className="group"
//           >
//             <div className="relative">

//               <span className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-2 py-1 rounded">
//                 {badge}
//               </span>

//               <div className="relative w-full aspect-[3/4] bg-[#f2f2f2] rounded-md overflow-hidden">
//                 <Image
//                   src={author.imageUrl}
//                   alt={author.name}
//                   fill
//                   unoptimized
//                   className="object-cover group-hover:scale-105 transition"
//                 />
//               </div>

//               <p className="mt-4 text-sm font-medium uppercase tracking-wide text-center">
//                 {author.name}
//               </p>

//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
