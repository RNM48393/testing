import React, { useState } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Invoice created successfully!');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-preview');
    const opt = {
      margin: 1,
      filename: `invoice-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl mt-[40px] font-bold text-center mb-10 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Create New Invoice
      </h1>
      {/* Keep your existing form UI here */}
    </div>
  );
};

export default CreateInvoice; 