import './Footer.css'
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api";

function Footer() {

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/restaurants`);
      // endpoint returns a list; use the first restaurant
      return Array.isArray(res.data) ? res.data[0] : res.data;
    },
  });

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo */}
        <div className="footer-logo">
          <h2>{restaurant?.name ?? "Savor"}</h2>
          <span>Diner</span>
        </div>

        {/* Top row */}
        <div className="footer-top">
          {restaurant?.address && (
            <div className="footer-info">
              <FaMapMarkerAlt />
              <span>{restaurant.address}</span>
            </div>
          )}

          {restaurant?.phone && (
            <div className="footer-info">
              <FaPhoneAlt />
              <span>{restaurant.phone}</span>
            </div>
          )}
        </div>

        {/* Social */}
        <div className="social-wrapper">
          <p>Follow us:</p>
          {restaurant?.whatsapp && (
            <a
              href={restaurant.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="social-btn whatsapp"
            >
              <FaWhatsapp />
            </a>
          )}

          {restaurant?.instagram && (
            <a
              href={restaurant.instagram}
              target="_blank"
              rel="noreferrer"
              className="social-btn instagram"
            >
              <FaInstagram />
            </a>
          )}
        </div>

        <div className="divider" />

        {/* Bottom */}
        <div className="footer-bottom">
          <p>Developed by Doaa Khashab</p>
          <p>© 2026 All rights reserved</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer;