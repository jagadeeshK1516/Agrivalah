import Layout from "./Layout.jsx";

import Startups from "./Startups";

import Schools from "./Schools";

import Markets from "./Markets";

import Home from "./Home";

import About from "./About";

import Farmers from "./Farmers";

import Mitras from "./Mitras";

import SHGs from "./SHGs";

import Contact from "./Contact";

import BusinessModel from "./BusinessModel";

import NatureFarming from "./NatureFarming";

import FarmMachineryBuy from "./FarmMachineryBuy";

import FarmMachineryRent from "./FarmMachineryRent";

import OfflineStores from "./OfflineStores";

import OnlineStore from "./OnlineStore";

import Services from "./Services";

import ProductDetail from "./ProductDetail";

import Sellers from "./Sellers";

import Dashboard from "./Dashboard";

import Auth from "./Auth";

import SellerDashboard from "./SellerDashboard";

import SellerSignup from "./SellerSignup";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Startups: Startups,
    
    Schools: Schools,
    
    Markets: Markets,
    
    Home: Home,
    
    About: About,
    
    Farmers: Farmers,
    
    Mitras: Mitras,
    
    SHGs: SHGs,
    
    Contact: Contact,
    
    BusinessModel: BusinessModel,
    
    NatureFarming: NatureFarming,
    
    FarmMachineryBuy: FarmMachineryBuy,
    
    FarmMachineryRent: FarmMachineryRent,
    
    OfflineStores: OfflineStores,
    
    OnlineStore: OnlineStore,
    
    Services: Services,
    
    ProductDetail: ProductDetail,
    
    Sellers: Sellers,
    
    Dashboard: Dashboard,
    
    Auth: Auth,
    
    SellerDashboard: SellerDashboard,
    
    SellerSignup: SellerSignup,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Startups />} />
                
                
                <Route path="/Startups" element={<Startups />} />
                
                <Route path="/Schools" element={<Schools />} />
                
                <Route path="/Markets" element={<Markets />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Farmers" element={<Farmers />} />
                
                <Route path="/Mitras" element={<Mitras />} />
                
                <Route path="/SHGs" element={<SHGs />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/BusinessModel" element={<BusinessModel />} />
                
                <Route path="/NatureFarming" element={<NatureFarming />} />
                
                <Route path="/FarmMachineryBuy" element={<FarmMachineryBuy />} />
                
                <Route path="/FarmMachineryRent" element={<FarmMachineryRent />} />
                
                <Route path="/OfflineStores" element={<OfflineStores />} />
                
                <Route path="/OnlineStore" element={<OnlineStore />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/ProductDetail" element={<ProductDetail />} />
                
                <Route path="/Sellers" element={<Sellers />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Auth" element={<Auth />} />
                
                <Route path="/SellerDashboard" element={<SellerDashboard />} />
                
                <Route path="/SellerSignup" element={<SellerSignup />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}