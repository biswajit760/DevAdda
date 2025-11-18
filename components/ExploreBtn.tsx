import React from 'react'
import Image from 'next/image'

const ExploreBtn = () => {
  return (
    <button type='button' id='explore-btn' className='mt-7 mx-auto' >
        <a href="#events">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="down-arrow" width={20} height={20} className='inline-block ml-2 mt-1' />
        </a>
    </button>
  )
}

export default ExploreBtn