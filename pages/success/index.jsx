import React from 'react'
import AppLayout from '../../components/AppLayout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import getAppProps from '../../lib/getAppProps'

const Success = () => {
  return (
    <div className="flex items-center justify-center">
      <h1>感謝您的購買!</h1>
    </div>
  )
}

Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export default Success

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context)
    return {
      props,
    }
  },
})
