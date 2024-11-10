import React from 'react'
import image1 from "../assets/images/image-3.png"
import image2 from "../assets/images/image-4.png"
const Home = () => {
  return (
    <div className='m-11'>
        <img src={image2} className='rounded-lg'/>
        <img src={image1}/>
    </div>
  )
}
export default Home