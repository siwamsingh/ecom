
import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function TopCarsoul() {

    const topics = [ "Get 30% off on all Books", "10% CASHBACK on orders above Rs.400", "Grab BEST Deals on Best Selling Books" ]

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 250 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    return (
        <div>
            <div className='flex items-center h-10 sm:h-12 text-white bg-blue-800 '>
                

                    <Carousel
                        swipeable={true}  
                        draggable={true}
                        responsive={responsive}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={6000}
                        keyBoardControl={true}
                        transitionDuration={6000}
                        customTransition='transform 1500ms ease-in-out'
                        containerClass="carousel-container"
                        className='w-full transition-all ease-in-out'
                        arrows={false}
                    >
                        {
                            topics.map((topic , index)=>(
                                <div key={index} className='flex justify-center '>
                                    <div className='inline-block overflow-hidden p-2 mr-[1rem] cursor-pointer ease-in-out duration-900 sm:text-lg text-md'>{topic}</div>
                                </div>
                            ))
                        }
                    </Carousel>
                
            </div>
        </div>
    )
}

export default TopCarsoul
