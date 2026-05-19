import React from 'react';
import HomePage from './Pages/HomePage'; 
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import Donate from './Pages/Donate';
import ProjectsPage from './Pages/ProjectsPage';
import ProjectDetail from './Pages/ProjectDetail';
import Blogs from './Pages/Blogs';
import Partnerships from './Pages/PartnershipsPage';
import WorkInProgress from './Pages/WorkInProgress';
import AllNews from './Pages/AllNews';
import "./i18n"; 
import NewslettersPage from './Pages/Newsletter';
import GalleryPage from './Pages/Gallery';
import JoinUsPage from './Pages/JoinUsPage';
import BlogDetails from './Pages/BlogDetails';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import SubscribePopup from './Components/SubscribePopup';
import ILC from './Pages/ILC';
import SubmitBlog from './Pages/SubmitBlog';
import ATGDetails from './Pages/ATGDetails';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us/who-are-we" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/ourprograms" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/media-&-coverage/blog" element={<Blogs />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/media-&-coverage/gallery" element={<GalleryPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/media-&-coverage/news" element={<AllNews />} />
        <Route path="/partnerships" element={<WorkInProgress />} />
        <Route path="/about-us/finances-&-reporting" element={<WorkInProgress />} />
        <Route path="/media-&-coverage" element={<WorkInProgress />} />
        <Route path="/media-&-coverage/newsletter" element={<NewslettersPage />} />
        <Route path="/joinus" element={<JoinUsPage />} />
        <Route path="/blog/:id" element={<BlogDetails />} /> 
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
        <Route path="/our-programs/all" element={<ProjectsPage />} />
        <Route path="/ishya-learning-centre" element={<ILC />} />
        <Route path="/submit-blog" element={<SubmitBlog />} />
        <Route path="/about-us/ishya-learning-centre" element={<ILC />} />
        <Route path="/ATG-details" element={<ATGDetails />} />

      </Routes>
      <SubscribePopup/> {/* Place the component here */}
    </Router>
  );
};

export default App;



