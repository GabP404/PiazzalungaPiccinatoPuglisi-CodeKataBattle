import React, { useState } from 'react';
import { Button, Container, ListGroup, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import api from '../../utilities/api';
import { useNavigate } from 'react-router-dom';





const BattleListItemOngoing = ({ battleId,  battleState, nameBattle, subscriptionDeadline, submissionDeadline, role, status, minStudentsInGroup, maxStudentsInGroup }) => {
  const [show, setShow] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleInfoClick = () => {
    navigate(`/battle/${battleId}`);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
      setUsername(''); // Clear the username input when opening the modal
      setShow(true);
  };

  const addInvitation = () => {
      if (username && !invitations.includes(username)) {
          setInvitations([...invitations, username]);
          setUsername(''); // Clear input after adding
      }
  };

  const handleInvite = () => {
    addInvitation();
    handleClose();
  };


  const deleteInvitation = (usernameToDelete) => {
      setInvitations(invitations.filter((uname) => uname !== usernameToDelete));
  };

  const handleEnroll = async () => {

    const data = {
      educatorsInvited: invitations,
    };

    console.log(data);
    console.log(battleId);

    api.post(`/battles/${battleId}/enroll`, invitations)
      .then((response) => {
        console.log(response);
        console.log('Enrolled in Battle', response.data);
        alert('Enrolled in battle: ' + response.data)
        navigate(0);
      })
      .catch((error) => {
        console.error('Error enrolling in Battle', error);
        alert('Error enrolling in battle\n' + error.response.data.message)
      });
  }

  const isSubscriptionDeadlinePassed = new Date(subscriptionDeadline) < new Date();
  const isSubmissionDeadlinePassed = new Date(submissionDeadline) < new Date();
  

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  function renderDeadline(state, subscriptionDeadline, submissionDeadline) {
    if (state === 'SUBSCRIPTION') {
      return formatDateTime(subscriptionDeadline);
    } else if (state === 'ONGOING') {
      return formatDateTime(submissionDeadline);
    }
    // Optionally return something if neither condition is met
    return null;
  }
  

  return (
    <Container>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Students</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Enter the username of the student"
                        name="invitations"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInvitation()}
                    />
                    <ListGroup className="mt-3">
                        {invitations.map((invite, index) => (
                            <ListGroup.Item key={index}>
                                {invite}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteInvitation(invite)}
                                    style={{ float: 'right' }}
                                >
                                    Delete
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleInvite}>
                      Invite
                    </Button>
                    <Button variant="primary" onClick={addInvitation}>
                        Add
                    </Button>
                    <Button variant="primary" onClick={handleEnroll}>
                      Enroll
                    </Button>
                    
                </Modal.Footer>
            </Modal>
    <ListGroup.Item className="d-flex justify-content-between align-items-start">
      <div className="ms-2 me-auto">
        <div className="fw-bold">#{battleId} - {nameBattle} [{minStudentsInGroup} - {maxStudentsInGroup}]</div>
          <div style={{ color: isSubscriptionDeadlinePassed && isSubmissionDeadlinePassed ? 'red' : 'green' }}>
            {battleState} - {renderDeadline(battleState, subscriptionDeadline, submissionDeadline)}
          </div>
        </div>
      
      <Button className="me-2" onClick={handleInfoClick}>Info</Button>
      {/* Only show Join button if user is a student */}
      {role === 'ROLE_STUDENT' && battleState === 'SUBSCRIPTION' && <Button variant={isSubscriptionDeadlinePassed && isSubmissionDeadlinePassed ? 'secondary' : 'primary'} onClick={handleShow} disabled={isSubscriptionDeadlinePassed}>Join</Button>}
    </ListGroup.Item>
    </Container>
  );
};

export default BattleListItemOngoing;
