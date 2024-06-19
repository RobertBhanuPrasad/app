import Avatar from 'react-avatar-edit'
import React, { useState } from 'react'

const ImageCrop = () => {
    const [src, setSrc] = useState('');
    const [preview, setPreview] = useState('')

    const onClose =()=>{
        setPreview('')
    }
    const onCrop=(view: any)=>{
        setPreview(view)
    }
    return <>
    <h1>Hellooooooo</h1>
    <div>
        <Avatar
          width={390}
          height={295}
          onCrop={onCrop}
          onClose={onClose}
          src={src}
        />
        <img src={preview} alt="Preview" />
      </div>
    </>
}

export default ImageCrop
