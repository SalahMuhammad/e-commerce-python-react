
export default function Image({ src, bigImgRef }) {  
  function handleOnMouseOverImage(e) {    
    e.stopPropagation();
    bigImgRef.current.classList.add('active');
    bigImgRef.current.src = e.target.src;
  }

  function handleOnClickOverImage(e) {
    e.stopPropagation();
    bigImgRef.current.classList.add('clicked')
    bigImgRef.current.src = e.target.src;
  }

  return (
    <img onMouseOver={handleOnMouseOverImage} onClick={handleOnClickOverImage} src={src} alt="..." />
  )
}
