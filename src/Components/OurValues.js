import React from "react";
import '../Styles/OurValues.css';

const OurValues = () => {
  const values = [
    {
      icon: "🌟",
      title: "Food & Homeless charity",
      description: "Investing in education is an investment in the future. By supporting Ishya Foundation, you can empower women, unlock the potential of young people, and build a stronger, more equitable society. Your donations will directly support Ishya Foundation's programs that provide access to quality education, vocational training, and life skills development for women and youth. By contributing, you are not only changing lives but also fostering a brighter future for generations to come.",
      bgColor: "#A6C769", // Initial color
      height: "345px",
    },
    {
      icon: "🤝",
      title: "Make a donation",
      description: "Ishya is an organization that collectively and wholeheartedly perceives this situation and feels that herein lies an opportunity, and a responsibility for all who can afford a fulfilled, dignified, and healthy lifestyle to help and aid those who don’t share the same privileges. Our foundation aims to change this economic disparity at its roots. Our programs are designed to help more and more young adults pursue their skills and attain their goals.",
      bgColor: "#6D3780", // Initial color
      height: "400px",
    },
    {
      icon: "🚀",
      title: "Non profit NGO",
      description: "Food donation and charity are essential for building stronger, healthier communities. By donating to Ishya Foundation, you can directly impact the lives of individuals and families facing food insecurity. Your support helps us provide vital food assistance, including meals, pantry distributions, and emergency food aid. We encourage you to consider making a donation  and join us in our mission to combat hunger and ensure everyone has access to nutritious meals.",
      bgColor: "#A6C769", // Initial color
      height: "450px",
    },
  ];

  return (
    <div className="our-values-container flex justify-between items-start gap-4 p-4">
      <div className="our-values-heading"><h2>Our Values</h2></div>
      <div className="all-tiles">
      {values.map((value, index) => (
        <div
          key={index}
          className={`value-tile rounded-lg shadow-lg p-4`}
          style={{
            height: value.height,
            backgroundColor: value.bgColor,
          }}
        >
          
          <div className="icon text-3xl mb-2">{value.icon}</div>
          <h3 className="title text-xl font-semibold mb-2">{value.title}</h3>
          <p className="description-ourvalues text-sm">{value.description}</p>
        </div>
      ))}
      </div>
    </div>
  );
};

export default OurValues;