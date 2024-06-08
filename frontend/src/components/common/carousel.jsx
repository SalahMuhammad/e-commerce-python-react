import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

// import ExampleCarouselImage from 'components/ExampleCarouselImage';
``

function MyCarousel({ srcs }) {
	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};

	return (
		<>
		<Carousel fade data-bs-theme="dark" activeIndex={index} onSelect={handleSelect} controls>
			{srcs.map((src, index) => (
				<Carousel.Item key={`${src[41] + src[42]}${index}`}>
					<img src={src} alt="فشل فى تحميل الصوره" />
					{/* <ExampleCarouselImage text="First slide" /> */}
					{/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus nemo tempora minus repellendus veritatis molestias dolor, aliquam ab vel ipsa ad ullam at, dolorum consequuntur quis illo perspiciatis odit repellat.</p> */}
					{/* <Carousel.Caption>
						<h3>First slide label</h3>
						<p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
					</Carousel.Caption> */}
				</Carousel.Item>
			))}
			{/* <Carousel.Item>
        <ExampleCarouselImage text="Second slide" />
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/29/5c/img-worlds-of-adventure.jpg?w=1200&h=1200&s=1" alt="fd" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage text="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */}
		</Carousel>
		</>
	);
}

export default MyCarousel;