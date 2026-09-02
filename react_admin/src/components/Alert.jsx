import React from 'react'
const Alert = (props) => {
  return (
    props.alert &&
    <div className='alertPopup'>
      <div className={`alert alert-${props.alert.type}`} variant={`${props.alert.type}`} role="alert">
        <strong>{props.alert.message}</strong>
      </div>
    </div>
  )
}
export default Alert