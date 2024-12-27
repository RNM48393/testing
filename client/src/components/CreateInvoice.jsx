import React, { useState } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { wagmiAbi } from './abi';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { walletClient } from './config';

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { address } = useAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      const { request } = await walletClient.simulateContract({
        account: address,
        address: "0xF426eBf74b4546d8d81fA2F0B4B6929dD9437114",
        abi: wagmiAbi,
        functionName: 'createInvoice',
        args: [formData.recipient, parseEther(formData.amount)],
      });

      const hash = await walletClient.writeContract(request);
      console.log('Transaction Hash:', hash);
      
      setSuccess('Invoice created successfully!');
      setFormData({ recipient: '', amount: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to submit the form. Please try again.');
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
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Create New Invoice
        </h1>
        <p className="text-gray-600 mt-2">Fill in the details below to generate an invoice</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="0x..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (BNB)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.0"
                step="0.000000000000000001"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="text-emerald-500 text-sm">
                {success}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-teal-700'}
                transition-all shadow-md hover:shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Create Invoice'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <div id="invoice-preview" className="mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Invoice Preview</h2>
              <p className="text-gray-500">#{Date.now().toString().slice(-6)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium text-gray-800">{address || 'Connect Wallet'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium text-gray-800">
                  {formData.recipient || 'Recipient Address'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-800">
                  {formData.amount ? `${formData.amount} BNB` : '0 BNB'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 border-2 border-emerald-600 text-emerald-700 rounded-lg font-medium
              hover:bg-emerald-50 transition-all"
          >
            Download PDF
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateInvoice; 