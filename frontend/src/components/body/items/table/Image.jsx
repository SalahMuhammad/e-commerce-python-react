
export default function Image({ src, bigImgRef, isImageClicked, setIsImageClicked }) {
  
  function handleOnMouseOverImage(e) {
    if (! isImageClicked) {
      e.stopPropagation();
      bigImgRef.current.classList.add('active');
      bigImgRef.current.src = e.target.src;
    }
  }

  function handleOnClickOverImage(e) {
    // e.stopPropagation();
    bigImgRef.current.src = e.target.src;
    setIsImageClicked(true);
  }

  return (
    <img onMouseOver={handleOnMouseOverImage} onClick={handleOnClickOverImage} src={src} alt="#" />
  )
}