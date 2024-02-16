'use client'
import Register from '@/components/Register'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mainPic from '../../public/mainpic.png'
import {PageIcon, PageIcon2} from '@/components/Svg';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('Token');

    if (token) {
      router.replace('/farm');
    }
  }, [router]);

  return (
    <main className="flex flex-col p-8 gap-6 justify-items-center">
      {/* box 0 */}
      <div className="skeleton h-16 w-full hidden md:hidden"></div>
      {/* box 1 */}
      <div className="w-full md:hidden">
        <PageIcon />
      </div>
      {/* box 2 */}
      <div className="w-full font-bold text-md md:hidden">
        แพลตฟอร์มฟาร์มทุเรียนที่ถูกออกแบบเพื่อให้บริการ
        อย่างครบวงจรแก่เจ้าของฟาร์มทุเรียน เพื่อช่วยให้
        พวกเขาปรับปรุงการดำเนินงาน เพื่อผลผลิตสูงสุด
      </div>
      {/* box 3 */}
      <div className="w-full md:hidden">
        <Image src={mainPic} alt={"Main Picture of Home"} priority />
      </div>
      {/* box 4 */}
      <div className="md:hidden block">
        <Register />
      </div>

      {/* web layout */}
      <div className="hidden md:grid grid-cols-2 gap-4 px-16 py-6 lg:place-items-center max-h-fit
      sm:px-6 sm:place-items-start">
        <div className="flex-col w-full space-y-4">
          {/* box 0 */}
          <div className="font-bold mb-6 2xl:text-[9rem] xl:text-[7rem] lg:text-[6rem] md:text-[4rem]">
            ยินดีต้อนรับสู่
          </div>
          {/* box 1 */}
          <div className="bg-primary flex justify-center 2xl:h-52 xl:h-48 lg:32 md:h-28">
            <PageIcon2 />
          </div>
          {/* box 2 */}
          <div className="2xl:text-3xl xl:text-2xl font-semibold lg:text-xl md:text-sm">
            แพลตฟอร์มฟาร์มทุเรียนที่ถูกออกแบบเพื่อให้บริการ
            อย่างครบวงจรแก่เจ้าของฟาร์มทุเรียน เพื่อช่วยให้
            พวกเขาปรับปรุงการดำเนินงาน เพื่อผลผลิตสูงสุด
          </div>
          {/* box 4 */}
          <div className="md:block hidden">
            <Register />
          </div>
        </div>
        {/* box 3 */} 
        <div className="w-full">
          <Image src={mainPic} alt={"Main Picture of Home"} className='object-cover object-bottom lg:h-[48rem] md:h-[30rem] ' priority />
        </div>
      </div>
    </main>
  )
}
