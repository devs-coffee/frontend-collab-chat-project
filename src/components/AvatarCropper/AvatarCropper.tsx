import { Slider } from '@mui/material';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/canvasUtils';
import { Area, Point } from 'react-easy-crop/types';

import './AvatarCropper.scss';
type avatar = {
    setImage: (image: string) => string
}

export function AvatarCropper({ setImage }: avatar) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [image, setBaseImage] = useState<string>('');
    const [croppedImage, setCroppedImage] = useState<string>('');
    //accepted images mime types
    const mimeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

    const onCropComplete = useCallback(async (croppedArea: Area, croppedAreaPixels: Area) => {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
            setCroppedImage(croppedImage);
        }
    }, [image])

    const askImageSelection = () => {
        const inputEl = document.querySelector('#imageInput') as HTMLInputElement;
        inputEl.click();
    };

    const onFileSelected = (event: any) => {
        const reader = new FileReader();
        const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
                if (event.target.files) {
                    event.target.value = "";
                }
                setBaseImage(reader.result.toString());
            }
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    const handleDrop = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        if (mimeTypes.includes(event.dataTransfer.files[0].type)) {
            onFileSelected(event);
        } else {
            console.log('invalid type');
        }
    }

    const handleDrag = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDragIn = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDragOut = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const validate = (e: Event, isValidate = false) => {
        e.preventDefault();
        isValidate ? setImage(croppedImage) : setBaseImage('');
    }

    return (
        <div className="AvatarCropper">
            {image && image !== '' &&
                <>
                    <div className="crop-container">
                        <Cropper
                            image={image}
                            crop={crop}
                            cropShape="round"
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="slider-box">
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="zoom"
                            onChange={(e, zoom) => setZoom(Number(zoom))}
                        />
                    </div>
                    <button onClick={(e: any) => validate(e, true)}>Valider</button>
                    <button onClick={(e: any) => validate(e)}>Annuler</button>
                </>
            }

            <input type="file" id="imageInput" name="image" onChange={onFileSelected} />
            {(!image || image === '') &&
                <div className="droparea" onDrop={handleDrop} onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag}>
                    <p>déposer une image<br /><br />ou</p>
                    <p className="image-input-trigger" onClick={askImageSelection}>sélectionner un fichier</p>
                </div>
            }
        </div>
    )
}