import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };
  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_PRESET);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData
      );
      setProduct({ ...product, imageUrl: res.data.secure_url });
      setImagePreview(res.data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };
  const fileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.imageUrl) {
      alert('Please upload an image');
      return;
    }
    if (!product.name || !product.price || !product.description || !product.category) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        setProduct({
          name: '',
          price: '',
          description: '',
          category: '',
          imageUrl: '',
        });
        setImagePreview(null);
        alert('Product added successfully!');
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-20">
      <div className="max-w-4xl mx-auto px-4 pt-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 
                          ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/50'}`}
              >
                <input
                  type="file"
                  onChange={fileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg mx-auto shadow-lg"
                    />
                    <div className="mt-4 text-white/80">
                      Click or drag to replace image
                    </div>
                  </div>
                ) : (
                  <div className="text-white/80">
                    <svg className="w-12 h-12 mx-auto mb-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg mb-2">Drag and drop an image here, or click to select</p>
                    <p className="text-sm text-white/60">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-2 text-sm">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2 text-sm">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="food">Food</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2 text-sm">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-medium text-white transition-all duration-300 
                         bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddProduct;
