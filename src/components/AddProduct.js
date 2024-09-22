import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState([]);
  const [occasion, setOccasion] = useState([]);
  const [gender, setgender] = useState([]);
  const [company, setCompany] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [sizes, setSizes] = useState([]);
  const [products, setProducts] = useState([]); // State to store fetched products

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = "";
      if (photo) {
        // Upload photo to Firebase Storage
        const storageRef = ref(storage, `products/${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Add product data to Firestore
      await addDoc(collection(db, "products"), {
        name,
        photo: photoURL,
        type,
        occasion,
        gender,
        company,
        deliveryDate: new Date(deliveryDate),
        availableSizes: sizes,
      });

      alert("Product added successfully!");
      fetchProducts(); // Fetch updated products after adding new one
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="Product Type"
          value={type}
          onChange={(e) => setType(e.target.value.split(","))}
          required
        />
        <input
          type="text"
          placeholder="Occasion"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value.split(","))}
          required
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setgender(e.target.value.split(","))}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Available Sizes"
          value={sizes}
          onChange={(e) => setSizes(e.target.value.split(","))}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <h2>Added Products</h2>
      <div>
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <h3>{product.name}</h3>
                {product.photo && <img src={product.photo} alt={product.name} width="100" />}
                <p>Type: {product.type.join(", ")}</p>
                <p>Occasion: {product.occasion.join(", ")}</p>
                <p>Company: {product.company}</p>
                <p>Delivery Date: {new Date(product.deliveryDate.seconds * 1000).toLocaleDateString()}</p>
                <p>Available Sizes: {product.availableSizes.join(", ")}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
