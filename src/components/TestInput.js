// import React, { useState, useEffect, useRef } from 'react';
// import { collection, getDocs } from "firebase/firestore";
// import { db } from '../firebase';
// import './TestInput.css'; // Your updated CSS file
// import botIcon from '../meesho.png'
// import userIcon from '../user.png'
// import AddProduct from './AddProduct'

// const WordExtractor = () => {
//   const [inputText, setInputText] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     // Initial bot message when the page loads
//     setConversation([
//       { type: 'bot', message: 'Hi Meesho Assistant this side ! What would you like to buy today ?' }
//     ]);
//   }, []);

//   useEffect(() => {
//     // Scroll to the bottom whenever the conversation updates
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [conversation]);

//   const handleInputChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (inputText.trim() === '') return;
//     setConversation(prevConversation => [
//       ...prevConversation,
//       { type: 'user', message: inputText }
//     ]);
//     extractWords(inputText);
//     setInputText('');
//   };

//   const extractWords = (query) => {
//     const wordArray = query
//       .toLowerCase()
//       .replace(/[^\w\s]/gi, '')
//       .split(' ')
//       .filter(word => word.length > 2);
//     searchProducts(wordArray);
//   };
//   const searchProducts = async (wordArray) => {
//     try {
//       const productsRef = collection(db, 'products');
//       const querySnapshot = await getDocs(productsRef);
//       const rankedProducts = querySnapshot.docs.map(doc => {
//         const product = doc.data();
//         const fieldsToSearch = {
//           company: product.company?.toLowerCase(),
//           type: product.type?.join(' ').toLowerCase(),
//           occasion: product.occasion?.join(' ').toLowerCase(),
//           gender: product.gender?.map(g => g.toLowerCase()) // Map gender array to lowercase
//         };
//         let score = 0;
  
//         // Add score based on word matches, with gender getting the highest preference
//         if (wordArray.some(word => fieldsToSearch.gender?.includes(word))) score += 10;  // Highest score
//         if (wordArray.some(word => fieldsToSearch.company?.includes(word))) score += 5;
//         if (wordArray.some(word => fieldsToSearch.type?.includes(word))) score += 9;
//         if (wordArray.some(word => fieldsToSearch.occasion?.includes(word))) score += 4;
  
//         return { id: doc.id, ...product, score };
//       });
  
//       // Filter and sort products by score
//       const sortedProducts = rankedProducts
//         .filter(product => product.score > 0)
//         .sort((a, b) => b.score - a.score);
  
//       if (sortedProducts.length > 0) {
//         setConversation(prevConversation => [
//           ...prevConversation,
//           {
//             type: 'bot',
//             message: 'Here are some products you requested and the related products',
//             products: sortedProducts
//           }
//         ]);
//       } else {
//         setConversation(prevConversation => [
//           ...prevConversation,
//           { type: 'bot', message: 'Sorry, no matching products found.' }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error searching products: ', error);
//     }
//   };

//   return (
//     <div className="chat-container">
//     <div className="chat-window">
//       <div className="conversation">
//         {conversation.map((chat, index) => (
//           <div key={index} className={`chat-bubble ${chat.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
//             {chat.type === 'user' ? (
//               <img src={userIcon} alt="User Icon" className="chat-icon" />
//             ) : (
//               <img src={botIcon} alt="Bot Icon" className="chat-icon" />
//             )}
//             <div className="chat-message">
//               <p>{chat.message}</p>
//               {chat.products && (
//                 <div className="product-cards" ref={chatEndRef}>
//                     {chat.products.map((product) => (
//                     <div key={product.id} className="product-card">
//                         {product.photo && (
//                         <img src={product.photo} alt={product.name} className="product-image" />
//                         )}
//                         <div className="product-info">
//                         <h3>{product.name}</h3>
//                         {/* <p><strong>Type:</strong> {product.type.join(", ")}</p> */}
//                         {/* <p><strong>Occasion:</strong> {product.occasion.join(", ")}</p> */}
//                         <p><strong>Company:</strong> {product.company}</p>
//                         <p><strong>Delivery Date:</strong> {new Date(product.deliveryDate.seconds * 1000).toLocaleDateString()}</p>
//                         <p><strong>Available Sizes:</strong> {product.availableSizes.join(", ")}</p>
//                         {/* <p><strong> Score:</strong> {product.score}</p> */}
//                         </div>
//                     </div>
//                     ))}
//                 </div>
//                 )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     <div className="input-area">
//       <input 
//         type="text" 
//         value={inputText} 
//         onChange={handleInputChange} 
//         placeholder="Type your message..." 
//       />
//       <button onClick={handleSendMessage}>Send</button>
//     </div>
//   </div>
//   );
// };

