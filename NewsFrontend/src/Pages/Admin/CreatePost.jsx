import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosCreate } from "react-icons/io";
const CreatePost = () => {
    const [formData,setFormData]=useState({
        title:"",
        category:"",
        content:"",
        image:"",
    })
    const navigate=useNavigate();
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData(prev=>({
            ...prev,[name]:value,
        }));
    }
    
    const handleImageChange=(e)=>{
        setFormData(prev=>({
            ...prev,
            image:e.target.files[0],
        }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("content", formData.content);
        formDataToSend.append("file", formData.image);
        try {
            const response = await axios.post("http://localhost:5000/api/post/createPost", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response.data);
            if(response.status===201){
                alert("Post created successfully");
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }
    return (
        <div className='p-6 flex flex-col items-center '>
            <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl w-full">
             <IoIosCreate className="text-[#0065B3] text-2xl" />
             <h1 className="text-2xl font-semibold text-gray-800">Create Post</h1>
           </div>
            <form onSubmit={handleSubmit} className='max-w-2xl bg-white p-6 rounded-lg shadow-2xl w-full'>
                <div className='mb-4'>
                    <label className='block text-base font-bold text-gray-700 mb-2'>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}

                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-base font-bold mb-2'>Category:</label>
                    <select name='category' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3] ' value={formData.category} onChange={handleChange}>
                    <option value="">Select a Category</option>
                        <option value="News">समाचार</option>
                        <option value="Economy">अर्थ</option>
                        <option value="Bichar">बिचार</option>
                        <option value="Health">स्वास्थ्य</option>
                        <option value="Entertainment">मनोरञ्जन</option>
                        <option value="Education">शिक्षा</option>
                        <option value="Sports">खेलकुद</option>
                        <option value="Feature">फिचर</option>
                    </select>
                </div>
<div className='mb-4'>
    <label className='block text-gray-700 text-base font-bold mb-2'>Content:</label>
    <textarea name='content' rows={10} value={formData.content} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3] text-decoration-none '></textarea>
</div>
<div className='mb-4'>
    <label className='block text-gray-700 text-base font-bold mb-2'>Image:</label>
    <input type='file' onChange={handleImageChange} className='w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3] '/>
</div>
<div>
    <button className='bg-[#F05922] text-white px-6 py-2 rounded-lg hover:bg-[#0065B3]'>Create Post</button>
</div>
            </form>
        </div>
    )
}
export default CreatePost;