import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaComment, FaShareAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/BlogDetails.css";
import Blog1 from "../Images/Blog1.png";
import Blog2 from "../Images/Blog2.png";
import Blog3 from "../Images/Blog3.png";
import Blog4 from "../Images/Blog4.png";
import Blog5 from "../Images/Blog5.png";
import Blog6 from "../Images/Blog6.png";
import Blog7 from "../Images/Blog7.png";

// Sample Blog Data
const blogPosts = [
  {
    id: 1,
    title: "How should students improve their mental health?",
    writer: "Disha Gupta",
    writerImg: "https://via.placeholder.com/50",
    date: "Jan 25, 2025",
    content: `High school is difficult and a lot of students struggle with mental health issues as a result. In fact, according to the National Alliance on Mental Illness (NAMI), one in five teens are experiencing a mental health condition, worldwide. And these issues can become chronic (meaning they follow you into adulthood); 50% of chronic mental illnesses develop at age 14. The mental health of students, especially in terms of academic stress and its impact has become a serious issue among researchers and policymakers because of increasing cases of depression in students across the globe. Approximately 60% of the high school students in India experience academic stress. 
    While that's a pretty doom-and-gloom way to start, there are two bits of good news here. One, if you're experiencing a mental health issue, you are not alone and, two, you can do something about it.
    When signs of mental health issues start showing up in you- mood swings, anxiety, feeling withdrawn, eating issues- it can feel scary. Major life changes, academic pressure, relationship problems, family issues and money can all be at the root of mental health issues and can also make your symptoms feel more daunting. 
     
    So daunting, that many tend to use unhealthy coping behaviours to try and make it all go away. Some teens ignore it, some turn to substance abuse, and others act out or harm themselves. None of these is long-term, healthy ways to be your happiest self.
    The following tips will help you stay on top of your game mentally and help you develop healthy habits that can make all the difference right now, in college, in your career, and in your personal life as an adult. Some may not work for you and that's okay; give them a chance and adopt the ones that do make a difference.
    Don’t ignore your sleep. Sleep is huge. Not getting enough sleep or not getting good sleep has been linked to all sorts of mental health issues in teens by a bunch of scientific studies. Most of those studies came to the same conclusion: if you're of high school age, you need more sleep (and more quality sleep) than an adult does. Most of these studies say you need at least eight hours of shuteye during the school week and over nine hours on the weekends. For some, that's easier said than done. It always seems like as soon as your head hits the pillow, you're replaying everything that happened during the day or being flooded with anxious feelings about tomorrow. Here are some ways to stop that from happening and improve the quality of your sleep.
    Develop a Sleeping Routine. Going to sleep at the same time every night and waking up at the same time every day are important. When you do this, your brain will know to start releasing the chemicals that make you sleepy at the right times every night and give you a dose of happy wake-up chemicals every morning.
    Limit your Screen Time. It takes a ton of willpower, but turning your phone, tablet, computer, and TV off at least 30 minutes before you go to bed can make an enormous difference in how fast you fall asleep and how well you sleep. Try setting an alarm for 30 minutes before bed; when it rings, you turn off all screens and focus on something else instead (listening to music, reading, meditating, yoga, showering, etc).
    Limit Caffeine. Caffeine might be your instant happy juice, but it might also be keeping you awake at night. Try giving yourself a cut-off time for your last caffeine fix of the day which is several hours before you head off to bed.
    Make a List for Tomorrow. If you find yourself lying in bed at night worrying about what tomorrow holds, first ask yourself if there's anything you can do about it right now. If there isn't, set it aside mentally and know that you'll handle it when it comes up tomorrow. It can also be helpful to make a to-do list for the next day, which appears to help our brains let go of the anxiety about impending events.
    Follow these steps and lead yourself towards a happier and healthier future!
    `,
    image: Blog1,
  },
  {
    id: 2,
    title: "Why is it critical for girls to play sports?",
    writer: "Disha Gupta",
    writerImg: "https://via.placeholder.com/50",
    date: "Feb 2, 2025",
    content: `Unfortunately, while Indians are progressing towards a positive mindset regarding sports, they hesitate in pursuing it themselves. A shockingly high percentage, 75% of Indians believe that sports is significant in their day-to-day lives according to a research conducted by BBC in 2020. It is shocking because only 36% of the population actually engage in any sort of physical activity. However, what really hurts is that only 29% of the total female population play sports. I use “hurt” to describe this situation with the most sincere meaning of the word. 

    To hurt means to be detrimental to. Women not playing sports is not only detrimental to the person foregoing this opportunity but also to the country as a whole. It is important to understand the role of recreational sports in the well-being of an individual and how that can be impactful at a macro-level. Sports allow an individual to tune into the active side of their personality, which has a few positive spillovers. People tend to put aside the ongoing stresses in their life, such as meeting certain deadlines, maintaining relationships, and managing their wealth for the duration of their play-time. This is essential in achieving a sense of internal peace, which allows one to tackle their stress factors properly and entirely. Whether you are a student, working professional, or an artist, it is necessary for you to be able to take a step back from your main responsibilities and relax your mind so you can tackle them head on when you are required to. If you are able to do so, you are then contributing to the economy and the rest of the society in the most positive manner possible. 
    
    At this point you may be wondering why I emphasized the lack of participation of girls being hurtful rather than the entire population. As discussed before, men already have a higher participation than women but that is not the issue here. According to Catalyst, a global non-profit, only 19.9% of the labor force in India was women in 2020. It was estimated that adding 10% of the participation rate of women would increase India’s GDP by $770 billion by 2025. This is precisely why it is extremely important for women to be involved in the workforce and one way to do that is by increasing participation in sports. As mentioned before, playing sports recreationally allows you to clearly focus on your goals. Additionally, playing sports makes you naturally competitive which often leads to people becoming goal-oriented. So if girls’ participation in sports increases at the grassroot level, there is a higher chance for them to aspire to achieve more than just marrying someone who can financially support them. It is all about the mindset. Sports create a high achieving mindset that is important to cultivate a career-oriented culture. This is ultimately beneficial for both the individual as well as the society as a whole. 
    
    Sports can also be played as a profession. It is one area where gender inequality is increasingly being eradicated. Nowadays, women are allowed to participate in most, if not all, sports at a professional level. The funding is still much higher for most of the men’s sports organizations because they attract larger audiences and generate higher revenues. This, however, should be viewed as a challenge rather than a disadvantage in my opinion. If girls are encouraged to engage in sports, they will be able to gain skills that match or are even better than that of their male counterparts. Many sports are more skill-based than physicality-based. So there is definitely a scope for women to be more involved in sports and attract larger audiences. This can be a great avenue for women to assume financial independence and contribute to the economy. It is, therefore, critical for girls to play sports whether it be recreationally or professionally.
    `,
    image: Blog2,
  },
  {
          id: 3,
          title: "Why is Education Important?",
          writer: "Shalini Gupta",
          writerImg: "https://via.placeholder.com/50",
          date: "Feb 10, 2025",
          content: 
            `Education’s importance in society goes much farther than an individual’s capacity to find work or gain a livelihood. It determines the society’s thoughts and ideas as a whole.
            
            In a place like India, with one of the highest populations in the world, it is important that all of us move ahead instead of just a few. Education is an instrument to provide knowledge, skills, and information to people, aiding in expanding their perspectives, competencies, and exploring new ideas.
            
            First and foremost, education is the biggest asset to help remove poverty by providing the young generation and even older people an opportunity to learn and put their skills to use. They have a higher chance of settling down well and fulfilling their basic needs. It is important to note the significance of understanding and being well-versed in the English language, as it is an important medium of communication and a basic skill for employment. This in turn leads to greater confidence and self-assurance for any individual and reduces the discrimination many face in the weaker sections of society.
            
            Along with this, an educated society will eventually become a safer place for the world in terms of being aware of crimes, less involved in social evils, women empowerment, and more. Education is a means to expand the minds of people to greater perspectives, being more tolerable, and thinking before acting.
            
            This generation has experienced some monumental changes in the form of remote or online learning. The importance of digital education cannot be overlooked in today's digital world. Geographical borders made it impossible for teachers and students to move to other countries. The government is now lifting restrictions and taking initiatives like the National Education Policy (NEP) that puts emphasis on digitization besides the use of technology in education. Furthermore, digital education allows teachers to personalize the content of the course based on the needs of individual students and pay more attention to individual problems. Digital learning is leading to a revolution in the world of education. It leads to personalized content tailor-made for each student and lets the teacher guide students for their individual problems. People are more willing to learn now since education has become more accessible with greater efficiency due to quicker feedback. The number of people who can learn from a single teacher has increased due to higher reach.
            
            We at Ishya, envision strengthening the upcoming future of India to achieve excellence in the 21st century. Our foundation has grown in both scope and scale through our special programs in education and well-being.
            
            Shalini Gupta (Founder of Ishya)`,
          image: Blog3,
        },

        {
            id: 4,
    title: "Exercise Right",
    writer: "Yogita",
    writerImg: "https://via.placeholder.com/50",
    date: "March 5, 2025",
    content: 
                `Physical activity refers to all movements including during leisure time or for transport to get to and from places, or as part of a person's work. Both moderate and vigorous-intensity physical activity improve health. Physical activity is any form of exercise or movement of the body that uses energy. Some of your daily life activities—doing active chores around the house, yard work, walking the dog—are a few examples.
                
                Exercise is one of the best examples of physical activity. Regular physical activity can improve your muscle strength and boost your endurance. Exercise delivers oxygen and nutrients to your tissues and helps your cardiovascular system work more efficiently. When your heart and lungs function better, you have more energy to tackle daily chores.
                
                Exercise is any bodily activity that enhances our health. It is performed for various reasons: to aid growth and improve strength, slow the aging process, build muscles, improve the cardiovascular system, aid in weight loss or maintenance, enhance overall health, or simply for enjoyment. Many individuals choose to exercise outdoors where they can congregate in groups, socialize, and improve mental health. In terms of health benefits, the amount of recommended exercise depends upon the goal, the type of exercise, and the age of the person. Even doing a small amount of exercise is healthier than doing none.
                
                Proper nutrition is as important for health as exercise. When exercising, it becomes even more important to have a good diet to ensure that the body has the correct ratio of macronutrients and micronutrients to aid the body with the recovery process following strenuous exercise.
                
                Active recovery is recommended after participating in strenuous physical exercise because it removes lactate from the blood more quickly than inactive recovery. Removing lactate from circulation allows for an easy decline in body temperature, which can also benefit the immune system, as an individual may be vulnerable to minor illnesses if the body temperature drops too abruptly after physical exercise.
                
                Exercise has an effect on appetite, but whether it increases or decreases appetite varies from individual to individual, and is affected by the intensity and duration of the exercise.
                
                A healthy lifestyle demands regular exercise, and it is an integral part of being fit. Study after study has shown us the various benefits it can have. Not only does regular exercise help you reduce your risk of developing diseases and manage your weight, but it can also help prevent and treat mental health problems.
                
                Exercise is a great way to unwind from the stress of life. It can boost your wellbeing and mood. No matter what one’s age, everyone benefits from regular exercise. To instill healthy habits that may last a lifetime in children, one should encourage kids to be active from an early age. Being active is a huge benefit for older people and seniors.
              
                Exercise helps in the stimulation of muscle development, joints, bones, as well as the lungs and heart. It helps children maintain a healthy weight. Daily exercise also provides kids with the opportunity to make friends and interact with other people.
                
                Exercise helps young people manage symptoms of depression and anxiety. Compared with previous generations, sedentary lifestyles, jobs, and long commutes have put us at a higher risk of the dangers of inactivity and unhealthy habits. Guidelines recommend us to take as much opportunity as we can to exercise and be active. Every adult should aim for at least 150 minutes of moderate-intensity activity over the course of a week.
                
                Strengthening exercises are also very important to do at least two days a week. Activities such as exercising with weights or heavy gardening can be included in strengthening exercises. One should aim to do at least some physical activity every day.
                
                Not getting enough vitamins, minerals, and other nutrients can compromise your health and performance. You might be surprised how many active adults overlook the importance of nutrition basics — and then run short on key nutrients. Yet fueling up for activity is as easy as following the well-established rules of a healthy diet: Eat plenty of fruits and vegetables, consume lean proteins, eat healthy fats, get whole-grain carbohydrates, and drink plenty of fluids, especially water, while following a balanced diet.
                
                "Yogita (Student at ISHYA)`,
                image: Blog4,
            },
                {
                  id: 5,
                  title: "Online vs Offline Education",
                  writer: "Muskan Rajput",
                  writerImg: "https://via.placeholder.com/50",
                  date: "March 10, 2025",
                  content: 
                    `The Covid-19 pandemic brought a dynamic shift in the world’s education system. The imposition of lockdown led to the shutdown of physical classrooms, and therefore online education became the new norm. Although online learning has managed to keep education alive in these dire times, it cannot completely replace it. Both online and offline education have their own distinctive set of advantages and disadvantages.
                    
                    In this blog, we will explore one of the most debatable topics these days: online classes vs offline classes. For the first time in many years, a disease had stopped the entire world from functioning normally. Every country imposed a nationwide lockdown to prevent the infection from spreading, as it is highly contagious. Since then, everything has shifted online from classes to offices, grocery shopping to casual meet-ups, etc. This form of life is called the 'new normal.' Schools and universities are conducting classes, exams, presentations, and everything else online.
                    
                    Online education is learning via online classes as per the convenience of the students and teachers. In comparison, offline education is the traditional learning system where students and teachers have face-to-face learning. Both forms of education have their advantages and disadvantages.
              
                    Advantages of Online Education:
                    • It is flexible and can be accessed from anywhere with a device and internet connection.
                    • Budget-friendly.
                    • Convenient attendance.
                    • Class recordings are available for later references.
                    
                    Disadvantages of Online Education:",
                    • One of the major disadvantages faced by students learning online is managing screen time. Online education requires staying glued to the screen for an extended period regularly. Long-duration screen time becomes a great difficulty for the students and is harmful to their health, especially their eyes.
                    • Another disadvantage includes technical glitches. Poor internet connectivity issues also arise multiple times during online sessions. Small towns/cities and rural areas face difficulty maintaining a stable internet connection, which disrupts the learning process.
                    • Other disadvantages include feelings of isolation, minimal peer interaction, and inefficient group work compared to offline learning.",
                    
                    Advantages of Offline Classes:
                    • Students are fully attentive towards class with fewer distractions. Online classes have more possibilities for distractions where students may surf other platforms or pay less attention in class.",
                    • Teachers can provide individual attention to students, address their issues, and solve them quickly.
                    
                    Disadvantages of Offline Classes:
                    • Students may lack the opportunity to learn advanced technology.
                    • Time management becomes an issue for students who reside far away from campus.
                    • No recording or any other form of data is available for students who missed the class for later reference.
                    
                    Some Tips for Teachers for Efficient Online Education:
                    • Make short sessions of classes, preferably 40-45 minutes.
                    • Minimum 15-minute break between every class.
                    • The last class of the week can be a doubt-clearing session.
                    • Assign tasks and deadlines considering other subjects so students don’t have multiple submission deadlines on the same date.
                    
                    Some Tips for Students Attending Online Education:
                    • Stay away from the screen during break times.
                    • Eat healthy, get enough sleep.
                    • Discuss doubts with teachers as soon as possible.
                    • Note down doubts for doubt-clearing sessions.
                    • Inform teachers beforehand or immediately about any technical glitches.
                    
                    Conclusion,
                    These are just some of the advantages and disadvantages of online classes vs offline classes. In fact, you should now understand why online education has become so popular. As long as you are committed and disciplined, you will certainly succeed in online learning. Also, if you need help with any problem, you can always seek the help of virtual classrooms.
                    
                    So, does this mean that online and offline classes offer absolutely the same advantages?
                    No. Every method of education has its own pros and cons. You need to study and learn in a methodical and planned way so you can maximize your learning benefits and minimize your disadvantages.
                    
                    Muskan Rajput (Student at ISHYA)`,
                  image: Blog5,
                },
          {
            id: 6,
            title: "The Importance of Physical Fitness",
            writer: "Kamini",
            writerImg: "https://via.placeholder.com/50",
            date: "March 15, 2025",
            content: 
              `Physical fitness is the key to a healthy body. At the end of the day, your health is your responsibility.
        
              Why should we be physically active?
        
              For me, exercise is more than just physical, it's therapeutic. Physical activity is very necessary and good for our body. By being physically active, we maintain our health. Physical activity or exercise can improve our health. Some people join a gym for exercising and others use simpler means such as exercising at home.
        
              Is it difficult?
        
              Not really. If you start exercising at home, it is enough to get fit and healthy. 30 minutes of physical activity a day can reduce the risk of diseases such as blood pressure, diabetes, etc. All these diseases can increase the risk of cardiovascular abnormalities, which can be fatal. These small physical activities in a day will definitely help to have a longer life expectancy.
        
              In today's era, everyone wants a good and disease-free life. Through physical activity, we can avoid many diseases and it will even boost our mood.
        
              Doing any physical activity is better than doing none. If you are not physically active now, take this as a reminder and get started!
        
              Kamini (Student at ISHYA)`,
            image: Blog6,
          },
          {
            id: 7,
            title: "The Ripple Effect of Kindness: How One Act Can Inspire Many",
            writer: "Kamini",
            writerImg: "https://via.placeholder.com/50",
            date: "March 15, 2025",
            content: 
                `We all know that kindness is a virtue that should be practiced every day. But did you know that one act of kindness can have a ripple effect that inspires others to do the same? It's true! Whether it's holding the door open for someone, complimenting a stranger, or simply smiling at a passer-by, these small acts can create a positive chain reaction that spreads throughout our communities.
                
                The ripple effect of kindness is powerful and can have a significant impact on the world around us. In this article, we'll explore the science behind this phenomenon and how we can all contribute to creating a kinder, more compassionate society. So, let's dive in and discover how one small act of kindness can inspire many!
          
                What is the Ripple Effect of Kindness?
          
                The ripple effect of kindness refers to the way in which one act of kindness can create a chain reaction that inspires others to do the same. When we show kindness to others, we create a positive energy that spreads from person to person. This energy can have a powerful impact on the world around us, creating a sense of community and connection that is essential for our well-being.
          
                "The Science Behind Kindness
          
                As mentioned earlier, research has shown that acts of kindness can have a positive impact on our brains and our bodies. When we perform acts of kindness, our brains release oxytocin, a hormone that promotes feelings of love, connection, and happiness. This not only makes us feel good but can also have a positive effect on our physical health.
          
                Studies have also shown that performing acts of kindness can lead to a sense of purpose and meaning in life, which is essential for our overall well-being. This can lead to reduced stress levels, increased happiness, and a greater sense of fulfillment.
          
                How Kindness Benefits Everyone
          
                Kindness is not only beneficial for the person receiving the act of kindness but also for the person performing it. When we show kindness to others, we create a positive energy that can have a ripple effect, inspiring others to do the same. This can lead to a more compassionate and caring society, which is essential for our overall well-being.
          
                Additionally, performing acts of kindness can lead to a sense of purpose and meaning in life, which is essential for our mental and emotional health. It can also lead to increased happiness, reduced stress levels, and a greater sense of fulfillment.
          
                How to Spread Kindness in Your Community
          
                There are many ways to spread kindness in your community. Here are some ideas:
          
                Volunteer
                Volunteering is a great way to show kindness to others and make a positive impact in your community. There are many organizations that need volunteers, from local charities to national non-profits.
          
                Donate
                Donating to a charitable organization is another great way to show kindness to others. Whether it's donating money, clothes, or food, every little bit helps and can make a significant impact on someone's life.
          
                Be Kind to Your Neighbors
                Showing kindness to your neighbors is a simple but effective way to create a sense of community and connection. Whether it's helping with yard work, offering to watch their pets, or simply saying hello, these small acts of kindness can have a significant impact on their lives.
          
                Ways to Incorporate Kindness into Your Daily Life
          
                Incorporating kindness into your daily life doesn't have to be difficult. Here are some simple ways to spread kindness every day:
          
                • Smile - Smiling at someone can brighten their day and create a positive energy that spreads throughout the community.
                • Hold the Door Open - Holding the door open for someone is a simple act of kindness that can make a big difference in their day.
                • Compliment Someone - Giving someone a genuine compliment can boost their confidence and create a sense of positivity that spreads throughout the community.
          
                The Importance of Self-Kindness
          
                While showing kindness to others is important, it's also essential to show kindness to ourselves. Being kind to ourselves can lead to increased self-esteem, reduced stress levels, and improved mental and emotional health.
          
                Practice Self-Care
                "Taking care of ourselves is an essential part of self-kindness. This can include getting enough sleep, eating healthy food, and taking time to relax and recharge.
          
                Practice Self-Compassion
                "Being kind to ourselves means treating ourselves with the same compassion and understanding that we would show to a friend. This can involve practicing self-compassion meditation or simply being kind to ourselves in our thoughts and actions.
          
                Set Boundaries
                "Setting boundaries is an essential part of self-kindness. This means saying no to things that don't serve us and creating space for the things that do.
          
                Conclusion
          
                The ripple effect of kindness is a powerful phenomenon that can have a significant impact on our communities and our world. By performing acts of kindness, we create a positive energy that spreads from person to person, inspiring others to do the same.
                
                Whether it's volunteering, donating, or simply smiling at a stranger, these small acts can create a chain reaction that can change the world. So, let's all commit to spreading kindness and creating a more compassionate and caring society, one act of kindness at a time`,
              image: Blog7,
          },
      ];
      
const BlogDetails = () => {
  const { id } = useParams();
  const blog = blogPosts.find((b) => b.id === parseInt(id));

  const [likes, setLikes] = useState(0);

  if (!blog) {
    return <h2 className="error-message">Blog Not Found</h2>;
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Blurred Background */}
      <div className="blog-detail-hero" style={{ backgroundImage: `url(${blog.image})` }}>
        <div className="blog-hero-overlay">
          <h1>{blog.title}</h1>
          <p>
            <FaUser /> {blog.writer} &nbsp; | &nbsp;
            <FaCalendarAlt /> {blog.date}
          </p>
        </div>
      </div>

      {/* Blog Content Section */}
      <div className="blog-details-container">
        <div className="blog-detail-card">
          <img src={blog.image} alt={blog.title} className="blog-main-image" />
          <div className="blog-detail-text">
        {blog.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>  // Render each paragraph separately
        ))}
      </div>


          {/* Action Buttons */}
          <div className="blog-actions">
            <button className="like-button" onClick={() => setLikes(likes + 1)}>
              <FaHeart /> {likes} Likes
            </button>
            <button className="comment-button">
              <FaComment /> Comment
            </button>
            <button className="share-button">
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetails;
