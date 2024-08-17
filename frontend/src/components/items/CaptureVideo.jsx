import { useRef } from 'react';
import { getData } from '../api';
import { toast } from 'react-toastify';

const CameraInput = ({ onSuccess }) => {
	// const [image, setImage] = useState(null);
	const fileInputRef = useRef(null);

	const tryAccessCamera = async () => {
		// Try getUserMedia first
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			try {
				await navigator.mediaDevices.getUserMedia({ video: true });
				alert("Camera access successful via getUserMedia!");
				// Implement your camera logic here
			} catch (err) {
				console.log("getUserMedia failed, trying file input...");
				fileInputRef.current.click(); // Trigger file input
			}
		} else {
			console.log("getUserMedia not supported, trying file input...");
			fileInputRef.current.click(); // Trigger file input
		}
	};

	const handleFileInput = (event) => {
		const file = event.target.files[0];``
		const formData = new FormData()
		formData.append('img', file)
		const response = getData('api/items/getbarcode/', 'post', formData, {headers: {'Content-Type': 'multipart/form-data'},});
		toast.promise(
			response,
			{
				pending: 'جارى فحص الصوره...',
			}
		)
		onSuccess(response)
	};

	return (
		<>
			<button className='camera-ico' onClick={tryAccessCamera}><i className="fa-solid fa-camera-retro"></i></button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleFileInput}
				style={{ display: 'none' }}
			/>
			{/* {image && <img src={image} alt="Captured" style={{maxWidth: '100%'}} />} */}
		</>
	);
};

export default CameraInput;


// export const Aaaaaa = () => {
// 	const videoRef = document.getElementById('player');
// 	const canvasRef = document.getElementById('canvas');
	// const captureButtonRef = document.getElementById('capture');
// 	// const context = canvas.getContext('2d');

// 	const constraints = {
// 		audio: true,
// 		video:
// 		{
// 			facingMode: { exact: "environment" }
// 		}
// 	};

// 	const handleClick = () => {
// 		try {
// 			const context = canvasRef.current.getContext('2d')
// 			context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

// 			navigator.mediaDevices.getUserMedia(constraints)
// 				.then((stream) => {
// 					videoRef.current.srcObject = stream;
// 				});
// 		} catch (err) {
// 			console.log(err)
// 		}
// 	}

// 	return (
// 		<>
// 			<video ref={videoRef} id="pflayer" autoPlay></video>
// 			<button ref={captureButtonRef} onClick={handleClick} id="capsture">Capture</button>
// 			<canvas ref={canvasRef} id="csanvas" width={320} height={240}></canvas>
// 		</>
// 	)
// }


// required https
// export const camera = function () {
// 	let width = 0;
// 	let height = 0;

// 	const createObjects = function () {
// 		const video = document.createElement('video');
// 		video.id = 'video';
// 		video.width = width;
// 		video.width = height;
// 		video.autoplay = true;
// 		document.body.appendChild(video);

// 		const canvas = document.createElement('canvas');
// 		canvas.id = 'canvas';
// 		canvas.width = width;
// 		canvas.width = height;
// 		document.body.appendChild(canvas);
// 	}


// 	return {
// 		video: null,
// 		context: null,
// 		canvas: null,

// 		startCamera: function (w = 680, h = 480) {
// 			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// 				try {

// 					width = w;
// 					height = h;

// 					createObjects();

// 					this.video = document.getElementById('video');
// 					this.canvas = document.getElementById('canvas');
// 					this.context = this.canvas.getContext('2d');


// 					(function (video) {
// 						navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
// 							video.srcObject = stream;
// 							video.play();
// 						});
// 					})(this.video)
// 				} catch (err) {
// 					alert(`an errro occured: ${err}`)
// 				}

// 			}
// 		},


// 		takeSnapshot: function () {
// 			try {

// 				this.context.drawImage(this.video, 0, 0, width, height);
// 			} catch (err) {
// 				alert(`errrrrrrrrrrrrrr: ${err}`)
// 			}
// 		}
// 	}
// }();
