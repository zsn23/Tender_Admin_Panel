import { useState, useEffect } from "react";
import axios from "axios";
import BaseUrl from "../api/BaseUrl"; // Ensure this is correct

const SliderComponent = () => {
  const [isVisible, setIsVisible] = useState(true); // To toggle visibility
  const [lastScrollY, setLastScrollY] = useState(0); // To track scroll position

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
 

  const Base_Url = BaseUrl(); // Ensure BaseUrl is returning a valid URL

  // Fetch settings from the API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${Base_Url}/Settings`);
        const settingData = response.data.data;
        console.log(response);
        console.log(settingData);
        setSettings(settingData); // Assuming settingData is an array
      } catch (err) {
        console.error("Error fetching Settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [Base_Url]);

  // Scroll event listener to detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY); // Show/hide based on scroll
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`border-bottom border-top g-0 row p-0 slider-container ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      {loading || settings.length === 0 ? (
        <div className="marquee_msg slider-wrapper">
          {/* Dummy content to show until data is loaded */}
          <span className="slider-message">-WELCOME TO BISMILLAH TENDER WEBSITE</span>
          <span className="slider-message">Your Gateway to Exclusive Tender Opportunities</span>
        </div>
      ) : (
        <div className="marquee_msg slider-wrapper">
          {settings.map((item) => (
            <span key={item.id} className="slider-message">
              {item.sliderMessage}
            </span>
          ))}
          {/* Duplicate messages to ensure continuous scrolling */}
          {settings.map((item) => (
            <span key={`${item.id}-duplicate`} className="slider-message">
              {item.sliderMessage}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderComponent;
