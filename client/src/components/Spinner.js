import React from 'react'
import { ClipLoader } from 'react-spinners'

function Spinner() {
  return (
    <div className="spinner">
      <ClipLoader color={'#1eaedb'} size={180} margin={'3px'} />
    </div>
  )
}

export default Spinner