// export default WordExtractor;



import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import './TestInput.css'; // Your updated CSS file
import botIcon from '../meesho.png';
import userIcon from '../user.png';
import AddProduct from './AddProduct';

const WordExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Initial bot message when the page loads
    setConversation([
      { type: 'bot', message: 'Hi Meesho Assistant this side ! What would you like to buy today ?' }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever the conversation updates
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    setConversation(prevConversation => [
      ...prevConversation,
      { type: 'user', message: inputText }
    ]);
    extractWords(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const extractWords = (query) => {
    const wordArray = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(word => word.length > 2);
    searchProducts(wordArray);
  };

  const searchProducts = async (wordArray) => {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      const rankedProducts = querySnapshot.docs.map(doc => {
        const product = doc.data();
        const fieldsToSearch = {
          company: product.company?.toLowerCase(),
          type: product.type?.join(' ').toLowerCase(),
          occasion: product.occasion?.join(' ').toLowerCase(),
          gender: product.gender?.map(g => g.toLowerCase()) // Map gender array to lowercase
        };
        let score = 0;

        // Add score based on word matches, with gender getting the highest preference
        if (wordArray.some(word => fieldsToSearch.gender?.includes(word))) score += 10;  // Highest score
        if (wordArray.some(word => fieldsToSearch.company?.includes(word))) score += 5;
        if (wordArray.some(word => fieldsToSearch.type?.includes(word))) score += 9;
        if (wordArray.some(word => fieldsToSearch.occasion?.includes(word))) score += 4;

        return { id: doc.id, ...product, score };
      });

      // Filter and sort products by score
      const sortedProducts = rankedProducts
        .filter(product => product.score > 0)
        .sort((a, b) => b.score - a.score);

      if (sortedProducts.length > 0) {
        setConversation(prevConversation => [
          ...prevConversation,
          {
            type: 'bot',
            message: 'Here are some products you requested and the related products',
            products: sortedProducts
          }
        ]);
      } else {
        setConversation(prevConversation => [
          ...prevConversation,
          { type: 'bot', message: 'Sorry, no matching products found.' }
        ]);
      }
    } catch (error) {
      console.error('Error searching products: ', error);
    }
  };

  return (
    <div className="chat-container">
      {/* Heading and description section */}
      <div className="heading">
        <h1>Virtual Assistance Chatbot Prototype</h1>
        <p className="description">
          This is a prototype; thus we have limited products such as T-shirts and shirts for men and women, 
          sarees, kurtis, lehengas, dresses and toys for kids, home decor items such as curtains, bedsheets, 
          cosmetics, creams, footwear, etc.
        </p>
      </div>
      
      <div className="chat-window">
        <div className="conversation">
          {conversation.map((chat, index) => (
            <div key={index} className={`chat-bubble ${chat.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              {chat.type === 'user' ? (
                <img src={userIcon} alt="User Icon" className="chat-icon" />
              ) : (
                <img src={botIcon} alt="Bot Icon" className="chat-icon" />
              )}
              <div className="chat-message">
                <p>{chat.message}</p>
                {chat.products && (
                  <div className="product-cards" ref={chatEndRef}>
                      {chat.products.map((product) => (
                      <div key={product.id} className="product-card">
                          {product.photo && (
                          <img src={product.photo} alt={product.name} className="product-image" />
                          )}
                          <div className="product-info">
                          <h3>{product.name}</h3>
                          <p><strong>Company:</strong> {product.company}</p>
                          <p><strong>Delivery Date:</strong> {new Date(product.deliveryDate.seconds * 1000).toLocaleDateString()}</p>
                          <p><strong>Available Sizes:</strong> {product.availableSizes.join(", ")}</p>
                          </div>
                      </div>
                      ))}
                  </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="input-area">
        <input 
          type="text" 
          value={inputText} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown} // Listen for Enter key press
          placeholder="Type your message..." 
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default WordExtractor;
