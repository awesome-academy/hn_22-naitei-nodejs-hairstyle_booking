import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import AboutUs from '../components/AboutUs'
import Services from '../components/Services'
import StylistList from '../components/StylistList'
import BookingIntro from '../components/BookingIntro'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
    
      <NavBar />
      <Header />
      <AboutUs />
      <Services />
      <StylistList />
      <BookingIntro />
      <Footer />
    </div>
  )
}

export default Home