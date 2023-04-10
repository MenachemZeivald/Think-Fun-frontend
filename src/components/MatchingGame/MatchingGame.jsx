import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import GameCard from '../GameCard';

export default function MatchingGame() {
  const [choosenCategory, setChoosenCategory] = useState('');
  const [categoryArr, setCategoryArr] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get(`/categories/`);
      console.log(response.data);
      setCategoryArr(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // TODO: choose both on the same page
  // TODO: call cards from here with category as props
  return (
    <>
      <GameCard bgImg='' name='6 cards' link />
      <GameCard bgImg='' name='12 cards' link />
      <GameCard bgImg='' name='18 cards' link />
      <div>
        <select onChange={(e) => setChoosenCategory(e.target.value)}>
          <option value=''>categories</option>
          {categoryArr.map((item) => (
            <option value={item.category_id}>{item.name}</option>
          ))}
        </select>
      </div>
    </>
  );
}
