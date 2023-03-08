import React from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import AppLayout from '../../components/AppLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import getAppProps from '../../lib/getAppProps'

const TokenPopup = props => {
  const handleClick = async () => {
    const res = await fetch('/api/popupTokens', {
      method: 'POST',
    })

    const result = await res.json()
    window.location.href = result.session.url
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="ml-2">儲值頁面</h1>
      <button
        className="btn hover:bg-[#2a9696]  text-black hover:text-white w-2/5 mx-auto animate-pulse shadow-md shadow-slate-200"
        onClick={handleClick}
      >
        <span className="pr-1">點擊儲值Fatty幣</span>
        <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
      </button>
    </div>
  )
}

TokenPopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}
export default TokenPopup

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context)
    return {
      props,
    }
  },
})
