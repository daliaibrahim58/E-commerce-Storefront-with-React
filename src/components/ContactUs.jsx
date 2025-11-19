import React, { useState } from "react";
// Import Icons from react-icons/md or similar library if needed,
// for simplicity in this pure HTML/CSS conversion, we'll use emojis
// or basic symbols for icons, or assume an icon library is imported.
// For the sake of a pure conversion without adding new libraries:

// Assuming icons are available via a basic asset/font or just using symbols.
const SendIcon = () => <span>&#9993;</span>; // Envelope/Send
const EmailOutlinedIcon = () => <span>📧</span>;
const PhoneOutlinedIcon = () => <span>📞</span>;
const ChatBubbleOutlineIcon = () => <span>💬</span>;
const LocationOnOutlinedIcon = () => <span>📍</span>;
const AccessTimeOutlinedIcon = () => <span>🕒</span>;
const QueryBuilderIcon = () => <span>❓</span>;

// --- Constants ---
const PRIMARY_GREEN = "#00A53E";
const LIGHT_GREEN_BG = "#F0F9F5";
const GRAY_BG = "#F7F7F7";
const GRAY_BORDER = "#BCACAC";

// --- Styles (Can be moved to an external CSS file: ContactUs.css) ---
const styles = {
  container: {
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: GRAY_BG,
  },
  innerBox: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "4px",
  },
  header: {
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    backgroundColor: GRAY_BG,
    margin: "16px 0",
  },
  section: {
    marginBottom: "32px",
  },
  formRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "8px", // Spacing between rows
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    flex: "1", // Allows fields to take equal space in a row
    marginBottom: "16px", // Spacing between individual fields/groups
  },
  formGroupFull: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: "16px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "4px",
  },
  input: {
    padding: "8px 12px",
    border: `1px solid ${GRAY_BORDER}`,
    borderRadius: "4px",
    fontSize: "16px",
    backgroundColor: "white",
  },
  textarea: {
    padding: "8px 12px",
    border: `1px solid ${GRAY_BORDER}`,
    borderRadius: "4px",
    fontSize: "16px",
    backgroundColor: "white",
    resize: "vertical",
    minHeight: "100px",
  },
  select: {
    padding: "8px 12px",
    border: `1px solid ${GRAY_BORDER}`,
    borderRadius: "4px",
    fontSize: "16px",
    backgroundColor: "white",
    appearance: "none", // Remove default browser styling for a cleaner look
  },
  button: {
    backgroundColor: PRIMARY_GREEN,
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: PRIMARY_GREEN,
    opacity: 0.9,
  },
  contactCardWrapper: {
    border: `1px solid ${GRAY_BG}`,
    borderRadius: "4px",
    backgroundColor: "white",
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    padding: "16px",
    gap: "16px",
    borderBottom: `1px solid ${GRAY_BG}`,
  },
  cardIcon: {
    color: PRIMARY_GREEN,
    fontSize: "30px",
    marginTop: "2px",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  cardInfo: {
    color: "gray",
    fontSize: "14px",
    marginBottom: "4px",
  },
  cardDescription: {
    color: PRIMARY_GREEN,
    fontSize: "14px",
  },
  cardTime: {
    color: "gray",
    fontSize: "12px",
  },
  faqItem: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "4px",
    border: `1px solid ${GRAY_BG}`,
    height: "100%",
    textAlign: "left",
  },
  faqQuestion: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "8px",
  },
  faqAnswer: {
    color: "gray",
    fontSize: "14px",
  },
  faqGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
  },
  faqGridItem: {
    flex: "1 1 calc(50% - 12px)", // Two columns layout with gap
    minWidth: "300px",
  },
  footer: {
    backgroundColor: LIGHT_GREEN_BG,
    padding: "24px",
    textAlign: "center",
    borderRadius: "8px",
    marginTop: "16px",
  },
  footerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "4px",
  },
  footerIcon: {
    marginRight: "8px",
    color: PRIMARY_GREEN,
  },
  inlineIcon: {
    marginRight: "8px",
    color: PRIMARY_GREEN,
    fontSize: "20px",
  },
};

// --- Reusable Components (Plain HTML/CSS) ---
const FAQItem = ({ question, answer }) => (
  <div style={styles.faqItem}>
    <h3 style={styles.faqQuestion}>{question}</h3>
    <p style={styles.faqAnswer}>{answer}</p>
  </div>
);

const ContactCard = ({ Icon, title, description, info, time }) => (
  <div style={styles.card}>
    <div style={styles.cardIcon}>
      <Icon />
    </div>
    <div>
      <p style={styles.cardTitle}>{title}</p>
      <p style={styles.cardInfo}>{info}</p>
      <p style={styles.cardDescription}>{description}</p>
      <p style={styles.cardTime}>{time}</p>
    </div>
  </div>
);

