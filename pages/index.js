import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '../components/Logo'
import HeroImage from '../public/hero.webp'

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>透過OpenAI的力量，在短時間內自動生成有高品質內容且SEO優化的文章</p>
        <Link href="/post/new" className="btn hover:bg-[#2a9696]  mt-6">
          開始使用
        </Link>
      </div>
    </div>
  )
}
