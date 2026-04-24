export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <div className="logo">
            <span className="logo-dot"></span>
            Ongo
          </div>

          <p className="footer-desc">
            Licensed telemedicine provider bringing FDA-approved GLP-1 medications (Zepbound®, Mounjaro®, Wegovy®, Ozempic®, Rybelsus®, Liraglutide) straight to your door.
          </p>

          <div className="footer-contact">
            <a href="tel:+18886555267">📞 +1 (888) 655-5267</a>
            <a href="mailto:info@ongoweightloss.com">✉️ info@ongoweightloss.com</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Medications</h4>
          <a href="#">Wegovy®</a>
          <a href="#">Zepbound®</a>
          <a href="#">Ozempic®</a>
          <a href="#">Mounjaro®</a>
          <a href="#">Rybelsus®</a>
          <a href="#">Liraglutide</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Our Doctors</a>
          <a href="#">Resource Hub</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Medical Disclaimer</a>
          <a href="#">HIPAA Notice</a>
          <a href="#">Refund Policy</a>
          <a href="#">Shipping Policy</a>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 Ongo Weight Loss. All rights reserved.</span>

        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Medical Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}
