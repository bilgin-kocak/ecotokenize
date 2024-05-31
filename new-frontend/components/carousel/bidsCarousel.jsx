import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import 'tippy.js/dist/tippy.css';
import { bidsData } from '../../data/bids_data';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { bidsModalShow, buyModalShow } from '../../redux/counterSlice';
import { useDispatch } from 'react-redux';
import Likes from '../likes';
import { getAsks } from '../../utils/api';
import {
  isAsksModuleApproved,
  setApprovalForAsksModule,
  fillAsk,
} from '../../utils/contractMethods';
import { useSigner } from '@thirdweb-dev/react';

const BidsCarousel = () => {
  const dispatch = useDispatch();
  const handleclick = () => {
    console.log('clicked on ');
  };
  const [asks, setAsks] = useState([]);
  const signer = useSigner();

  useEffect(() => {
    const getAsksData = async () => {
      const data = await getAsks();
      console.log('datass', data);
      setAsks(data);
    };
    getAsksData();
  }, []);

  const handleBuy = async (tokenId, eth_number) => {
    const isApproved = await isAsksModuleApproved(signer);
    // await registerModule(signer);
    if (!isApproved) {
      await setApprovalForAsksModule(signer);
    } else {
      console.log('approved');
    }
    const priceEther = eth_number.toString();
    await fillAsk(
      signer,
      tokenId,
      '0x41aF21c0aD29668aD41d3d39efAFD1e3f93E0e4a',
      priceEther
    );
  };

  console.log('asks', asks);
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView="auto"
        loop={true}
        breakpoints={{
          240: {
            slidesPerView: 1,
          },
          565: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: '.bids-swiper-button-next',
          prevEl: '.bids-swiper-button-prev',
        }}
        className=" card-slider-4-columns !py-5"
      >
        {asks.map((item) => {
          const {
            id,
            image,
            title,
            bid_number,
            eth_number,
            react_number,
            tokenID,
          } = item;
          const itemLink = image
            .split('/')
            .slice(-1)
            .toString()
            .replace('.jpg', '');
          return (
            <SwiperSlide className="text-white" key={id}>
              <article>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                  <figure>
                    {/* {`item/${itemLink}`} */}
                    <Link href={'/item/' + itemLink}>
                      <Image
                        src={image}
                        alt={title}
                        height={230}
                        width={230}
                        className="rounded-[0.625rem] w-full lg:h-[230px] object-cover"
                        loading="lazy"
                      />
                    </Link>
                  </figure>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href={'/item/' + itemLink}>
                      <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                        {title}
                      </span>
                    </Link>
                    <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                      <Tippy content={<span>ETH</span>}>
                        <Image
                          width={12}
                          height={12}
                          src="/images/eth-icon.svg"
                          alt="icon"
                          className="w-3 h-3 mr-1"
                        />
                      </Tippy>

                      <span className="text-green text-sm font-medium tracking-tight">
                        {eth_number} TAREA
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="dark:text-jacarta-300 text-jacarta-500">
                      Current offer
                    </span>
                    <span className="dark:text-jacarta-100 text-jacarta-700">
                      {bid_number} TAREA
                    </span>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      className="text-accent font-display text-sm font-semibold"
                      onClick={() => handleBuy(tokenID, eth_number)}
                    >
                      Buy Now
                    </button>

                    <Likes
                      like={react_number}
                      classes="flex items-center space-x-1"
                    />
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default BidsCarousel;
