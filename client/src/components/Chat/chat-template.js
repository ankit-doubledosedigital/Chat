import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/chat.css';
import axios from 'axios';
import inviteService from '../service/InviteService';
import chatCircle from '../Assets/chat-circle-image.png';
import groupCircle from '../Assets/group-profile.png';
import { Link, Router, useNavigate } from 'react-router-dom';
import '../Chat/style.css'
import { Toast } from 'bootstrap';

import 'primeicons/primeicons.css';





const API_URL = 'http://localhost:5000';













export const ChatBoxTemplate = ({

  seenMessageUsers = [],
  chatRoomName,
  // groups = [],

  // createPersonalChat,
  inviteContact,
  // searchString = '',
  isLoading,
  openNewGroupModal,
  formatTimeAgo,
  uid,
  clearChat,
  activeContact,
  isDelete,
  deletePersonalChat,
  deleteOrLeaveChat,
  isMenuOpen = true,
  isViewGroup,
  currentGroup,

  nameEditState,
  updateGroup,
  socket,

}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [changeGroupName, setChangeGroupName] = useState('');
  const [invitationCode, setinvitationCode] = useState([]);
  const [newGroupProfileSrc, setNewGroupProfileSrc] = useState(null);
  let [searchString, setSearchString] = useState('');
  const [cropImgSrc, setCropImgSrc] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [fieldError, setFieldError] = useState('');
  const [message, setMessage] = useState('');
  const [groupId, setGroupId] = useState(null);
  const [tempGroup, setTempGroup] = useState();
  const [selectedTab, setSelectedTab] = useState('allChats');
  const [selectedGroup, setSelectedGroup] = useState();
  const [currentChat, setCurrentChat] = useState([]);

  const [selectedChat, setSelectedChat] = useState('')
  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();


  let [groups, setGroups] = useState([])

  uid = localStorage.getItem('userId')

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewGroupProfileSrc(file);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value.trim();
    setEmail(email);
    validateEmail(email);
  };

  const validateEmail = (email) => {
    if (!email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(email)) {
      setFieldError('Invalid email address');
    } else {
      setFieldError('');
    }
  };

  const handleAction = () => {
    if (selectedGroup?.isGroup === false) {
      deletePersonalChat();
    } else {
      deleteOrLeaveChat(isDelete);
    }
  };

  const resetUpload = () => {
    setNewGroupProfileSrc(null);
    setCropImgSrc(null);
  };



  // Create Group

  const createNewGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name.');
      return;
    }

    setInProgress(true);

    try {
      let formData = new FormData();
      const fileName = `${new Date().toISOString().replace(/[-:.]/g, '')}_${Math.floor(
        100000 + Math.random() * 900000
      )}.png`;
      if (newGroupProfileSrc) {
        formData.append('file', newGroupProfileSrc);
        formData.append('groupProfilePictureSrc', fileName);
      }

      formData.append('uid', uid);
      formData.append('isGroup', true);
      formData.append('name', newGroupName.trim());
      formData.append('invitees', JSON.stringify(seenMessageUsers));

      const response = await axios.post(`${API_URL}/chat/createGroup`, formData, {
        params: {
          uid: localStorage.userId,
          imgName: `${fileName}.png`,
          groupProfilePictureSrc: `${fileName}_picture.png`,
          prebuilt: false,
          name: newGroupName.trim()
        }
      }); {
        console.log("🚀 ~ response ~ response:", response)
        toast.success('Group created successfully!');
        setNewGroupName('');
        resetUpload();
        window.location.reload();


      };


    } catch (error) {
      toast.error('Failed to create group.');
    } finally {
      setInProgress(false);
    }
  };



  // Fecth Group API 

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/fetchGroups`, {
        params: {
          uid: localStorage.getItem('userId') // Retrieve userId from localStorage
        }
      });
      setGroups(response.data.groups);




    } catch (error) {
      console.error("Error fetching groups:", error); // Log the error for debugging
    }
  };


  useEffect(() => {
    fetchGroups();
  }, []);


  // Function to handle group selection
  const handleGroupClick = (currentGroup) => {
    navigate(`/chat?chat=${currentGroup._id}`);
    setSelectedGroup(currentGroup);
  };

  // delete Group
  const deleteGroup = async () => {
    try {
      console.log('temp', tempGroup)
      const response = await axios.delete(`${API_URL}/chat/deletegroup/`, {
        params: {
          uid: localStorage.getItem('userId'),
          _id: tempGroup._id
        },
      });

      setGroups((prevGroups) => prevGroups.filter(group => group._id !== groupId));

      console.log("🚀 ~ deleteGroup ~ response:", response)
      console.log("Group deleted successfully");
      toast.success('Group deleted successfully!');
      window.location.reload();



    } catch (error) {
      console.error("Error deleting group:", error); // Log the error for debugging
      toast.error("Group Not Deleted")
    }
  };


  const setDeleteGroup = (group) => {
    setTempGroup(group)
    handleShow();

  };


  // Update Group

  const updateGroupName = async () => {
    try {
      if (!changeGroupName) {
        // Show a warning toast if the name is not provided
        toast.warning(changeGroupName);
        return;
      }

      const response = await axios.put(`${API_URL}/chat/updateGroup`, {
        _id: tempGroup._id,
        name: changeGroupName,

      });
      console.log("🚀 ~ updateGroupName ~ response:", response)

      if (response.status === 200) {
        window.location.reload()
        const index = groups.findIndex(obj => obj._id === tempGroup._id);

        // If the group is found, update its name in the list
        if (index !== -1) {
          groups[index].name = changeGroupName;
        }

        // Emit a socket event for the notification
        // socket.emit("notification", {
        //   ownerId: currentGroup.value.uid,
        //   uid: uid,
        //   groupId: groupId.value,
        //   // invitees: currentGroup.value.invitees,
        //   isDelete: false
        // });
      }
    } catch (error) {
      console.error('Error updating group name:', error);
      // Optionally, you can show an error toast message here
      toast.error('Failed to update group name');
    }
  };

  const setUpdate = (group) => {
    setTempGroup(group)

  }



  // Invite chat to Email

  const handleInviteChange = (e) => {
    setEmail(e.target.value);

  };


  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setFieldError('Email is required.');
      return;
    }

    setFieldError('');

    try {
      const invitationCode = generateInvitationCode(); // Generate or retrieve the invitation code as needed
      const response = await inviteService.sendInvite(invitationCode, email, tempGroup.name);

      setMessage('Invite sent successfully!');
      toast.success('Invite sent successfully!')
      setEmail(''); // Clear the input after successful invite
    } catch (error) {
      setMessage('Failed to send invite. Please try again.');
      toast.error('Failed to send invite. Please try again.')
    }
  };

  // Optional: Generate an invitation code if needed
  const generateInvitationCode = () => {
    return Math.random().toString(36).substr(2, 8); // Adjust length as necessary
  };

  const createNewChat = async (e) => {
    e.preventDefault();  // Prevent the form from submitting

    // Ensure you are setting email based on some input event or state
    if (!email) {
      setFieldError('Email is required.');
      return;
    }

    setFieldError('');

    try {
      const invitationCode = generateInvitationCode(); // Generate or retrieve the invitation code
      let link = `${window.location.origin}/invite?token=${tempGroup.invitationCode}`
      const response = await inviteService.sendInvite(link, email, tempGroup.name);

      setMessage('Invite sent successfully!');
      toast.success('Invite sent successfully!');
      setEmail(''); // Clear the input after successful invite
    } catch (error) {
      setMessage('Failed to send invite. Please try again.');
      toast.error('Failed to send invite. Please try again.');
    }
  };

  const setInviteGroup = (group) => {
    setTempGroup(group)
  }

  const sendMessage = async () => {
    try {

      const response = await axios.post(`${API_URL}/chat/sendMessage`, {
        data: {
          message: message,
          uid: uid,
          groupId: selectedGroup._id

        }

      });
      let user = {
        photoUrl: localStorage.getItem('pictures'),
        username: localStorage.getItem('name'),
        uid: localStorage.getItem('userId')
      }
      response.data.message.user = user
      currentChat.push(response.data.message)
      setMessage('')


      return response;
    } catch (error) {
      console.log(error)

    }

  }



  const fetchMessage = async () => {
    try {

      const response = await axios.get(`${API_URL}/chat/fetchMessage`, {
        params: {
          groupId: selectedGroup._id

        }
      });
      setCurrentChat(response.data.message)

      console.log("🚀 ~ fetchMessage ~ response.data:", response.data)



    } catch (error) {
      console.log(error)
      toast.warning("messahe is not fetch")
    }

  }


  useEffect(() => {
    fetchMessage();
  }, [selectedGroup]);








  const groupList = [
    // Add your groups data here
  ];

  const chats = [
    // Add your personal chats data here
  ];









  return (
    <>
      <div className="container-xxl h-100 w-75 bg-light p-5">
        <div className="container-xxl h-100 position-relative">
          {!groups.length ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <div className="white-card p-4 mb-4">
                <div className="text-center">
                  <img
                    src={chatCircle}
                    width="200"
                    alt="Chat Circle"
                    className="mb-3"
                  />
                  <h3>Create Your First Chat</h3>
                  <p>
                    Welcome to the Chat Circle! We’re excited to have you join our
                    vibrant community where you can connect, share, and engage with
                    others.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#personalChatModel"

                  >
                    New Chat
                  </button>
                </div>
              </div>

              <div className="white-card p-4">
                <div className="text-center">
                  <img
                    src={groupCircle}
                    width="200"
                    alt="Group Chat"
                    className="mb-3"
                  />
                  <h3>Create Your First Group</h3>
                  <p>
                    Create a group and connect with people sharing your interests.
                  </p>
                  <button
                    onClick={openNewGroupModal}
                    type="button"
                    className="btn btn-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#new-group-modal"
                  >
                    New Group Chat
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4 px-3 py-2 bg-warning rounded shadow-sm">
                <h5 className="mb-0 font-weight-bold text-danger">Talk Nexus</h5>

                <div>
                  <button
                    className="btn btn-outline-primary me-2 mb-2"
                    data-bs-toggle="modal"
                    data-bs-target="#personalChatModel"
                  >
                    + New Chat
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={openNewGroupModal}
                    data-bs-toggle="modal"
                    data-bs-target="#new-group-modal"
                  >
                    + New Group
                  </button>
                </div>
              </div>




              <div className="container-fluid vh-100">
                <div className="row h-100">
                  {/* Left Section: All Chats / Groups */}
                  <div className="col-12 col-md-4 col-lg-3 bg-white p-3 border-end shadow-sm h-100 w-25 overflow-auto">
                    <div className="d-flex justify-content-between align-items-center mb-4 px-3 py-2 bg-light rounded shadow-sm">
                      <h5 className="mb-0 font-weight-bold text-primary">Chat</h5>
                      <div>
                        <button
                          className={`btn ${selectedTab === 'allChats' ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                          onClick={() => setSelectedTab('allChats')}
                        >
                          All Chats
                        </button>
                        <button
                          className={`btn ${selectedTab === 'personalChats' ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                          onClick={() => setSelectedTab('personalChats')}
                        >
                          Personal Chats
                        </button>
                        <button
                          className={`btn ${selectedTab === 'groups' ? 'btn-primary' : 'btn-outline-primary'} mb-2`}
                          onClick={() => setSelectedTab('groups')}
                        >
                          Groups
                        </button>
                      </div>
                    </div>

                    {/* Conditionally render based on selected tab */}
                    <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                      {selectedTab === 'allChats' && (
                        <div className="groups-section">
                          <h5>All Chats</h5>
                          {groups.map((group, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded shadow-sm"
                            >
                              {/* Group Profile Photo */}
                              <img
                                src={group.profilePhoto || 'path_to_default_image.jpg'}
                                alt={group.name || 'Group Image'}
                                className="rounded-circle me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />

                              {/* Group Name */}
                              <button
                                className="btn btn-link text-dark flex-grow-1 text-start"
                                onClick={() => handleGroupClick(group)}
                              >
                                {group.name}
                              </button>

                              {/* Dropdown Menu */}
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle "
                                  type="button"
                                  id={`dropdownMenuButton-${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="pi pi-ellipsis-v" style={{ fontSize: '1rem' }}></i>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${index}`}>
                                  {/* Edit Option */}
                                  <li>
                                    <button
                                      onClick={() => setUpdate(group)}
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#update-group-modal"
                                    >
                                      Edit
                                    </button>
                                  </li>

                                  {/* Delete Option */}
                                  <li>
                                    <button
                                      onClick={() => setDeleteGroup(group)}
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#deleteConfirmationModal"
                                    >
                                      Delete
                                    </button>
                                  </li>

                                  {/* Share Option */}
                                  <li>
                                    <button
                                      onClick={() => setInviteGroup(group)}
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#inviteChatModel"
                                    >
                                      Share
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>

                      )}

                      {selectedTab === 'personalChats' && (
                        <div className="personal-chats-section">
                          <h5>Personal Chats</h5>
                          {chats.map((chat, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded shadow-sm">
                              <p className="mb-0">{chat.name}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedTab === 'groups' && (
                        <div className="groups-section">
                          <h5>Groups</h5>
                          {groups.map((group, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded shadow-sm">
                              <img
                                src={group.profilePhoto || 'path_to_default_image.jpg'}
                                alt={group.name || 'Group Image'}
                                className="rounded-circle me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <button className="btn btn-link text-dark flex-grow-1 text-start" onClick={() => handleGroupClick(group)}>
                                {group.name}
                              </button>
                              <div className="d-flex">
                                <button
                                  onClick={() => setUpdate(group)}
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary me-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#update-group-modal"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteGroup(group)}
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteConfirmationModal"
                                >
                                  Delete
                                </button>


                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section: Messages */}
                  <div className="col-12 col-md-8 col-lg-9 p-3 h-100 d-flex flex-column">
                    <h5 className="mb-3">Messages</h5>
                    {selectedGroup ? (
                      <div className="message-box bg-light p-4 rounded shadow-sm flex-grow-1 d-flex flex-column overflow-auto">
                        <header className="mb-3 border-bottom pb-2 d-flex align-items-center">
                          {/* Profile Picture */}
                          <img
                            src={selectedGroup.profilePhoto}
                            alt="Group"
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />

                          {/* Group Info */}
                          <div className="d-flex flex-column">
                            <h6 className="mb-0">
                              Chat content for group: <span className="text-primary">{selectedGroup.name}</span>
                            </h6>
                            {selectedGroup.invitees && selectedGroup.invitees.length > 0 && (
                              <p>{selectedGroup.invitees.length + 1} participants</p>
                            )}

                          </div>
                        </header>

                        {/* Chat messages */}
                        <div className="chat-messages flex-grow-1 overflow-auto mb-3">
                          {currentChat.map((message, index) => (
                            <div
                              key={index}
                              className={`message-item ${message.uid === uid ? 'sent' : 'received'} mb-2`}
                            >
                              <div className="message-bubble">
                                {/* Displaying the username */}
                                <div className='d-flex justify-content-center'>
                                  <img src={message.user.photoUrl}
                                    alt="user"
                                    className="rounded-circle me-3"
                                    style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                                  />
                                  <p className={`${message.uid === uid ? 'sent' : 'received'}-username mb-1`}>
                                    <b>{message.user.username}</b>
                                  </p>

                                </div>
                                {/* Displaying the message */}
                                <span className={`${message.uid === uid ? 'sent' : 'received'}-message`}>
                                  {message.message}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>





                        {/* Input box */}
                        <div className="chat-input-box d-flex align-items-center">
                          <input type="text" className="form-control me-2" placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)} />
                          <button onClick={sendMessage} className="btn btn-primary">Send</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted">Select a group to view messages</p>
                    )}
                  </div>




                </div>
              </div>








            </div>
          )}
        </div>

        {/* New Group Modal */}
        <div
          className="modal fade"
          id="new-group-modal"
          tabIndex="-1"
          aria-labelledby="newGroupModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title">Create New Group</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                />
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {cropImgSrc && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(cropImgSrc)}
                      alt="Cropped Preview"
                      className="img-thumbnail"
                    />
                    <button className="btn btn-danger mt-2" onClick={resetUpload}>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={inProgress || !newGroupName.trim()}
                  onClick={createNewGroup}
                >
                  {inProgress ? "Creating..." : "Create Group"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Group Modal */}
        <div
          className="modal fade"
          id="update-group-modal"
          tabIndex="-1"
          aria-labelledby="updateGroupModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title">Edit Group</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter group name"
                  value={changeGroupName}
                  onChange={(e) => setChangeGroupName(e.target.value)}
                  required
                />
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {cropImgSrc && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(cropImgSrc)}
                      alt="Cropped Preview"
                      className="img-thumbnail"
                    />
                    <button className="btn btn-danger mt-2" onClick={resetUpload}>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={!changeGroupName.trim()}
                  onClick={updateGroupName}
                >
                  {inProgress ? "Updating..." : "Update Group"}
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteConfirmationModal" tabIndex="-1" data-bs-backdrop="static">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title">Delete Confirmation</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body pt-0">
                {isDelete ? (
                  <p className="mb-0 fs-14">
                    Do you really want to delete this {selectedGroup?.isGroup === false ? 'chat' : 'group'}?
                  </p>
                ) : (
                  <p className="mb-0 fs-14">Do you really want to leave this group?</p>
                )}
                {selectedGroup?.uid === uid && isDelete && selectedGroup?.isGroup === true && selectedGroup?.invitees?.length > 0 && (
                  <p className="mb-0 fs-12 mt-2">
                    <span className="text-danger">Note:</span> All the members will be removed.
                  </p>
                )}
              </div>
              <div className="modal-footer border-0">
                <div className="d-flex w-100">
                  <button
                    type="button"
                    className="btn btn-primary w-100 me-2"
                    data-bs-dismiss="modal"
                    onClick={deleteGroup}
                  >
                    Yes
                  </button>
                  <button type="button" className="btn btn-default w-100" data-bs-dismiss="modal">
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>




        {/* Personal invite Chat Modal */}
        <div
          className="modal fade"
          id="personalChatModel"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
          onClick={createNewChat}

        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title">Invite Contact</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className={`form-control ${fieldError ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                  value={email}
                  onChange={handleInviteChange}
                  required
                />
                {fieldError && (
                  <div className="invalid-feedback">{fieldError}</div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={!email || fieldError}
                  onClick={handleInviteSubmit}
                >
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invite  Chat Modal */}
        <div
          className="modal fade"
          id="inviteChatModel"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
          onClick={createNewChat}

        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title">Invite Contact</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className={`form-control ${fieldError ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                  value={email}
                  onChange={handleInviteChange}
                  required
                />
                {fieldError && (
                  <div className="invalid-feedback">{fieldError}</div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={!email || fieldError}
                  onClick={handleInviteSubmit}
                >
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </>


  );
};
