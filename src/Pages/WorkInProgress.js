import { useEffect, useState } from "react";
import { Loader2} from "lucide-react";
import '../Styles/WorkInProgress.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import constructionImg from "../Images/constructionImg.png";
import construction from "../Images/construction.png";

export default function WorkInProgress() {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <><Navbar/>
    <div className="container-work">
    <img src={construction} alt="construction" className="construction" />
      <div className="dialog-box-work">
        <h1 className="dialog-title-work">Page Under Construction{dots}</h1>
        <p className="dialog-message">
        Empowering young minds through education! We're working on something wonderful to create brighter futures. Stay tuned!
        </p>
        <Loader2 className="loader-icon" size={50} />
        <img src={constructionImg} alt="Under Construction" className="construction-img" />
    </div>
      </div>
    <Footer/>
    </>
  );
}
