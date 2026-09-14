"use client";

import media from "@/lib/media";
import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/ILC.css";

// Import images for different sections (Replace with actual images)
import WomensDay from "../Images/WomensDay (1).jpg";
import RepublicDay from "../Images/RepublicDay.jpg";
import SummerCamp from "../Images/SummerCamp.jpg";
import DiwaliCelebration from "../Images/DiwaliCelebration.jpg";
import BaisakhiCelebration from "../Images/BaisakhiCelebration.jpg";
import HoliCelebration from "../Images/DiwaliCelebration.jpg";
import BirthdayCelebration from "../Images/BirthdayCelebration.jpg";
import LohriCelebration from "../Images/LohriCelebration.jpg";
import WorldEarthDay from "../Images/WorldEarthDay.jpg";

import PageHeader from "../Components/PageHeader";

const ILC = () => {
  return (
    <div className="ilc-container">
      <Navbar />
      <PageHeader pageName="Ishya Learning Centre" breadcrumb="Home/Ishya Learning Centre" />

      
      {/* Women's Day Celebration */}
      <section className="ilc-section womens-day">
        <div className="ilc-content">
          <h2>Women's Day Celebration</h2>
          <p>
            A one-day program in collaboration with NCUI. The Ishya Foundation
            hosted an Entrepreneurship Development Program (EDP) on 30 May 2024
            at Chalera village, Noida. Organised by the Centre for
            Entrepreneurship Development & Cooperation (CEDC) of NCUI, this
            session explained the beneﬁts of forming SHGs & cooperatives along
            with their registration processes. Women were introduced to various
            social protection schemes like ShramYogi Mandhan Yojana (pension),
            Ayushman Card (health insurance), and ABHA Card (health ID). Digital
            literacy and financial inclusion were also discussed.
          </p>
        </div>
        <div className="ilc-image">
          <img src={media(WomensDay)} alt="Women's Day Celebration" loading="lazy" />
        </div>
      </section>
      <section className="ilc-section diwali-celebration">
      <div className="ilc-image">
        <img src={media(DiwaliCelebration)} alt="Diwali Celebration" loading="lazy" />
      </div>
      <div className="ilc-content">
        <h2>Diwali Celebration</h2>
        <p>
          Ishya Foundation celebrated the festival of lights with underprivileged children, spreading joy and warmth. Our team distributed sweets, diyas, and festive clothes to ensure that every child could experience the essence of Diwali. The event was filled with laughter, cultural performances, and a sense of togetherness, making it a truly memorable experience for all.
        </p>
      </div>
    </section>
      {/* Republic Day Celebration */}
      <section className="ilc-section republic-day">
        <div className="ilc-image">
          <img src={media(RepublicDay)} alt="Republic Day Celebration" loading="lazy" />
        </div>
        <div className="ilc-content">
          <h2>Republic Day Celebration</h2>
          <p>
            Ishya, in collaboration with Sambhavna (CRACR&PD) and White Globe,
            visited Rahat Manzil in Srinagar, Kashmir, where we met the residing
            children. We extended a helping hand by fulfilling the children's
            wish-list, which included warm clothing. We donated jackets to 100
            boys and treated them to a delicious meal. The afternoon was spent
            playing games, and later, they enjoyed tea and samosas.
          </p>
        </div>
      </section>
{/* Baisakhi Celebration */}
        <section className="ilc-section baisakhi-celebration">
          <div className="ilc-image">
            <img src={media(BaisakhiCelebration)} alt="Baisakhi Celebration" loading="lazy" />
          </div>
          <div className="ilc-content">
            <h2>Baisakhi Celebration</h2>
            <p>
              The children at Ishya Learning Center celebrated Baisakhi with great joy and enthusiasm.
              As part of the festivities, they created beautiful drawings of lush green crops and 
              vibrant Baisakhi-themed artwork, filling the space with colors of harvest and happiness.
              The celebration was a blend of creativity and cultural learning, making it a memorable 
              experience for all the young learners.
            </p>
          </div>
        </section>

      {/* Summer Camp 2023 */}
      <section className="ilc-section summer-camp">
        <div className="ilc-content">
          <h2>Summer Camp '23</h2>
          <p>
            Ishya's summer camp workshop, led by Ms. Aradhana Rai Gupta from
            Project Baala and her volunteers, educated girls on safe and
            sustainable menstrual hygiene practices. We discussed menstruation
            as a natural phenomenon with 88 active participants. To promote
            sustainability, reusable sanitary kits were distributed.
          </p>
        </div>
        <div className="ilc-image">
          <img src={media(SummerCamp)} alt="Summer Camp 2023" loading="lazy" />
        </div>
      </section>
      {/* Holi Celebration */}
      <section className="ilc-section holi-celebration">
        <div className="ilc-image">
          <img src={media(HoliCelebration)} alt="Holi Celebration" loading="lazy" />
        </div>
        <div className="ilc-content">
          <h2>Holi Celebration</h2>
          <p>
            The festival of colors was celebrated with enthusiasm at Ishya
            Learning Center. Children enjoyed playing with organic colors,
            dancing, and sharing sweets. The event encouraged unity, joy, and
            cultural harmony among the students and the community.
          </p>
        </div>
      </section>

      {/* Lohri Celebration */}
      <section className="ilc-section lohri-celebration">
        <div className="ilc-content">
          <h2>Lohri Celebration</h2>
          <p>
            The warmth of Lohri was felt at Ishya Foundation as children and
            families gathered around the bonfire, sang folk songs, and enjoyed
            traditional treats like rewari and peanuts. The festival symbolized
            the triumph of light over darkness and the spirit of togetherness.
          </p>
        </div>
        <div className="ilc-image">
          <img src={media(LohriCelebration)} alt="Lohri Celebration" loading="lazy" />
        </div>
      </section>

      {/* World Earth Day Celebration */}
      <section className="ilc-section earthday-celebration">
        <div className="ilc-image">
          <img src={media(WorldEarthDay)} alt="World Earth Day Celebration" loading="lazy" />
        </div>
        <div className="ilc-content">
          <h2>World Earth Day Celebration</h2>
          <p>
            On Earth Day, Ishya Foundation organized an awareness campaign where
            children planted saplings and learned about the importance of
            environmental conservation. The event emphasized sustainable
            practices like reducing waste and protecting natural resources.
          </p>
        </div>
      </section>

      {/* Birthday Celebration */}
      <section className="ilc-section birthday-celebration">
        <div className="ilc-content">
          <h2>Birthday Celebration</h2>
          <p>
            A special initiative at Ishya Learning Center ensures that every
            child’s birthday is celebrated with love and joy. Cake-cutting,
            games, and personalized gifts make their day extra special,
            bringing smiles to their faces and creating cherished memories.
          </p>
        </div>
        <div className="ilc-image">
          <img src={media(BirthdayCelebration)} alt="Birthday Celebration" loading="lazy" />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ILC;
