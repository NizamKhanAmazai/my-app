'use client';

import GlassesProductDetail from '@/components/GlassProduct';
import WatchProductDetail from '@/components/WatchProduct';
import { useParams } from 'next/navigation';

const Page = () => {
  const id = useParams()
  const productId = id.id;

  console.log(productId);

  return (
    <div>
      {productId === "glasses" ? (
        <GlassesProductDetail />
      ) : productId === "watch" && (
        <WatchProductDetail />
      ) }
    </div>
  );
};

export default Page;