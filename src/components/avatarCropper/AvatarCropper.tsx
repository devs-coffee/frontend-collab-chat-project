import Cropper from 'react-easy-crop';
import { Field } from 'formik';
import { Button, Slider } from '@mui/material';
import { useState } from 'react';
import { Point, Area } from 'react-easy-crop/types';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import AddAPhotoTwoToneIcon from '@mui/icons-material/AddAPhotoTwoTone';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import getCroppedImg from '../../utils/canvasUtils';

import './AvatarCropper.scss';

export default function AvatarCropper(props:any) {
    const [ crop, setCrop ] = useState<Point>({ x:0, y: 0 });
    const [ zoom, setZoom ] = useState<number>(1);
    //const [ props.cropperImage, props.setCropperImage ] = useState<string>('');

    const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
        const crop = await getCroppedImg(props.cropperImage, croppedAreaPixels)
        if(crop) {
            props.setCropperImage(crop);
        }
    };

    const askImageSelection = () => {
        const inputEl = document.querySelector('#image') as HTMLInputElement;
        inputEl.click();
    };

    const onFileSelected = (event:any) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            if(reader.result) {
                props.setCropperImage(reader.result.toString());
                //props.setImage(reader.result.toString());
            }
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    const avoidImageEdition = () => {
        if(document.getElementById('image')){
            const elt = document.getElementById('image') as HTMLInputElement;
            elt.value="";
        }
        props.setCropperImage('');
    };

    const deleteAvatar = () => {
        //props.setImage(null);
        avoidImageEdition();
    }

    return (
        <div className="AvatarCropper">
            {props.cropperImage &&
                <div className="crop-container">
                    <Cropper
                        image={props.cropperImage}
                        crop={crop}
                        cropShape="round"
                        showGrid={false}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                    <div className="avoid-badge" title="annuler" onClick={avoidImageEdition} >
                        <HighlightOffTwoToneIcon sx={{ color: '#800101' }} />
                    </div>
                </div>
            }
            {props.cropperImage && <div className="slider-box"><Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="zoom"
                onChange={(e, zoom) => setZoom(Number(zoom))}
            /></div>}
            <Field type="file" id="image" name="image" onChange={onFileSelected} />
            
            {!props.cropperImage && !props.userImage &&
                <Button variant="contained" startIcon={<AddAPhotoTwoToneIcon />} onClick={askImageSelection}>
                    Ajouter
                </Button>
            }
        </div>
    )
}