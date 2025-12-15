"use client";

import React, { useState } from "react";
import {
  MdSend,
  MdEmail,
  MdPhone,
  MdChatBubbleOutline,
  MdLocationOn,
  MdAccessTime,
  MdQuestionAnswer,
} from "react-icons/md";

const ContactPage = () => {
  const [category, setCategory] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    category: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: fullName.trim() ? "" : "Full Name is required",
      email: email.trim()
        ? validateEmail(email)
          ? ""
          : "Invalid email"
        : "Email is required",
      subject: subject.trim() ? "" : "Subject is required",
      message: message.trim() ? "" : "Message is required",
      category: category ? "" : "Category is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => err === "")) {
      alert("Message sent successfully!");
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCategory("");
    }
  };

  return (
    <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-8 font-sans">

      {/* Main Contact Box */}
      <div className="bg-white py-10 rounded-lg max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Contact Us</h1>
            <p className="text-gray-600">
              We're here to help with any questions about our products or your sustainable journey.
            </p>
          </div>

          <div className="h-px bg-gray-200 my-6" />

          {/* Contact Form */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <MdSend className="text-green-600 text-2xl mr-2" />
              <h2 className="text-xl font-bold">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Name + Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1">Full Name *</label>
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                  <input
                    type="text"
                    className={`p-2 border rounded-md text-base ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1">Email Address *</label>
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  <input
                    type="text"
                    className={`p-2 border rounded-md text-base ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col mt-4">
                <label className="font-semibold text-sm mb-1">Category</label>
                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-base"
                >
                  <option value="">Select a category</option>
                  <option value="10">Order Inquiry</option>
                  <option value="20">Product Information</option>
                  <option value="30">Sustainability</option>
                </select>
              </div>

              {/* Subject */}
              <div className="flex flex-col mt-4">
                <label className="font-semibold text-sm mb-1">Subject *</label>
                {errors.subject && <p className="text-red-500 text-xs">{errors.subject}</p>}
                <input
                  type="text"
                  className={`p-2 border rounded-md text-base ${errors.subject ? "border-red-500" : "border-gray-300"}`}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your inquiry"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col mt-4">
                <label className="font-semibold text-sm mb-1">Message *</label>
                {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                <textarea
                  rows={4}
                  className={`p-2 border rounded-md text-base resize-y ${errors.message ? "border-red-500" : "border-gray-300"}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white p-3 rounded-md font-bold w-full mt-6 hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Get in Touch */}
      <div className="my-16 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-4 px-4">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">

          {/* Email */}
          <div className="flex p-4 bg-white rounded-md border items-start gap-4">
            <MdEmail className="text-green-600 text-3xl" />
            <div>
              <p className="font-bold">Email Support</p>
              <p className="text-gray-600">Help with orders & general questions</p>
              <p className="text-green-600">support@ecomarket.com</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex p-4 bg-white rounded-md border items-start gap-4">
            <MdPhone className="text-green-600 text-3xl" />
            <div>
              <p className="font-bold">Phone Support</p>
              <p className="text-gray-600">Speak with our team</p>
              <p className="text-green-600">+1 (555) 123-4567</p>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex p-4 bg-white rounded-md border items-start gap-4">
            <MdChatBubbleOutline className="text-green-600 text-3xl" />
            <div>
              <p className="font-bold">Live Chat</p>
              <p className="text-gray-600">Instant help</p>
              <p className="text-green-600">Available on website</p>
            </div>
          </div>

        </div>
      </div>

      {/* Visit Us */}
      <div className="my-20 max-w-7xl mx-auto px-4">

        <div className="flex items-center mb-3">
          <MdLocationOn className="text-green-600 text-2xl mr-2" />
          <h2 className="text-xl font-bold">Visit Us</h2>
        </div>

        <div className="bg-white border rounded-md p-6">

          <div className="mb-6">
            <p className="font-bold">EcoMarket Headquarters</p>
            <p className="text-gray-600">123 Sustainable Street</p>
            <p className="text-gray-600">Green Valley, CA 94042</p>
          </div>

          <div className="h-px bg-gray-200 my-4" />

          <div className="flex items-start gap-4">
            <MdAccessTime className="text-green-600 text-xl mt-1" />
            <div>
              <p className="font-bold">Business Hours</p>
              <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
              <p className="text-gray-600">Sat: 10AM - 4PM</p>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ */}
      <div className="my-20 max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-4">
          <MdQuestionAnswer className="text-green-600 text-2xl mr-2" />
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { question: "What makes your products eco-friendly?", answer: "All our products are carefully vetted..." },
            { question: "Do you offer international shipping?", answer: "Yes, we ship to 50+ countries..." },
            { question: "What is your return policy?", answer: "We offer a 30-day return policy..." },
            { question: "How do you ensure quality?", answer: "We work directly with certified suppliers..." },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-4 border rounded-md">
              <p className="font-bold mb-2">{faq.question}</p>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Response Time */}
      <div className="bg-green-50 p-6 rounded-md text-center max-w-5xl mx-auto">
        <div className="flex justify-center items-center gap-2 mb-2">
          <MdAccessTime className="text-green-600 text-xl" />
          <p className="font-bold">Average Response Time: 2–4 hours</p>
        </div>
        <p className="text-gray-600 text-sm">
          We respond as quickly as possible during business hours.
        </p>
      </div>

    </div>
  );
};

export default ContactPage;
