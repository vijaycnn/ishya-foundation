"use client";

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageHeader from "../Components/PageHeader";
import NewsComponent from '../Components/NewsComponent';

export default function WorkInProgress() {
  
  return (
    <>
    <Navbar/>
    <PageHeader pageName="News" breadcrumb="Home/News" />
    <NewsComponent/>
    <Footer/>
    </>
  );
}
