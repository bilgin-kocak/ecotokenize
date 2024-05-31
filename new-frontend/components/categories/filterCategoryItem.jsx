import React, { useEffect } from 'react';
import { trendingCategoryData } from '../../data/categories_data';
import Collection_category_filter from '../collectrions/collection_category_filter';
import CategoryItem from './categoryItem';
import { useDispatch } from 'react-redux';
import { updateTrendingCategoryItemData } from '../../redux/counterSlice';
import { getAllNfts } from '../../utils/api';
import { useAddress } from '@thirdweb-dev/react';

const FilterCategoryItem = () => {
  const dispatch = useDispatch();
  const address = useAddress();

  useEffect(() => {
    // dispatch(updateTrendingCategoryItemData(trendingCategoryData.slice(0, 8)));
  }, []);

  useEffect(() => {
    const getAllNfts_ = async () => {
      console.log('address', address);
      let data = await getAllNfts(address);
      data = data.map((item) => {
        return {
          ...item,
          type: 'unlisted',
        };
      });
      dispatch(updateTrendingCategoryItemData(data.slice(0, 8)));
      console.log('tokens', data);
    };
    if (address) {
      getAllNfts_();
    }
  }, [address]);

  return (
    <div>
      {/* <!-- Filter --> */}
      <Collection_category_filter />
      <CategoryItem />
    </div>
  );
};

export default FilterCategoryItem;
