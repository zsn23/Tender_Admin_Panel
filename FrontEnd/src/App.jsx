import { Routes, Route  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './Components/Header';
import Tender from './Components/Tender';
import Cities from './Components/Cities';
import Contact from './Components/Contact';
import Categories from './Components/Categories';
import Blogs from './Components/Blogs';
import About from './Components/About';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Detail from './Pages/Detail';
import Organization from './Components/Organization';
import GetALatestTender from './Components/GetALatestTender'
import Subscription from './Components/Subscription'
import CitiesDetails from './Components/CitiesData/CitiesDetails';
import OrganizationDetails from './Components/OrganizationData/OrganizationDetails';
import CategoryDetails from './Components/CategoryDetails';
import TenderCityDetails from './Pages/TenderCityDetails';
import TenderOrganizationDetails from './Pages/TenderOrganizationDetails';
import TenderCategoryDetails from './Pages/TenderCategoryDetails';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import PricePlanDetail from './Components/PricePlanDetail'


import { Helmet } from 'react-helmet';
import FAQS from './Pages/FAQS';
function App() {
  return (
    <div>
      <Helmet>
        <title>Daily updated tenders in 2024</title>
        <meta name="description" content="Stay updated with the latest tenders and opportunities for 2024. Get daily updates on new and relevant tenders." />
      </Helmet>

      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/tender" element={<Tender/>} />
        <Route path="/cities" element={<Cities/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/organization" element={<Organization/>} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path='/about' element={<About/>}/>
        <Route path='/detail/:id' element={<Detail/>}/>
        <Route path='/latest-tender' element={<GetALatestTender/>}/>
        <Route path='/subscription' element={<Subscription/>}/>
        <Route path="/category-details/:name" element={<CategoryDetails />} />
        <Route path="/detail_cities/:name" element={<CitiesDetails/>} />
        <Route path='/OrganizationDetails/:name' element = {<OrganizationDetails/>}/>
        <Route path="/TenderCityDetails/:id" element={<TenderCityDetails />} />
        <Route path='/TenderOrganizationDetails/:id' element={<TenderOrganizationDetails/>}/>
        <Route path='/TenderCategoryDetails/:id' element={<TenderCategoryDetails/>}/>
        <Route path='/FAQs' element = {<FAQS/>}/>
        <Route path='/privacy-policy' element = {<PrivacyPolicy/>}/>
        <Route path='/price-plan-detail' element = {<PricePlanDetail/>}/>

      </Routes>

      
      <Footer/>
    </div>
  );
}

export default App;