// --- Main Component ---
function ContactUs() {
  const [category, setCategory] = useState("");

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        {/* Header */}
        <div style={styles.header}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Contact Us
          </h1>
          <p style={{ color: "gray", fontSize: "16px" }}>
            We're here to help with any questions about our products or your
            sustainable journey
          </p>
        </div>

        <div style={styles.divider} />

        {/* Contact Form */}
        <div style={styles.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={styles.inlineIcon}>
              <SendIcon />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Send us a Message
            </h2>
          </div>

          {/* Form Structure (Simulating Grid with Flex) */}
          <form>
            {/* First Row: Name + Email */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Remaining Fields stacked */}
            <div style={styles.formGroupFull}>
              <label style={styles.label} htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.select}
              >
                <option value="" disabled hidden>
                  Select a category
                </option>
                <option value={10}>Order Inquiry</option>
                <option value={20}>Product Information</option>
                <option value={30}>Sustainability</option>
              </select>
            </div>

            <div style={styles.formGroupFull}>
              <label style={styles.label} htmlFor="subject">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                placeholder="Brief description of your inquiry"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroupFull}>
              <label style={styles.label} htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                placeholder="Please provide details about your inquiry..."
                style={styles.textarea}
                rows={4}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <button
                type="submit"
                style={styles.button}
                onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
                onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Get in Touch */}
        <div style={styles.section}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Get in Touch
          </h2>
          <div style={styles.contactCardWrapper}>
            <ContactCard
              Icon={EmailOutlinedIcon}
              title="Email Support"
              description="support@ecomarket.com"
              info="Get help with orders, returns, and general questions"
              time="24-48 hours"
            />
            <ContactCard
              Icon={PhoneOutlinedIcon}
              title="Phone Support"
              description="+1 (555) 123-4567"
              info="Speak directly with our customer service team"
              time="Mon-Fri, 9AM-6PM EST"
            />
            <ContactCard
              Icon={ChatBubbleOutlineIcon}
              title="Live Chat"
              description="Available on website"
              info="Instant help for urgent questions"
              time="Mon-Fri, 9AM-6PM EST"
            />
          </div>
        </div>

        {/* Visit Us */}
        <div style={styles.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div style={{ ...styles.inlineIcon, fontSize: "30px" }}>
              <LocationOnOutlinedIcon />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Visit Us</h2>
          </div>
          <div
            style={{
              padding: "16px",
              border: `1px solid ${GRAY_BG}`,
              borderRadius: "4px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontWeight: "bold" }}>EcoMarket Headquarters</p>
              <p style={{ color: "gray" }}>123 Sustainable Street</p>
              <p style={{ color: "gray" }}>Green Valley, CA 94042</p>
              <p style={{ color: "gray" }}>United States</p>
            </div>
            <div style={styles.divider} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginTop: "16px",
              }}
            >
              <div style={{ ...styles.inlineIcon, fontSize: "24px" }}>
                <AccessTimeOutlinedIcon />
              </div>
              <div>
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Business Hours
                </p>
                <p style={{ color: "gray" }}>
                  Monday - Friday: 9:00 AM - 6:00 PM PST
                </p>
                <p style={{ color: "gray" }}>
                  Saturday: 10:00 AM - 4:00 PM PST
                </p>
                <p style={{ color: "gray" }}>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={styles.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ ...styles.inlineIcon, color: "black" }}>
              <QueryBuilderIcon />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={styles.faqGrid}>
            {[
              {
                question: "What makes your products eco-friendly?",
                answer:
                  "All our products are carefully vetted for sustainability...",
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes, we ship to over 50 countries worldwide...",
              },
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy...",
              },
              {
                question: "How do you ensure product quality?",
                answer: "We work directly with certified suppliers...",
              },
            ].map((faq, index) => (
              <div key={index} style={styles.faqGridItem}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <p style={{ color: "gray", marginBottom: "8px" }}>
              Can't find what you're looking for?
            </p>
            <button
              style={{
                padding: "8px 16px",
                border: `1px solid ${GRAY_BORDER}`,
                borderRadius: "4px",
                backgroundColor: "white",
                color: "black",
                textTransform: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = PRIMARY_GREEN;
                e.currentTarget.style.backgroundColor = LIGHT_GREEN_BG;
                e.currentTarget.style.color = PRIMARY_GREEN;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = GRAY_BORDER;
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "black";
              }}
            >
              View All FAQs
            </button>
          </div>
        </div>
      </div>

      {/* Response Time Footer */}
      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerIcon}>
            <AccessTimeOutlinedIcon />
          </div>
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            Average Response Time: 2-4 hours during business hours
          </p>
        </div>
        <p style={{ color: "gray", fontSize: "14px" }}>
          We're committed to providing excellent customer service and will
          respond to your inquiry as quickly as possible.
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
