import React, { useState } from 'react';
import '../Styles/Faq.css'; // Include the CSS below
import FAQ from '../Images/FAQ.png';
const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: 'What is Ishya Foundation?', answer: 'Ishya Foundation empowers underprivileged children and women through education and skill development.' },
    { question: 'Where are you located?', answer: 'We are located in New Friends Colony, New Delhi, and Noida, Uttar Pradesh.' },
    { question: 'How can I contribute?', answer: 'You can contribute through donations, volunteering, or supporting our initiatives.' },
    { question: 'How can I volunteer at Ishya Foundation?', answer: 'You can reach out to us via email at volunteer@ishya.co.in or contact us through WhatsApp at +91 8527690615.' },
    { question: 'How can I contact Ishya Foundation for partnerships?', answer: 'You can contact us at partnerships@ishya.co.in or call us directly at +91 8527690615.' },
    { question: 'What age group does Ishya Foundation cater to?', answer: 'We primarily cater to children aged 5–18 and women from underprivileged backgrounds.' },
    {question: 'Can I donate anonymously?', answer: 'Yes, you can donate anonymously. Please contact us at +91 8527690615 or volunteer@ishya.co.in to arrange this.' },
    {question: 'How do I cancel my recurring donation?', answer: 'You can cancel your recurring donation by contacting us at +91 8527690615 or volunteer@ishya.co.in. We will be happy to assist you with the cancellation process.' }
  ];
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {/* Left Section */}
      <div className="faq-left">
        <h3 className="faq-subheading">Have any Question?</h3>
        <h1 className="faq-mainheading">Make a difference in the life of a child</h1>
        <div className="faq-greenbox">
          <img src={FAQ}loading="lazy" alt="FAQ Illustration" className="faq-image" />
        </div>
      </div>

      {/* Right Section */}
      <div className="faq-right">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;
