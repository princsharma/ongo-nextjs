"use client";

const Obleft = () => {
  return (
    <div className="ob-left">

      <div className="ob-brand">
        <div className="ob-brand-dot" />
        <span className="ob-brand-name">Ongo</span>
      </div>

      <div className="ob-left-content">
        <p className="ob-left-tag">Medical Weight Loss</p>

        <h2 className="ob-left-headline">
          Start your<br />
          <span>transformation</span><br />
          journey today
        </h2>

        <p className="ob-left-desc">
          Personalized GLP-1 weight loss programs designed by doctors, built for real results.
        </p>

        <div className="ob-testimonial">
          <p className="ob-testimonial-text">
            "I lost 18kg in 4 months. The process was easy and the doctors were incredibly supportive throughout."
          </p>

          <div className="ob-testimonial-author">
            <div className="ob-testimonial-avatar">SK</div>
            <div>
              <div className="ob-testimonial-name">Sarah K.</div>
              <div className="ob-testimonial-result">Lost 18kg in 4 months</div>
            </div>
          </div>
        </div>
      </div>

      <div className="ob-left-footer">
        <div className="ob-stat-item">
          <span className="ob-stat-number">12k+</span>
          <span className="ob-stat-label">Patients helped</span>
        </div>

        <div className="ob-stat-item">
          <span className="ob-stat-number">94%</span>
          <span className="ob-stat-label">Success rate</span>
        </div>

        <div className="ob-stat-item">
          <span className="ob-stat-number">4.9★</span>
          <span className="ob-stat-label">Patient rating</span>
        </div>
      </div>

    </div>
  );
};

export default Obleft;