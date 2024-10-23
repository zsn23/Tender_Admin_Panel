import Hero from "../Components/Hero"
import TenderByCatagory from "../Components/TenderByCatagory"
import TenderByCity from "../Components/TenderByCity"
import TenderByOrgnization from "../Components/TenderByOrgnization"
import TenderTable from "../Components/TenderTable"
import SliderComponent from "../Components/SliderComponent"

const Home = () => {
  return (
    <>
     
     <SliderComponent/>
     <Hero/>
     <TenderByOrgnization/>  
     <TenderByCatagory/>
     <TenderByCity/>
     <TenderTable/>
    </>
  )
}

export default Home