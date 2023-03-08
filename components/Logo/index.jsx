import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Logo = () => {
  return (
    <div className="text-3xl text-center py-4 font-heading">
      FattyAutoBlog
      <FontAwesomeIcon
        icon={faBrain}
        className="ml-2 text-2xl text-slate-400"
      />
    </div>
  )
}

export default Logo
