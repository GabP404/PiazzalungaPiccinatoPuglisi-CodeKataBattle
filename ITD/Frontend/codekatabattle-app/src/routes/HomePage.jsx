import React , {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";


import TournamentsList from "../components/TournamentsList";
import CreateTournament from "../components/CreateTournament";

function HomePage() {

    const [refreshTournaments, setRefreshTournaments] = useState(false);

    // Function to toggle the refresh state
    const handleRefresh = () => {
        setRefreshTournaments(prev => !prev);
    };


    return (
        <Container fluid className="px-0">
            <Header />
            {localStorage.getItem('role') == "ROLE_EDUCATOR" && (
            <Row>
                <Col md={3}></Col>
                <Col md={6} className="my-auto">
                    <CreateTournament onCreationSuccess={handleRefresh}/>
                </Col>
                <Col md={3}></Col>
            </Row>
            )}
            <Row className="min-vh-100">
                <Col md={1}></Col>
                <Col md={4} className="my-auto">
                    <TournamentsList
                    type = "Ongoing"
                    name = "Available Tournaments"
                    refreshKey={refreshTournaments}
                    />
                </Col>
                <Col md={2}></Col>
                <Col md={4} className="my-auto">
                    <TournamentsList
                    type = "Managed/Enrolled"
                    name = "Your Tournaments"
                    refreshKey={refreshTournaments}
                    />
                </Col>
                <Col md={1}></Col>
            </Row>
        </Container>
    );
}

export default HomePage;