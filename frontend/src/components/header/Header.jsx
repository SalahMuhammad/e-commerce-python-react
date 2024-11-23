import { Link } from "react-router-dom"
{/* <Link to="الاصناف">أ ب ـ</Link> */ }
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function NavScrollExample() {
	return (
		<Navbar expand="lg" className="bg-body-tertiary">
			<Container fluid>
				<Navbar.Brand as={Link} to='/'>&gt;\_&lt;</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '100px' }}
						navbarScroll
					>
						<Nav.Link as={Link} to='/الاصناف'>الاصناف</Nav.Link>
						<Nav.Link as={Link} to='/invoices'>الفواتير</Nav.Link>
						<Nav.Link as={Link} to='/العملاء-الموردين'>العملاء/الموردين</Nav.Link>
						<Nav.Link as={Link} to='/المخازن'>المخازن</Nav.Link>
						{/* <NavDropdown title="Link" id="navbarScrollingDropdown">
							<NavDropdown.Item href="#action3">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action4">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action5">
								Something else here
							</NavDropdown.Item>
						</NavDropdown> */}
						{/* <Nav.Link href="#" disabled>
							Link
						</Nav.Link> */}
					</Nav>
					{/* <Form className="d-flex">
						<Form.Control
							type="search"
							placeholder="Search"
							className="me-2"
							aria-label="Search"
						/>
						<Button variant="outline-success">Search</Button>
					</Form> */}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavScrollExample;