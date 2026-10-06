"use client";

import PageHeader from "../Components/PageHeader";
import NewsComponent from '../Components/NewsComponent';

export default function WorkInProgress({pageData}) {
  
  return (
    <>
    <PageHeader pageName="News" breadcrumb="Home/News" />
    <NewsComponent pageData={pageData} />
    </>
  );
}
