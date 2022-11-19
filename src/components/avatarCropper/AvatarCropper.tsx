import Cropper from 'react-easy-crop';
import { Field } from 'formik';
import { Button, Slider } from '@mui/material';
import { useState } from 'react';
import { Point, Area } from 'react-easy-crop/types';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import AddAPhotoTwoToneIcon from '@mui/icons-material/AddAPhotoTwoTone';

import getCroppedImg from '../../utils/canvasUtils';

import './AvatarCropper.scss';

export default function AvatarCropper(props:any) {
    const [ crop, setCrop ] = useState<Point>({ x:0, y: 0 });
    const [ zoom, setZoom ] = useState<number>(1);
    const [baseImage , setBaseImage] = useState<string>('');
    const inputEl = document.querySelector('#imageInput') as HTMLInputElement;

    //accepted images mime types
    const mimeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];
    
    const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
        const crop = await getCroppedImg(baseImage, croppedAreaPixels);
        if(crop) {
            props.setImage(crop);
        }
    };

    const askImageSelection = () => {
        const inputEl = document.querySelector('#imageInput') as HTMLInputElement;
        inputEl.click();
    };

    const onFileSelected = (event:any) => {
        const reader = new FileReader();
        const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
        reader.readAsDataURL(file);
        reader.onload = function () {
            if(reader.result) {
                if(event.target.files) {
                    event.target.value="";
                }
                props.setImage(reader.result.toString());
                setBaseImage(reader.result.toString());
                props.setCropperImage(reader.result.toString())
            }
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    const avoidImageEdition = () => {
        inputEl.value="";
        props.setImage('');
        props.setCropperImage('');
    };

    const handleDrop = (event:any) => {
        event.preventDefault();
        event.stopPropagation();
        if(mimeTypes.includes(event.dataTransfer.files[0].type)) {
            onFileSelected(event);
            props.avoidImageSelection();
        } else {
            console.log('invalid type');
        }
    }

    const handleDrag = (event:any) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDragIn = (event:any) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDragOut = (event:any) => {
        event.preventDefault();
        event.stopPropagation();
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
            <Field type="file" id="imageInput" name="image" onChange={onFileSelected} />
            
            {!props.cropperImage && !props.previousImage &&
                <Button variant="contained" startIcon={<AddAPhotoTwoToneIcon />} onClick={askImageSelection}>
                    Ajouter
                </Button>
            }
            {props.imageSelection &&
                <div className="droparea" onDrop={handleDrop} onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag}>
                    <p>déposer une image<br/><br/>ou</p>
                    <p className="image-input-trigger" onClick={askImageSelection}>sélectionner un fichier</p>
                </div>
            }
            
        </div>
    )
}